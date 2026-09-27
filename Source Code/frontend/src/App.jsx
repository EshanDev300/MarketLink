import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { NotificationProvider } from './context/NotificationContext';

// Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import PixelMagnetCursor from './components/reactbits/PixelMagnetCursor';
import LoadingScreen from './components/common/LoadingScreen';
import CurtainTransition from './components/common/CurtainTransition';
import CartDrawer from './components/preorders/CartDrawer';
import ChatbotModal from './components/common/ChatbotModal';
import NotificationCenter from './components/common/NotificationCenter';

// Pages
import HomePage from './pages/HomePage';
import MarketsPage from './pages/MarketsPage';
import MarketDetailsPage from './pages/MarketDetailsPage';
import ProductsPage from './pages/ProductsPage';
import FarmerProfilePage from './pages/FarmerProfilePage';
import CustomerDashboardPage from './pages/CustomerDashboardPage';
import FarmerDashboardPage from './pages/FarmerDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';

export default function App() {
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <NotificationProvider>
            {/* Website Initial Load Animation Screen */}
            <LoadingScreen />

            <Router>
              <div className="d-flex flex-column min-vh-100 position-relative">
                {/* Dual Stage Curtain Open Animation Between Pages */}
                <CurtainTransition />

                {/* Standard Website Browser Pointer + Light Pixel Magnet Effect */}
                <PixelMagnetCursor />

                {/* Floating Rounded Pill Navigation Bar */}
                <Navbar onOpenNotifications={() => setIsNotifOpen(true)} />

                {/* In-app Notification Drawer */}
                <NotificationCenter
                  isOpen={isNotifOpen}
                  onClose={() => setIsNotifOpen(false)}
                />

                {/* Main Routing Views */}
                <main className="flex-grow-1">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/markets" element={<MarketsPage />} />
                    <Route path="/markets/:id" element={<MarketDetailsPage />} />
                    <Route path="/products" element={<ProductsPage />} />
                    <Route path="/farmers/:id" element={<FarmerProfilePage />} />
                    <Route path="/customer-dashboard" element={<CustomerDashboardPage />} />
                    <Route path="/farmer-dashboard" element={<FarmerDashboardPage />} />
                    <Route path="/admin-dashboard" element={<AdminDashboardPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                  </Routes>
                </main>

                {/* Pre-order Harvest Cart Drawer */}
                <CartDrawer />

                {/* Real Gemini AI Assistant Chatbot with Lattice Loader & AiBlob */}
                <ChatbotModal />

                {/* Global Footer */}
                <Footer />
              </div>
            </Router>
          </NotificationProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
