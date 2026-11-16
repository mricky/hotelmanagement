import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { Sidebar } from './components/Sidebar';
import { DashboardPage } from './pages/DashboardPage';
import { RoomsPage } from './pages/RoomsPage';
import { BookingsPage } from './pages/BookingsPage';
import { CalendarPage } from './pages/CalendarPage';
import { GuestsPage } from './pages/GuestsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { PrintReportPage } from './pages/PrintReportPage';
import { PricingPage } from './pages/PricingPage';
import { ChannelManagerPage } from './pages/ChannelManagerPage';
import { NightAuditPage } from './pages/NightAuditPage';
import { RoomTypesPage } from './pages/RoomTypesPage';
import { FloorsPage } from './pages/FloorsPage';
import { HousekeepingPage } from './pages/HousekeepingPage';
import { UsersPage } from './pages/UsersPage';
import { AuditLogsPage } from './pages/AuditLogsPage';
import { HousekeepingMobilePage } from './pages/HousekeepingMobilePage';
import { PosPage } from './pages/PosPage';
import { ServicesPage } from './pages/ServicesPage';
import { LostFoundPage } from './pages/LostFoundPage';

import { HotelProfilePage } from './pages/HotelProfilePage';

const ProtectedLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
      <Sidebar />
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
};

export const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />}
      />

      <Route
        path="/*"
        element={
          <ProtectedLayout>
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />

              {/* SECTION 1: OPERASIONAL UTAMA */}
              <Route path="/rooms" element={<RoomsPage />} />
              <Route path="/bookings" element={<BookingsPage />} />
              <Route path="/bookings/calendar" element={<CalendarPage />} />
              <Route path="/pos" element={<PosPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/guests" element={<GuestsPage />} />

              {/* SECTION 2: REVENUE & NIGHT AUDIT */}
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/analytics/print" element={<PrintReportPage />} />
              <Route path="/print-report" element={<PrintReportPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/channels" element={<ChannelManagerPage />} />
              <Route path="/night-audit" element={<NightAuditPage />} />

              {/* SECTION 3: MASTER DATA & PENGATURAN */}
              <Route path="/room-types" element={<RoomTypesPage />} />
              <Route path="/floors" element={<FloorsPage />} />
              <Route path="/housekeeping" element={<HousekeepingPage />} />
              <Route path="/housekeeping/lost-found" element={<LostFoundPage />} />
              <Route path="/housekeeping/mobile" element={<HousekeepingMobilePage />} />
              <Route path="/users" element={<UsersPage defaultTab="users" />} />
              <Route path="/roles" element={<UsersPage defaultTab="roles" />} />
              <Route path="/role-management" element={<UsersPage defaultTab="roles" />} />
              <Route path="/hotel-profile" element={<HotelProfilePage />} />
              <Route path="/audit-logs" element={<AuditLogsPage />} />

              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </ProtectedLayout>
        }
      />
    </Routes>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
