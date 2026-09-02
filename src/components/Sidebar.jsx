import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  LayoutDashboard, Bus, ClipboardCheck, FileSpreadsheet, 
  Settings, Navigation, UserCheck, Shield 
} from 'lucide-react';

export default function Sidebar({ role, currentTab, onSelectTab }) {
  const { t } = useLanguage();

  // عناصر القائمة المخصصة حسب الدور
  const getNavItems = () => {
    if (role === 'admin' || role === 'general_admin') {
      return [
        { id: 'dashboard', label: t('nav.dashboard'), icon: LayoutDashboard },
        { id: 'reports', label: t('nav.reports'), icon: FileSpreadsheet },
        { id: 'settings', label: t('nav.settings'), icon: Settings },
        { id: 'driver-preview', label: t('nav.driverScreen'), icon: Navigation },
        { id: 'supervisor-preview', label: t('nav.supervisorScreen'), icon: UserCheck }
      ];
    }

    if (role === 'supervisor' || role === 'school_supervisor') {
      return [
        { id: 'supervisor-view', label: t('nav.supervisorScreen'), icon: UserCheck },
        { id: 'reports', label: t('nav.reports'), icon: FileSpreadsheet }
      ];
    }

    if (role === 'driver') {
      return [
        { id: 'driver-view', label: t('nav.driverScreen'), icon: Navigation }
      ];
    }

    if (role === 'attendant') {
      return [
        { id: 'attendant-view', label: t('roles.attendant'), icon: Navigation }
      ];
    }

    return [
      { id: 'dashboard', label: t('nav.dashboard'), icon: LayoutDashboard }
    ];
  };

  const navItems = getNavItems();

  return (
    <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-l md:border-r border-slate-200 p-3 flex md:flex-col justify-between md:justify-start gap-1 shrink-0 overflow-x-auto">
      <div className="flex md:flex-col gap-1 w-full">
        <div className="hidden md:block px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          {t(`roles.${role}`) || role}
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                isActive 
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon size={17} className={isActive ? 'text-white' : 'text-slate-400'} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
