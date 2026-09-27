import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import PeekRating from '../reactbits/PeekRating';
import BorderGlow from '../reactbits/BorderGlow';
import SpotlightCard from '../reactbits/SpotlightCard';

export default function ProductCard({ product, onOpenDetails }) {
  const { user, toggleFavorite } = useAuth();
  const { addToCart } = useCart();

  const isFavorite = user?.favoriteProducts?.includes(product._id);
  const isOutOfStock = product.isSoldOut || (product.stock_quantity <= 0 && product.stockQuantity <= 0);
  const stockQty = product.stock_quantity ?? product.stockQuantity ?? 0;

  const handleFavoriteClick = async (e) => {
    e.stopPropagation();
    if (!user) {
      alert('Please log in to save your favorite products!');
      return;
    }
    await toggleFavorite('product', product._id);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <BorderGlow borderRadius="24px" className="h-100">
      <SpotlightCard className="card-product h-100 d-flex flex-column overflow-hidden border-0">
      <div 
        className="product-img-wrapper cursor-pointer position-relative overflow-hidden" 
        onClick={() => onOpenDetails && onOpenDetails(product)}
        style={{ height: '210px', minHeight: '210px', maxHeight: '210px', width: '100%' }}
      >
        <img 
          src={product.image || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80'} 
          alt={product.name}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80';
          }}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />

        <div className="position-absolute top-0 start-0 p-2 d-flex flex-column gap-1">
          <span className="badge rounded-pill fw-bold text-white shadow-xs px-2.5 py-1" style={{ background: 'linear-gradient(135deg, #10b981, #059669)', fontSize: '0.72rem' }}>
            {product.category?.name || product.category || 'Fresh Produce'}
          </span>
          {isOutOfStock && (
            <span className="badge rounded-pill bg-danger text-white shadow-xs px-2.5 py-1" style={{ fontSize: '0.72rem' }}>
              Sold Out
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleFavoriteClick}
          className="btn btn-sm position-absolute top-0 end-0 m-2 rounded-circle bg-white text-danger shadow-sm border-0 d-flex align-items-center justify-content-center"
          style={{ width: '34px', height: '34px', zIndex: 5 }}
          title={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
        >
          <i className={`bi ${isFavorite ? 'bi-heart-fill' : 'bi-heart'}`}></i>
        </button>
      </div>

      <div className="p-3 d-flex flex-column flex-grow-1">
        <div className="d-flex align-items-center justify-content-between mb-1.5">
          <span className="small text-secondary text-truncate fw-semibold" style={{ maxWidth: '72%' }}>
            🧑‍🌾 {product.stallName || product.farmerName || 'Local Farmer'}
          </span>
          <div className="d-flex align-items-center gap-1.5">
            <span className="small text-warning fw-bold d-flex align-items-center gap-1">
              <i className="bi bi-star-fill"></i>
              <span className="text-dark-emphasis">{product.ratingAverage || '5.0'}</span>
            </span>
            <PeekRating rating={product.ratingAverage || 5.0} count={product.reviewsCount || 34} />
          </div>
        </div>

        <h6 
          className="fw-bold mb-1.5 cursor-pointer text-truncate font-heading text-dark-emphasis" 
          title={product.name}
          onClick={() => onOpenDetails && onOpenDetails(product)}
          style={{ fontSize: '1.05rem' }}
        >
          {product.name}
        </h6>

        <p className="small text-secondary text-truncate-2 mb-3 flex-grow-1" style={{ fontSize: '0.84rem', lineHeight: '1.45' }}>
          {product.description || 'Locally grown, hand-harvested organic produce straight from regional farm stalls.'}
        </p>

        <div className="d-flex align-items-center justify-content-between pt-2 border-top mt-auto">
          <div>
            <span className="fs-5 fw-bold text-success">${Number(product.price).toFixed(2)}</span>
            <span className="small text-muted"> / {product.unit}</span>
            <div className="small text-secondary" style={{ fontSize: '0.74rem' }}>
              Stock: <strong className={stockQty > 5 ? 'text-success' : 'text-danger'}>{stockQty} {product.unit}</strong>
            </div>
          </div>

          <button
            type="button"
            disabled={isOutOfStock}
            onClick={handleAddToCart}
            className={`btn btn-sm ${isOutOfStock ? 'btn-secondary disabled' : 'btn-egreen'} rounded-pill px-3 py-1.5`}
          >
            <i className="bi bi-basket me-1"></i> Pre-Order
          </button>
        </div>
      </div>
    </SpotlightCard>
  </BorderGlow>
  );
}
