import React from 'react';

const CATEGORIES = [
  { name: 'All', icon: 'bi-grid' },
  { name: 'Vegetables', icon: 'bi-flower1' },
  { name: 'Fruits', icon: 'bi-apple' },
  { name: 'Dairy & Eggs', icon: 'bi-egg' },
  { name: 'Bakery', icon: 'bi-cake2' },
  { name: 'Honey & Preserves', icon: 'bi-droplet' },
  { name: 'Herbs & Greens', icon: 'bi-tree' }
];

const DAYS = ['All', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function ProductFilter({
  filters,
  onChange,
  markets = []
}) {
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    onChange({
      ...filters,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleCategoryClick = (catName) => {
    onChange({
      ...filters,
      category: catName
    });
  };

  return (
    <div className="card p-4 mb-4 shadow-sm border rounded-4 position-relative overflow-hidden" style={{ background: 'var(--card-bg)' }}>
      {/* Category Pills with Glowing Active States */}
      <div className="d-flex flex-wrap gap-2 mb-4 pb-3 border-bottom">
        {CATEGORIES.map(cat => (
          <button
            key={cat.name}
            type="button"
            onClick={() => handleCategoryClick(cat.name)}
            className={`btn btn-sm rounded-pill px-3 py-2 fw-semibold d-flex align-items-center gap-1.5 transition-all ${
              (filters.category || 'All') === cat.name 
                ? 'btn-egreen text-white shadow-sm' 
                : 'btn-outline-secondary border'
            }`}
            style={{ fontSize: '0.84rem' }}
          >
            <i className={`bi ${cat.icon}`}></i>
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      {/* Search & Selectors Row */}
      <div className="row g-3 align-items-center">
        {/* Search */}
        <div className="col-12 col-md-4">
          <div className="input-group">
            <span className="input-group-text border-end-0 text-muted" style={{ background: 'var(--card-bg)', borderColor: 'var(--border-subtle)' }}>
              <i className="bi bi-search text-success"></i>
            </span>
            <input
              type="text"
              name="search"
              value={filters.search || ''}
              onChange={handleInputChange}
              className="form-control border-start-0"
              placeholder="Search avocados, mushrooms, berries..."
            />
          </div>
        </div>

        {/* Market Filter */}
        <div className="col-6 col-md-3">
          <select
            name="market"
            value={filters.market || 'All'}
            onChange={handleInputChange}
            className="form-select"
          >
            <option value="All">📍 All Farmers Markets</option>
            {markets.map(m => (
              <option key={m._id} value={m._id}>{m.name}</option>
            ))}
          </select>
        </div>

        {/* Operating Day */}
        <div className="col-6 col-md-2">
          <select
            name="day"
            value={filters.day || 'All'}
            onChange={handleInputChange}
            className="form-select"
          >
            <option value="All">📅 Any Day</option>
            {DAYS.filter(d => d !== 'All').map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div className="col-6 col-md-2">
          <select
            name="sort"
            value={filters.sort || 'newest'}
            onChange={handleInputChange}
            className="form-select"
          >
            <option value="newest">🌱 Newest Harvest</option>
            <option value="price_asc">💵 Price: Low to High</option>
            <option value="price_desc">💎 Price: High to Low</option>
            <option value="rating">★ Top Rated</option>
            <option value="stock">📦 High Stock</option>
          </select>
        </div>

        {/* In-stock Only */}
        <div className="col-6 col-md-1 d-flex align-items-center">
          <div className="form-check form-switch mb-0">
            <input
              className="form-check-input"
              type="checkbox"
              role="switch"
              id="inStockCheck"
              name="inStockOnly"
              checked={!!filters.inStockOnly}
              onChange={handleInputChange}
            />
            <label className="form-check-label small text-muted" htmlFor="inStockCheck">
              In Stock
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
