import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Bus, Globe, LogOut, Database, User, Shield } from 'lucide-react';

export default function Header({ user, onLogout, onOpenDbModal, isDbConnected }) {
  const { t, language, toggleLanguage, isRTL } = useLanguage();

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
        
        {/* الشعار واسم المدرسة */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center shadow-md shadow-emerald-600/20 flex-shrink-0">
            <Bus size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-slate-800 text-sm sm:text-base leading-tight">
                {t('appTitle')}
              </h1>
              <span className="hidden sm:inline-block bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-bold">
                {t(`roles.${user.role}`) || user.role}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden xs:block">
              {t('appSubtitle')}
            </p>
          </div>
        </div>

        {/* أدوات التحكم العلوية: تبديل اللغة، بيانات المستخدم، تسجيل الخروج */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* زر تبديل اللغة (Arabic / English Toggle) */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-emerald-400 bg-slate-50 hover:bg-emerald-50 text-slate-700 text-xs font-bold transition-all shadow-sm"
            title={language === 'ar' ? 'Switch to English' : 'التحويل للغة العربية'}
          >
            <Globe size={14} className="text-emerald-600" />
            <span>{t('langToggle')}</span>
          </button>

          {/* مؤشر حالة قاعدة البيانات */}
          <button
            onClick={onOpenDbModal}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
            title={t('dbSettings')}
          >
            <Database size={13} className={isDbConnected ? 'text-emerald-600' : 'text-amber-500'} />
            <span className="text-[11px]">{isDbConnected ? t('connected') : t('demoMode')}</span>
            <span className={`w-2 h-2 rounded-full ${isDbConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`}></span>
          </button>

          {/* بطاقة المستخدم المقتضبة */}
          <div className="hidden lg:flex items-center gap-2 pr-2 border-r border-slate-200">
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
              <User size={16} />
            </div>
            <div className="text-right text-xs">
              <p className="font-bold text-slate-800 leading-tight">{user.name || user.full_name}</p>
              <p className="text-[10px] text-slate-400 font-mono">{user.national_id || user.phone}</p>
            </div>
          </div>

          {/* زر تسجيل الخروج */}
          <button
            onClick={onLogout}
            className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold transition-colors flex items-center gap-1"
            title={t('logout')}
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">{t('logout')}</span>
          </button>

        </div>

      </div>
    </header>
  );
}
