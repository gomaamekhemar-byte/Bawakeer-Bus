import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  Bus, Globe, LogOut, Database, User, ShieldCheck, Route, 
  Crown, UserCheck, Navigation, Sparkles 
} from 'lucide-react';

export default function Header({ user, onLogout, onOpenDbModal, isDbConnected }) {
  const { t, language, toggleLanguage, isRTL } = useLanguage();

  const getRoleIcon = () => {
    if (user.role === 'admin' || user.role === 'general_admin') {
      return <ShieldCheck size={16} className="text-amber-400" />;
    }
    if (user.role === 'bus_supervisor' || user.role === 'school_supervisor' || user.role === 'supervisor') {
      return <Route size={16} className="text-purple-300" />;
    }
    return <Navigation size={16} className="text-emerald-300" />;
  };

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
        
        {/* الشعار واسم المنظومة */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-700 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-600/30 flex-shrink-0 border border-emerald-400/30">
            <Bus size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-white text-sm sm:text-base leading-tight">
                {t('appTitle')}
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 bg-white/10 text-emerald-300 border border-white/10 text-[10px] px-2 py-0.5 rounded-full font-bold">
                {getRoleIcon()}
                <span>{t(`roles.${user.role}`) || user.role}</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden xs:block">
              {t('appSubtitle')}
            </p>
          </div>
        </div>

        {/* أدوات التحكم: تبديل اللغة، بيانات المستخدم، تسجيل الخروج */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* زر تبديل اللغة (عربي / English) */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-700 hover:border-emerald-500 bg-slate-800/80 hover:bg-slate-800 text-slate-200 text-xs font-bold transition-all shadow-sm"
            title={language === 'ar' ? 'Switch to English' : 'التحويل للغة العربية'}
          >
            <Globe size={14} className="text-emerald-400" />
            <span>{t('langToggle')}</span>
          </button>

          {/* مؤشر حالة قاعدة البيانات */}
          <button
            onClick={onOpenDbModal}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700/70 transition-colors"
            title={t('dbSettings')}
          >
            <Database size={13} className={isDbConnected ? 'text-emerald-400' : 'text-amber-400'} />
            <span className="text-[11px]">{isDbConnected ? t('connected') : t('demoMode')}</span>
            <span className={`w-2 h-2 rounded-full ${isDbConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
          </button>

          {/* بيانات المستخدم المقتضبة */}
          <div className="hidden lg:flex items-center gap-2 pr-2 border-r border-slate-800">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
              <User size={15} />
            </div>
            <div className="text-right text-xs">
              <p className="font-bold text-white leading-tight">{user.name || user.full_name}</p>
              <p className="text-[10px] text-slate-400 font-mono">{user.national_id || user.phone}</p>
            </div>
          </div>

          {/* زر تسجيل الخروج */}
          <button
            onClick={onLogout}
            className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold transition-colors flex items-center gap-1.5"
            title={t('logout')}
          >
            <LogOut size={15} />
            <span className="hidden sm:inline">{t('logout')}</span>
          </button>

        </div>

      </div>
    </header>
  );
}
