import React, { useState, useEffect } from 'react';
import { Sun, Moon, Bell, Database, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface HeaderProps {
  title: string;
  subtitle: string;
  titleBadge?: string;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle, titleBadge }) => {
  const [isDark, setIsDark] = useState(false);
  const { language, setLanguage } = useLanguage();

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <header className="bg-white border-b border-slate-200/80 px-6 py-4 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-30 shadow-sm">
      <div>
        <div className="flex items-center gap-2 mb-0.5">
          <span className="px-2.5 py-0.5 rounded-full bg-[#EF3F09]/10 text-[#EF3F09] text-[10px] font-extrabold uppercase tracking-wider">
            Golang REST API Engine
          </span>
          <span className="text-slate-400 text-xs font-semibold flex items-center gap-1">
            <Database className="w-3 h-3 text-emerald-600" /> PostgreSQL 16
          </span>
        </div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight leading-snug">{title}</h2>
        <p className="text-slate-500 text-xs font-semibold">{subtitle}</p>
      </div>

      <div className="flex items-center gap-3">
        {/* Language Switcher Pill */}
        <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => setLanguage('id')}
            className={`px-3 py-1.5 rounded-lg text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
              language === 'id'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <span>🇮🇩</span>
            <span>ID</span>
          </button>
          <button
            type="button"
            onClick={() => setLanguage('en')}
            className={`px-3 py-1.5 rounded-lg text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
              language === 'en'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <span>🇬🇧</span>
            <span>EN</span>
          </button>
        </div>

        {/* Theme Switcher Button */}
        <button
          type="button"
          onClick={() => setIsDark(!isDark)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition cursor-pointer border border-slate-200"
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
        </button>

        {/* System Notification */}
        <button className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#EF3F09]"></span>
        </button>
      </div>
    </header>
  );
};
