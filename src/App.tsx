import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Login } from './components/Login';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { NoticeManager } from './components/admin/NoticeManager';
import { MessageManager } from './components/admin/MessageManager';
import { LandingPage } from './components/LandingPage';
import { MRAppointment } from './components/MRAppointment';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/mr-appointment" element={<MRAppointment />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="notices" element={<NoticeManager />} />
          <Route path="messages" element={<MessageManager />} />
        </Route>
      </Routes>
      <Toaster position="top-right" />
    </Router>
  );
}

export default App;