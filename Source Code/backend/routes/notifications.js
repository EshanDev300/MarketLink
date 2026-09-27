const express = require('express');
const router = express.Router();
const NotificationModel = require('../models/Notification');
const AnnouncementModel = require('../models/Announcement');
const { requireAuth } = require('../middleware/auth');

// Get current user's notifications and active announcements
router.get('/', requireAuth, async (req, res) => {
  try {
    const userNotifs = await NotificationModel.find({ userId: req.user.id });
    const announcements = await AnnouncementModel.find({ active: true });

    // Format announcements as notifications if not already read
    const audienceAnnouncements = announcements.filter(a => 
      a.audience === 'all' || 
      (a.audience === 'farmers' && req.user.role === 'farmer') ||
      (a.audience === 'customers' && req.user.role === 'customer')
    ).map(a => ({
      _id: a._id,
      title: '📢 ' + a.title,
      message: a.message,
      type: 'system',
      read: false,
      createdAt: a.createdAt
    }));

    res.json({
      notifications: userNotifs,
      announcements: audienceAnnouncements,
      unreadCount: userNotifs.filter(n => !n.read).length + audienceAnnouncements.length
    });
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving notifications.' });
  }
});

// Mark notification as read
router.patch('/:id/read', requireAuth, async (req, res) => {
  try {
    const updated = await NotificationModel.findByIdAndUpdate(req.params.id, { read: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error updating notification.' });
  }
});

// Mark all as read
router.post('/mark-all-read', requireAuth, async (req, res) => {
  try {
    const notifs = await NotificationModel.find({ userId: req.user.id });
    for (const n of notifs) {
      if (!n.read) {
        await NotificationModel.findByIdAndUpdate(n._id, { read: true });
      }
    }
    res.json({ message: 'All notifications marked as read.' });
  } catch (err) {
    res.status(500).json({ message: 'Error marking notifications.' });
  }
});

module.exports = router;
