import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Login } from './components/Login';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { NoticeManager } from './components/admin/NoticeManager';
import { MessageManager } from './components/admin/MessageManager';
import { AppointmentManager } from './components/admin/appointments/AppointmentManager';
import { AppointmentSettings } from './components/admin/appointments/AppointmentSettings';
import { MRAppointmentManager } from './components/admin/MRAppointmentManager';
import { MRAppointmentManagement } from './components/admin/mr-appointment/MRAppointmentManagement';
import { UsersManager } from './components/admin/UsersManager';
import { LandingPage } from './components/LandingPage';
import { AboutPage } from './components/AboutPage';
import { MRAppointment } from './components/mr-appointment/MRAppointment';
import { ServicesPage } from './components/ServicesPage';
import { LanguageProvider } from './i18n/LanguageContext';
import { AppointmentPage } from './components/AppointmentPage';
import { LanguageSelectionModal } from './components/LanguageSelectionModal';

// Scroll to top component
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  useEffect(() => {
    const hasSelectedLanguage = localStorage.getItem('hasSelectedLanguage');
    if (!hasSelectedLanguage) {
      setShowLanguageModal(true);
    }
  }, []);

  return (
    <LanguageProvider>
      <Router>
        <ScrollToTop />
        <LanguageSelectionModal 
          isOpen={showLanguageModal} 
          onClose={() => setShowLanguageModal(false)} 
        />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/mr-appointment" element={<MRAppointment />} />
          <Route path="/appointment" element={<AppointmentPage />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="appointments" element={<AppointmentManager />} />
            <Route path="appointment-settings" element={<AppointmentSettings />} />
            <Route path="mr-appointments" element={<MRAppointmentManager />} />
            <Route path="mr-settings" element={<MRAppointmentManagement />} />
            <Route path="notices" element={<NoticeManager />} />
            <Route path="messages" element={<MessageManager />} />
            <Route path="users" element={<UsersManager />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster position="top-right" />
      </Router>
    </LanguageProvider>
  );
}

export default App;