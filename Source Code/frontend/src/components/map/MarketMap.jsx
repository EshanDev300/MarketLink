import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Custom Farm Icon
const createFarmIcon = (isFeatured = false) => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        background: ${isFeatured ? 'linear-gradient(135deg, #10b981, #065f46)' : 'linear-gradient(135deg, #16a34a, #15803d)'};
        color: white;
        width: 38px;
        height: 38px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 14px rgba(0,0,0,0.35);
        border: 2.5px solid #ffffff;
        font-size: 18px;
        transform: translate(-50%, -50%);
        transition: transform 0.2s ease;
      ">
        🌿
      </div>
    `,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
    popupAnchor: [0, -22]
  });
};

function ChangeMapView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom || 13, { animate: true });
    }
  }, [center, zoom, map]);
  return null;
}

export default function MarketMap({ markets = [], selectedMarket = null, onSelectMarket = null }) {
  const defaultCenter = selectedMarket 
    ? [selectedMarket.latitude, selectedMarket.longitude]
    : markets.length > 0 
      ? [markets[0].latitude, markets[0].longitude]
      : [37.7749, -122.4194];

  return (
    <div className="w-100 rounded-4 overflow-hidden border border-success-subtle shadow-sm" style={{ height: '480px', position: 'relative' }}>
      <MapContainer
        center={defaultCenter}
        zoom={12}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%', zIndex: 10 }}
      >
        <ChangeMapView 
          center={selectedMarket ? [selectedMarket.latitude, selectedMarket.longitude] : defaultCenter} 
          zoom={selectedMarket ? 14 : 12} 
        />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {markets.map((m) => (
          <Marker
            key={m._id || m.name}
            position={[m.latitude, m.longitude]}
            icon={createFarmIcon(m.featured)}
            eventHandlers={{
              click: () => {
                if (onSelectMarket) onSelectMarket(m);
              }
            }}
          >
            <Popup className="custom-market-popup">
              <div style={{ minWidth: '220px', padding: '6px' }}>
                <span className="badge bg-success-subtle text-success mb-2 px-2 py-1 rounded-pill font-monospace">
                  {m.city || 'Farmers Market'}
                </span>
                <h6 className="fw-bold mb-1" style={{ color: '#0f2e1a' }}>{m.name}</h6>
                <p className="small text-muted mb-2">{m.address}</p>
                <div className="small mb-2">
                  <strong>🕒 Timings:</strong> {m.timings || '08:00 AM - 01:30 PM'}
                </div>
                <div className="small mb-3">
                  <strong>📅 Days:</strong> {Array.isArray(m.operatingDays) ? m.operatingDays.map(d => typeof d === 'object' ? d.day : d).join(', ') : 'Weekends'}
                </div>
                <div className="d-flex gap-2">
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${m.latitude},${m.longitude}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-sm btn-outline-success rounded-pill w-100"
                  >
                    📍 Directions
                  </a>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
