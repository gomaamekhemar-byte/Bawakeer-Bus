import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  LayoutDashboard, ShieldCheck, Route, FileSpreadsheet, 
  Settings, Navigation, UserCheck, Bus, Users, Gauge 
} from 'lucide-react';

export default function Sidebar({ role, currentTab, onSelectTab }) {
  const { t } = useLanguage();

  // تخصيص الأيقونات السيادية للمدير والأيقونات الحركية والتنظيمية للمشرف
  const getNavItems = () => {
    if (role === 'admin' || role === 'general_admin') {
      return [
        { id: 'dashboard', label: t('nav.dashboard'), icon: LayoutDashboard },
        { id: 'reports', label: t('nav.reports'), icon: FileSpreadsheet },
        { id: 'settings', label: t('nav.settings'), icon: Settings },
        { id: 'supervisor-preview', label: t('nav.supervisorScreen'), icon: Route },
        { id: 'driver-preview', label: t('nav.driverScreen'), icon: Navigation }
      ];
    }

    if (role === 'bus_supervisor') {
      return [
        { id: 'dashboard', label: t('nav.fleet'), icon: Route },
        { id: 'reports', label: t('nav.reports'), icon: FileSpreadsheet },
        { id: 'supervisor-view', label: t('nav.supervisorScreen'), icon: UserCheck },
        { id: 'driver-preview', label: t('nav.driverScreen'), icon: Navigation }
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
    <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-l md:border-r border-slate-200 p-3 flex md:flex-col justify-between md:justify-start gap-1 shrink-0 overflow-x-auto shadow-sm">
      <div className="flex md:flex-col gap-1.5 w-full">
        <div className="hidden md:flex items-center gap-1.5 px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          <ShieldCheck size={14} className="text-emerald-600" />
          <span>{t(`roles.${role}`) || role}</span>
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
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
