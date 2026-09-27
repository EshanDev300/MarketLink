import React, { useState } from 'react';
import SpotlightCard from '../components/reactbits/SpotlightCard';
import ScrollReveal from '../components/reactbits/ScrollReveal';
import TextMorph from '../components/reactbits/TextMorph';
import ParticleText from '../components/reactbits/ParticleText';
import MarketMap from '../components/map/MarketMap';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [inquiryType, setInquiryType] = useState('shopper');
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const officeMarket = [
    {
      _id: 'hq_01',
      name: 'MarketLink Central Headquarters',
      address: '100 Market St, Financial District, San Francisco, CA 94105',
      city: 'San Francisco',
      latitude: 37.7937,
      longitude: -122.3965,
      operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      timings: '08:30 AM - 05:30 PM PST',
      featured: true
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setForm({ name: '', email: '', subject: '', message: '' });
      alert(`Thank you! Your ${inquiryType} inquiry has been transmitted to our weekend operations desk.`);
    }, 1000);
  };

  return (
    <div className="container py-5">
      {/* Particle Text Banner */}
      <div className="text-center mb-2">
        <ParticleText text="GET IN TOUCH" color="#10b981" fontSize={42} height={70} />
      </div>

      {/* Title */}
      <ScrollReveal animation="pop-up">
        <div className="text-center max-w-xl mx-auto mb-5">
          <span className="badge bg-success-subtle text-success px-3 py-1.5 rounded-pill fw-semibold mb-2 shadow-xs">
            GET IN TOUCH • 24/7 GROWER & SHOPPER CARE
          </span>
          <h1 className="display-5 fw-bold mb-2">
            Contact{' '}
            <TextMorph
              words={[
                'Our Operations Team 📞',
                'Vendor Support 🧑‍🌾',
                'Customer Care 💬',
                'Market Coordinators 🧺'
              ]}
              className="text-success font-heading"
            />
          </h1>
          <p className="text-muted">
            Have questions about registering your farm stall, organizing a weekend community market, or customer pre-orders? We're here to help.
          </p>
        </div>
      </ScrollReveal>

      <div className="row g-4 mb-5">
        {/* Contact Information & Form */}
        <div className="col-12 col-lg-5">
          <ScrollReveal animation="slide-left" delay={100}>
            <SpotlightCard className="p-4 p-lg-5 border h-100 rounded-4">
              <h4 className="fw-bold mb-3 font-heading">Office & Support Info</h4>

              <div className="d-flex flex-column gap-3 mb-4 small text-secondary">
                <div className="d-flex gap-3">
                  <i className="bi bi-geo-alt-fill text-success fs-5"></i>
                  <div>
                    <strong>Headquarters:</strong>
                    <div>100 Market Street, Suite 400</div>
                    <div>San Francisco, CA 94105</div>
                  </div>
                </div>

                <div className="d-flex gap-3">
                  <i className="bi bi-envelope-fill text-success fs-5"></i>
                  <div>
                    <strong>Support Email:</strong>
                    <div>support@marketlink.org</div>
                    <div>vendors@marketlink.org</div>
                  </div>
                </div>

                <div className="d-flex gap-3">
                  <i className="bi bi-telephone-fill text-success fs-5"></i>
                  <div>
                    <strong>Helpline:</strong>
                    <div>+1 (555) 019-2831 (Mon - Sat)</div>
                  </div>
                </div>

                <div className="d-flex gap-3">
                  <i className="bi bi-clock-fill text-success fs-5"></i>
                  <div>
                    <strong>Market Operations Desk:</strong>
                    <div>Sat - Sun: 06:30 AM – 03:00 PM PST</div>
                  </div>
                </div>
              </div>

              <hr />

              <h5 className="fw-bold mb-2 font-heading">Send a Message</h5>
              <div className="d-flex gap-1.5 mb-3">
                <button
                  type="button"
                  onClick={() => setInquiryType('shopper')}
                  className={`btn btn-sm rounded-pill px-2.5 py-1 ${inquiryType === 'shopper' ? 'btn-egreen text-white' : 'btn-outline-secondary'}`}
                  style={{ fontSize: '0.75rem' }}
                >
                  🧺 Customer
                </button>
                <button
                  type="button"
                  onClick={() => setInquiryType('farmer')}
                  className={`btn btn-sm rounded-pill px-2.5 py-1 ${inquiryType === 'farmer' ? 'btn-egreen text-white' : 'btn-outline-secondary'}`}
                  style={{ fontSize: '0.75rem' }}
                >
                  🧑‍🌾 Farm Grower
                </button>
                <button
                  type="button"
                  onClick={() => setInquiryType('manager')}
                  className={`btn btn-sm rounded-pill px-2.5 py-1 ${inquiryType === 'manager' ? 'btn-egreen text-white' : 'btn-outline-secondary'}`}
                  style={{ fontSize: '0.75rem' }}
                >
                  🎪 Market Host
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-2">
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Your Full Name"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-2">
                  <input
                    type="email"
                    className="form-control form-control-sm"
                    placeholder="Your Email"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-2">
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder={inquiryType === 'farmer' ? 'Farm / Stall Name & Crop Category' : 'Inquiry Subject'}
                    value={form.subject}
                    onChange={e => setForm({ ...form, subject: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <textarea
                    className="form-control form-control-sm"
                    rows="3"
                    placeholder={inquiryType === 'farmer' ? 'Tell us about your growing practices, acreage, and which market you would like to sell at...' : 'How can our community team assist your harvest pickup or experience?'}
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitted}
                  className="btn btn-egreen btn-sm w-100 rounded-pill py-2 fw-semibold"
                >
                  {submitted ? 'Transmitting Request...' : `Submit ${inquiryType === 'farmer' ? 'Grower' : 'Community'} Inquiry`}
                </button>
              </form>
            </SpotlightCard>
          </ScrollReveal>
        </div>

        {/* Embedded Map Section */}
        <div className="col-12 col-lg-7">
          <ScrollReveal animation="slide-right" delay={150}>
            <div className="p-4 rounded-4 border shadow-xs h-100 d-flex flex-column" style={{ background: 'var(--card-bg)' }}>
              <h5 className="fw-bold mb-1 font-heading">Our Coordination Hub on Map</h5>
              <p className="small text-muted mb-3">
                MarketLink Headquarters & Regional Farmers Operations Desk
              </p>
              <div className="flex-grow-1 shadow-sm rounded-4 overflow-hidden border" style={{ minHeight: '320px' }}>
                <MarketMap markets={officeMarket} />
              </div>
              <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
                <span className="small text-success fw-bold">
                  🟢 Live Operations Desk Active
                </span>
                <a
                  href="https://www.google.com/maps/dir/?api=1&destination=37.7937,-122.3965"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-sm btn-egreen-outline rounded-pill px-3"
                >
                  📍 Open Directions in Google Maps
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
