import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from './layouts/DashboardLayout';
import { Dashboard, Schedule, Team, Settings, TimeOff, Login } from './pages';
import { ToastContainer } from './components/Toast';
import { useStore } from './store';
import './App.css';

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { currentUser } = useStore();
  if (!currentUser) return <Navigate to="/login" replace />;
  return <DashboardLayout>{children}</DashboardLayout>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<AuthGuard><Dashboard /></AuthGuard>} />
        <Route path="/schedule" element={<AuthGuard><Schedule /></AuthGuard>} />
        <Route path="/team" element={<AuthGuard><Team /></AuthGuard>} />
        <Route path="/time-off" element={<AuthGuard><TimeOff /></AuthGuard>} />
        <Route path="/settings" element={<AuthGuard><Settings /></AuthGuard>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
