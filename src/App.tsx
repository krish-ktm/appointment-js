import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Login } from './components/Login';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { NoticeManager } from './components/admin/NoticeManager';
import { MessageManager } from './components/admin/MessageManager';
import { MRAppointmentManager } from './components/admin/MRAppointmentManager';
import { LandingPage } from './components/LandingPage';
import { AboutPage } from './components/AboutPage';
import { MRAppointment } from './components/mr-appointment/MRAppointment';
import { ServicesPage } from './components/ServicesPage';
import { LanguageProvider } from './i18n/LanguageContext';
import { LanguageSelector } from './components/LanguageSelector';

function App() {
  return (
    <LanguageProvider>
      <Router>
        <LanguageSelector />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/mr-appointment" element={<MRAppointment />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="mr-appointments" element={<MRAppointmentManager />} />
            <Route path="notices" element={<NoticeManager />} />
            <Route path="messages" element={<MessageManager />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster position="top-right" />
      </Router>
    </LanguageProvider>
  );
}

export default App;