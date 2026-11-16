import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  BedDouble, Calendar, Users, BarChart3, TrendingUp, Radio, Moon, 
  Layers, Shield, LogOut, LayoutDashboard, ClipboardCheck, Building2, Activity,
  ChevronLeft, ChevronRight, PanelLeftClose, PanelLeftOpen, Utensils, Sparkles, PackageSearch, Terminal
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export const Sidebar: React.FC = () => {
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const location = useLocation();

  const isApiTabActive = location.pathname === '/audit-logs' && location.search.includes('tab=api');
  const isStaffAuditActive = location.pathname === '/audit-logs' && !location.search.includes('tab=api');
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem('pms_sidebar_collapsed') === 'true';
  });

  const toggleSidebar = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('pms_sidebar_collapsed', String(next));
      return next;
    });
  };

  return (
    <aside
      className={`${
        isCollapsed ? 'w-20 p-3' : 'w-64 p-5'
      } bg-[#0B132B] text-white min-h-screen flex flex-col justify-between hidden md:flex shrink-0 border-r border-slate-800 transition-all duration-300 ease-in-out print:hidden select-none z-40`}
    >
      <div className="space-y-6">
        {/* Hotel Logo & Collapse Toggle Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#EF3F09] to-orange-600 flex items-center justify-center font-black text-white text-xl shadow-lg shadow-[#EF3F09]/30 shrink-0">
              GH
            </div>
            {!isCollapsed && (
              <div className="transition-opacity duration-300">
                <h1 className="font-extrabold text-sm tracking-tight leading-tight">Grand Horizon</h1>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Resort & Suite PMS</p>
              </div>
            )}
          </div>

          {/* Collapse Toggle Button */}
          <button
            onClick={toggleSidebar}
            title={isCollapsed ? 'Perluas Sidebar' : 'Sembunyikan Sidebar'}
            className="p-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition cursor-pointer"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Sections */}
        <div className="space-y-5 text-xs">
          {/* SECTION 1: OPERASIONAL UTAMA */}
          <div>
            {!isCollapsed && (
              <p className="px-3 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 transition-opacity duration-300">
                Operasional Utama
              </p>
            )}
            <div className="space-y-1">
              <NavLink
                to="/dashboard"
                title={isCollapsed ? t('nav.dashboard') : undefined}
                className={({ isActive }) =>
                  `flex items-center ${
                    isCollapsed ? 'justify-center px-0 py-3' : 'gap-3 px-3.5 py-2.5'
                  } rounded-2xl font-bold transition ${
                    isActive
                      ? 'bg-[#EF3F09] text-white shadow-lg shadow-[#EF3F09]/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`
                }
              >
                <LayoutDashboard className="w-4 h-4 shrink-0" />
                {!isCollapsed && <span>{t('nav.dashboard')}</span>}
              </NavLink>

              <NavLink
                to="/rooms"
                title={isCollapsed ? t('nav.rooms') : undefined}
                className={({ isActive }) =>
                  `flex items-center ${
                    isCollapsed ? 'justify-center px-0 py-3' : 'gap-3 px-3.5 py-2.5'
                  } rounded-2xl font-bold transition ${
                    isActive
                      ? 'bg-[#EF3F09] text-white shadow-lg shadow-[#EF3F09]/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`
                }
              >
                <BedDouble className="w-4 h-4 shrink-0" />
                {!isCollapsed && <span>{t('nav.rooms')}</span>}
              </NavLink>

              <NavLink
                to="/bookings"
                title={isCollapsed ? t('nav.bookings') : undefined}
                className={({ isActive }) =>
                  `flex items-center ${
                    isCollapsed ? 'justify-center px-0 py-3' : 'gap-3 px-3.5 py-2.5'
                  } rounded-2xl font-bold transition ${
                    isActive
                      ? 'bg-[#EF3F09] text-white shadow-lg shadow-[#EF3F09]/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`
                }
              >
                <Calendar className="w-4 h-4 shrink-0" />
                {!isCollapsed && <span>{t('nav.bookings')}</span>}
              </NavLink>

              <NavLink
                to="/pos"
                title={isCollapsed ? 'POS Restoran & Room Service' : undefined}
                className={({ isActive }) =>
                  `flex items-center ${
                    isCollapsed ? 'justify-center px-0 py-3' : 'gap-3 px-3.5 py-2.5'
                  } rounded-2xl font-bold transition ${
                    isActive
                      ? 'bg-[#EF3F09] text-white shadow-lg shadow-[#EF3F09]/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`
                }
              >
                <Utensils className="w-4 h-4 shrink-0" />
                {!isCollapsed && <span>POS Restoran & F&B</span>}
              </NavLink>

              <NavLink
                to="/services"
                title={isCollapsed ? 'Layanan Laundry & Spa' : undefined}
                className={({ isActive }) =>
                  `flex items-center ${
                    isCollapsed ? 'justify-center px-0 py-3' : 'gap-3 px-3.5 py-2.5'
                  } rounded-2xl font-bold transition ${
                    isActive
                      ? 'bg-[#EF3F09] text-white shadow-lg shadow-[#EF3F09]/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`
                }
              >
                <Sparkles className="w-4 h-4 shrink-0" />
                {!isCollapsed && <span>Layanan Laundry & Spa</span>}
              </NavLink>

              <NavLink
                to="/guests"
                title={isCollapsed ? t('nav.guests') : undefined}
                className={({ isActive }) =>
                  `flex items-center ${
                    isCollapsed ? 'justify-center px-0 py-3' : 'gap-3 px-3.5 py-2.5'
                  } rounded-2xl font-bold transition ${
                    isActive
                      ? 'bg-[#EF3F09] text-white shadow-lg shadow-[#EF3F09]/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`
                }
              >
                <Users className="w-4 h-4 shrink-0" />
                {!isCollapsed && <span>{t('nav.guests')}</span>}
              </NavLink>
            </div>
          </div>

          {/* SECTION 2: REVENUES & KEUANGAN */}
          <div>
            {!isCollapsed && (
              <p className="px-3 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 transition-opacity duration-300">
                Keuangan & Revenue
              </p>
            )}
            <div className="space-y-1">
              <NavLink
                to="/channels"
                title={isCollapsed ? t('nav.channels') : undefined}
                className={({ isActive }) =>
                  `flex items-center ${
                    isCollapsed ? 'justify-center px-0 py-3' : 'gap-3 px-3.5 py-2.5'
                  } rounded-2xl font-bold transition ${
                    isActive
                      ? 'bg-[#EF3F09] text-white shadow-lg shadow-[#EF3F09]/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`
                }
              >
                <Radio className="w-4 h-4 shrink-0" />
                {!isCollapsed && <span>{t('nav.channels')}</span>}
              </NavLink>

              <NavLink
                to="/pricing"
                title={isCollapsed ? t('nav.pricing') : undefined}
                className={({ isActive }) =>
                  `flex items-center ${
                    isCollapsed ? 'justify-center px-0 py-3' : 'gap-3 px-3.5 py-2.5'
                  } rounded-2xl font-bold transition ${
                    isActive
                      ? 'bg-[#EF3F09] text-white shadow-lg shadow-[#EF3F09]/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`
                }
              >
                <TrendingUp className="w-4 h-4 shrink-0" />
                {!isCollapsed && <span>{t('nav.pricing')}</span>}
              </NavLink>

              <NavLink
                to="/night-audit"
                title={isCollapsed ? t('nav.night_audit') : undefined}
                className={({ isActive }) =>
                  `flex items-center ${
                    isCollapsed ? 'justify-center px-0 py-3' : 'gap-3 px-3.5 py-2.5'
                  } rounded-2xl font-bold transition ${
                    isActive
                      ? 'bg-[#EF3F09] text-white shadow-lg shadow-[#EF3F09]/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`
                }
              >
                <Moon className="w-4 h-4 shrink-0" />
                {!isCollapsed && <span>{t('nav.night_audit')}</span>}
              </NavLink>

              <NavLink
                to="/print-report"
                title={isCollapsed ? t('nav.report') : undefined}
                className={({ isActive }) =>
                  `flex items-center ${
                    isCollapsed ? 'justify-center px-0 py-3' : 'gap-3 px-3.5 py-2.5'
                  } rounded-2xl font-bold transition ${
                    isActive
                      ? 'bg-[#EF3F09] text-white shadow-lg shadow-[#EF3F09]/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`
                }
              >
                <BarChart3 className="w-4 h-4 shrink-0" />
                {!isCollapsed && <span>{t('nav.report')}</span>}
              </NavLink>
            </div>
          </div>

          {/* SECTION 3: MASTER DATA & PENGATURAN */}
          <div>
            {!isCollapsed && (
              <p className="px-3 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 transition-opacity duration-300">
                Master Data & System
              </p>
            )}
            <div className="space-y-1">
              <NavLink
                to="/room-types"
                title={isCollapsed ? t('nav.room_types') : undefined}
                className={({ isActive }) =>
                  `flex items-center ${
                    isCollapsed ? 'justify-center px-0 py-3' : 'gap-3 px-3.5 py-2.5'
                  } rounded-2xl font-bold transition ${
                    isActive
                      ? 'bg-[#EF3F09] text-white shadow-lg shadow-[#EF3F09]/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`
                }
              >
                <Building2 className="w-4 h-4 shrink-0" />
                {!isCollapsed && <span>{t('nav.room_types')}</span>}
              </NavLink>

              <NavLink
                to="/floors"
                title={isCollapsed ? t('nav.floors') : undefined}
                className={({ isActive }) =>
                  `flex items-center ${
                    isCollapsed ? 'justify-center px-0 py-3' : 'gap-3 px-3.5 py-2.5'
                  } rounded-2xl font-bold transition ${
                    isActive
                      ? 'bg-[#EF3F09] text-white shadow-lg shadow-[#EF3F09]/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`
                }
              >
                <Layers className="w-4 h-4 shrink-0" />
                {!isCollapsed && <span>{t('nav.floors')}</span>}
              </NavLink>

              <NavLink
                to="/housekeeping"
                title={isCollapsed ? t('nav.housekeeping') : undefined}
                className={({ isActive }) =>
                  `flex items-center ${
                    isCollapsed ? 'justify-center px-0 py-3' : 'gap-3 px-3.5 py-2.5'
                  } rounded-2xl font-bold transition ${
                    isActive
                      ? 'bg-[#EF3F09] text-white shadow-lg shadow-[#EF3F09]/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`
                }
              >
                <ClipboardCheck className="w-4 h-4 shrink-0" />
                {!isCollapsed && <span>{t('nav.housekeeping')}</span>}
              </NavLink>

              <NavLink
                to="/housekeeping/lost-found"
                title={isCollapsed ? 'Lost & Found Barang Tertinggal' : undefined}
                className={({ isActive }) =>
                  `flex items-center ${
                    isCollapsed ? 'justify-center px-0 py-3' : 'gap-3 px-3.5 py-2.5'
                  } rounded-2xl font-bold transition ${
                    isActive
                      ? 'bg-[#EF3F09] text-white shadow-lg shadow-[#EF3F09]/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`
                }
              >
                <PackageSearch className="w-4 h-4 shrink-0" />
                {!isCollapsed && <span>Lost & Found Barang</span>}
              </NavLink>

              <NavLink
                to="/users"
                title={isCollapsed ? t('nav.users') : undefined}
                className={({ isActive }) =>
                  `flex items-center ${
                    isCollapsed ? 'justify-center px-0 py-3' : 'gap-3 px-3.5 py-2.5'
                  } rounded-2xl font-bold transition ${
                    isActive
                      ? 'bg-[#EF3F09] text-white shadow-lg shadow-[#EF3F09]/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`
                }
              >
                <Shield className="w-4 h-4 shrink-0" />
                {!isCollapsed && <span>{t('nav.users')}</span>}
              </NavLink>

              <NavLink
                to="/hotel-profile"
                title={isCollapsed ? "Profil Hotel" : undefined}
                className={({ isActive }) =>
                  `flex items-center ${
                    isCollapsed ? 'justify-center px-0 py-3' : 'gap-3 px-3.5 py-2.5'
                  } rounded-2xl font-bold transition ${
                    isActive
                      ? 'bg-[#EF3F09] text-white shadow-lg shadow-[#EF3F09]/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`
                }
              >
                <Building2 className="w-4 h-4 shrink-0" />
                {!isCollapsed && <span>Profil Hotel</span>}
              </NavLink>

              <NavLink
                to="/audit-logs"
                title={isCollapsed ? t('nav.audit_logs') : undefined}
                className={
                  `flex items-center ${
                    isCollapsed ? 'justify-center px-0 py-3' : 'gap-3 px-3.5 py-2.5'
                  } rounded-2xl font-bold transition ${
                    isStaffAuditActive
                      ? 'bg-[#EF3F09] text-white shadow-lg shadow-[#EF3F09]/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`
                }
              >
                <Activity className="w-4 h-4 shrink-0" />
                {!isCollapsed && <span>{t('nav.audit_logs')}</span>}
              </NavLink>

              <NavLink
                to="/audit-logs?tab=api"
                title={isCollapsed ? 'Log Akses REST API (IT Telemetry)' : undefined}
                className={
                  `flex items-center ${
                    isCollapsed ? 'justify-center px-0 py-3' : 'gap-3 px-3.5 py-2.5'
                  } rounded-2xl font-bold transition ${
                    isApiTabActive
                      ? 'bg-[#EF3F09] text-white shadow-lg shadow-[#EF3F09]/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`
                }
              >
                <Terminal className="w-4 h-4 shrink-0 text-emerald-400" />
                {!isCollapsed && <span>Log Akses REST API (IT)</span>}
              </NavLink>
            </div>
          </div>
        </div>
      </div>

      {/* User Profile Card Footer */}
      <div className="pt-4 border-t border-slate-800/80">
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} px-1`}>
          <div className="flex items-center gap-3">
            <img
              src={user?.avatar || "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=120&q=80"}
              alt={user?.name || "User"}
              title={isCollapsed ? `${user?.name || 'User'} (${user?.role || 'Staff'})` : undefined}
              className="w-10 h-10 rounded-2xl object-cover border border-slate-700 shadow shrink-0"
            />
            {!isCollapsed && (
              <div className="min-w-0">
                <p className="font-extrabold text-xs text-white truncate">{user?.name || 'Superadmin'}</p>
                <p className="text-[10px] text-slate-400 font-semibold truncate">{user?.role || 'General Manager'}</p>
              </div>
            )}
          </div>
          {!isCollapsed && (
            <button
              type="button"
              onClick={logout}
              title="Keluar (Logout)"
              className="text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 p-2 rounded-xl transition cursor-pointer shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
