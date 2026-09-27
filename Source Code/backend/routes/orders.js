const express = require('express');
const router = express.Router();
const OrderModel = require('../models/Order');
const ProductModel = require('../models/Product');
const UserModel = require('../models/User');
const NotificationModel = require('../models/Notification');
const { requireAuth, requireRole } = require('../middleware/auth');

// Customer Place Pre-Order
router.post('/', requireAuth, async (req, res) => {
  try {
    const { farmerId, items, pickupDate, pickupTimeSlot, specialInstructions } = req.body;

    if (!farmerId || !items || !items.length || !pickupDate || !pickupTimeSlot) {
      return res.status(400).json({ message: 'Farmer, order items, pickup date, and time slot are required.' });
    }

    let customer = await UserModel.findById(req.user.id);
    if (!customer) customer = await UserModel.findOne({ _id: req.user.id }) || await UserModel.findOne({ email: req.user.email });

    let farmer = await UserModel.findById(farmerId);
    if (!farmer) farmer = await UserModel.findOne({ _id: farmerId });
    if (!farmer) {
      // Check if product's farmer exists
      const firstProd = items[0] ? await ProductModel.findById(items[0].productId) : null;
      if (firstProd && firstProd.farmerId) {
        farmer = await UserModel.findById(firstProd.farmerId) || await UserModel.findOne({ _id: firstProd.farmerId });
      }
    }
    if (!farmer) {
      farmer = await UserModel.findOne({ role: 'farmer' });
    }

    if (!farmer) {
      return res.status(404).json({ message: 'Selected farmer stall does not exist.' });
    }

    // Calculate total and verify stock
    let totalAmount = 0;
    const validatedItems = [];

    for (const item of items) {
      const product = await ProductModel.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.name || item.productId} not found.` });
      }
      if (product.isSoldOut || product.stock_quantity < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for ${product.name}. Available: ${product.stock_quantity} ${product.unit}` 
        });
      }

      const subtotal = product.price * item.quantity;
      totalAmount += subtotal;

      validatedItems.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        unit: product.unit,
        quantity: item.quantity,
        subtotal: parseFloat(subtotal.toFixed(2)),
        image: product.image
      });

      // Deduct stock quantity
      const newStock = product.stock_quantity - item.quantity;
      await ProductModel.findByIdAndUpdate(product._id, {
        stock_quantity: newStock,
        isSoldOut: newStock <= 0
      });
    }

    const orderNumber = 'ML-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);

    const newOrder = await OrderModel.create({
      orderNumber,
      customerId: req.user.id,
      customerName: customer ? customer.name : req.user.name,
      customerEmail: customer ? customer.email : req.user.email,
      customerPhone: customer ? customer.contactNumber : '',
      farmerId,
      farmerName: farmer.name,
      stallName: farmer.stallName || `${farmer.name}'s Farm`,
      marketId: farmer.marketsSellingAt ? farmer.marketsSellingAt[0] : 'mkt_01',
      marketName: 'Downtown Green Farmers Market',
      items: validatedItems,
      total_amount: parseFloat(totalAmount.toFixed(2)),
      order_status: 'placed',
      pickupDate,
      pickupTimeSlot,
      cutoffTime: `Cutoff: 4 hours prior to ${pickupDate}`,
      specialInstructions: specialInstructions || '',
      paymentStatus: `Pay in person at pickup: $${totalAmount.toFixed(2)} (Cash / Card / Mobile Pay)`
    });

    // Notify farmer of incoming pre-order
    await NotificationModel.create({
      userId: farmerId,
      title: 'New Pre-Order Received!',
      message: `Order #${orderNumber} placed by ${customer ? customer.name : 'Customer'} for ${pickupDate}. Total: $${totalAmount.toFixed(2)}`,
      type: 'order',
      link: '/farmer-dashboard'
    });

    // Notify customer
    await NotificationModel.create({
      userId: req.user.id,
      title: 'Pre-Order Confirmed!',
      message: `Your pre-order #${orderNumber} for ${pickupDate} has been placed. Payment is settled at the stall upon pickup.`,
      type: 'order',
      link: '/customer-dashboard'
    });

    res.status(201).json({
      message: 'Pre-order placed successfully!',
      order: newOrder
    });
  } catch (err) {
    console.error('Error placing pre-order:', err);
    res.status(500).json({ message: err.message || 'Error processing pre-order.' });
  }
});

// Customer View My Orders
router.get('/my-orders', requireAuth, async (req, res) => {
  try {
    const orders = await OrderModel.find({ customerId: req.user.id });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving order history.' });
  }
});

// Farmer View Incoming Pre-Orders
router.get('/farmer-orders', requireAuth, requireRole(['farmer', 'admin']), async (req, res) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { farmerId: req.user.id };
    const orders = await OrderModel.find(filter);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving incoming orders.' });
  }
});

// Farmer Update Order Status (accepted, ready_for_pickup, completed, declined)
router.patch('/:id/status', requireAuth, requireRole(['farmer', 'admin']), async (req, res) => {
  try {
    const { status, reason } = req.body;
    const validStatuses = ['placed', 'accepted', 'ready_for_pickup', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid order status.' });
    }

    const order = await OrderModel.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found.' });

    if (req.user.role !== 'admin' && order.farmerId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to manage this order.' });
    }

    const updates = { order_status: status };
    if (status === 'cancelled' && reason) {
      updates.cancellationReason = reason;
      // Restore product stock
      for (const item of order.items) {
        const prod = await ProductModel.findById(item.productId);
        if (prod) {
          await ProductModel.findByIdAndUpdate(prod._id, {
            stock_quantity: prod.stock_quantity + item.quantity,
            isSoldOut: false
          });
        }
      }
    }

    const updated = await OrderModel.findByIdAndUpdate(req.params.id, updates);

    // Notify customer of order status change
    let notifTitle = `Order Status: ${status.replace(/_/g, ' ').toUpperCase()}`;
    let notifMsg = `Your pre-order #${order.orderNumber} status changed to ${status.replace(/_/g, ' ')}.`;
    if (status === 'ready_for_pickup') {
      notifTitle = '🎉 Order Ready for Pickup!';
      notifMsg = `Your pre-order #${order.orderNumber} is packed and ready at ${order.stallName || 'the farm stall'}!`;
    }

    await NotificationModel.create({
      userId: order.customerId,
      title: notifTitle,
      message: notifMsg,
      type: 'order',
      link: '/customer-dashboard'
    });

    res.json({ message: 'Order status updated', order: updated });
  } catch (err) {
    res.status(500).json({ message: 'Error updating order status.' });
  }
});

// Customer Cancel Order before cutoff
router.patch('/:id/cancel', requireAuth, async (req, res) => {
  try {
    const { reason } = req.body;
    const order = await OrderModel.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found.' });

    if (order.customerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized to cancel this order.' });
    }

    if (order.order_status === 'completed' || order.order_status === 'cancelled') {
      return res.status(400).json({ message: `Order cannot be cancelled because it is already ${order.order_status}.` });
    }

    // Restore stock
    for (const item of order.items) {
      const prod = await ProductModel.findById(item.productId);
      if (prod) {
        await ProductModel.findByIdAndUpdate(prod._id, {
          stock_quantity: prod.stock_quantity + item.quantity,
          isSoldOut: false
        });
      }
    }

    const updated = await OrderModel.findByIdAndUpdate(req.params.id, {
      order_status: 'cancelled',
      cancellationReason: reason || 'Cancelled by customer'
    });

    // Notify farmer
    await NotificationModel.create({
      userId: order.farmerId,
      title: 'Order Cancelled',
      message: `Order #${order.orderNumber} was cancelled by customer. Reserved stock has been restored.`,
      type: 'order',
      link: '/farmer-dashboard'
    });

    res.json({ message: 'Order cancelled successfully', order: updated });
  } catch (err) {
    res.status(500).json({ message: 'Error cancelling order.' });
  }
});

// Customer Modify Order (Pickup slot or instructions before cutoff)
router.patch('/:id/modify', requireAuth, async (req, res) => {
  try {
    const { pickupDate, pickupTimeSlot, specialInstructions } = req.body;
    const order = await OrderModel.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found.' });

    if (order.customerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized to modify this order.' });
    }

    if (order.order_status === 'completed' || order.order_status === 'cancelled' || order.order_status === 'ready_for_pickup') {
      return res.status(400).json({ message: `Order cannot be modified in state: ${order.order_status}.` });
    }

    const updates = {};
    if (pickupDate) updates.pickupDate = pickupDate;
    if (pickupTimeSlot) updates.pickupTimeSlot = pickupTimeSlot;
    if (specialInstructions !== undefined) updates.specialInstructions = specialInstructions;

    const updated = await OrderModel.findByIdAndUpdate(req.params.id, updates);

    // Notify farmer
    await NotificationModel.create({
      userId: order.farmerId,
      title: 'Order Details Modified',
      message: `Customer updated pickup details for Order #${order.orderNumber}: ${updates.pickupDate || order.pickupDate} (${updates.pickupTimeSlot || order.pickupTimeSlot})`,
      type: 'order',
      link: '/farmer-dashboard'
    });

    res.json({ message: 'Order details updated', order: updated });
  } catch (err) {
    res.status(500).json({ message: 'Error modifying order.' });
  }
});

// Quick Re-Order
router.post('/:id/reorder', requireAuth, async (req, res) => {
  try {
    const pastOrder = await OrderModel.findById(req.params.id);
    if (!pastOrder) return res.status(404).json({ message: 'Past order not found.' });

    // Return items to populate customer cart
    res.json({
      farmerId: pastOrder.farmerId,
      farmerName: pastOrder.farmerName,
      items: pastOrder.items
    });
  } catch (err) {
    res.status(500).json({ message: 'Error during reorder.' });
  }
});

module.exports = router;
