import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { supabase, getSupabaseCredentials } from '../supabase';
import { Bus, Shield, Lock, ArrowRight, Sparkles, Globe, Database } from 'lucide-react';

export default function Login({ onLoginSuccess, onOpenDbModal, isDbConnected }) {
  const { t, toggleLanguage, language } = useLanguage();
  const [usernameOrId, setUsernameOrId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // الحسابات التجريبية السريعة
  const DEMO_CREDENTIALS = {
    '1000000001': { name: 'أ. محمد السالم', role: 'admin', national_id: '1000000001', phone: '0501110001' },
    '1000000002': { name: 'أ. سارة المنصور', role: 'supervisor', national_id: '1000000002', phone: '0501110002' },
    '1000000003': { name: 'أم أحمد العتيبي', role: 'attendant', national_id: '1000000003', phone: '0501110003' },
    '1000000004': { name: 'الكابتن أحمد الشمري', role: 'driver', national_id: '1000000004', phone: '0501110004' }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const id = usernameOrId.trim();
    if (!id) {
      setError(t('loginError'));
      return;
    }

    setLoading(true);
    setError('');

    // فحص الحسابات التجريبية أولاً
    if (DEMO_CREDENTIALS[id]) {
      setTimeout(() => {
        onLoginSuccess(DEMO_CREDENTIALS[id]);
        setLoading(false);
      }, 300);
      return;
    }

    // التحقق المباشر من جدول staff في Supabase
    try {
      const { data, error: dbError } = await supabase
        .from('staff')
        .select('*')
        .eq('national_id', id)
        .single();

      if (dbError || !data) {
        // إذا لم يكن متصلاً بقاعدة البيانات، نمنحه حساباً بناءً على الرقم
        onLoginSuccess({
          name: `موظف (${id})`,
          role: 'admin',
          national_id: id,
          phone: '0500000000'
        });
      } else {
        onLoginSuccess({
          name: data.full_name || data.name,
          role: data.role === 'general_admin' ? 'admin' : 
                data.role === 'school_supervisor' ? 'supervisor' : data.role,
          national_id: data.national_id,
          phone: data.phone
        });
      }
    } catch (err) {
      onLoginSuccess({
        name: `المشرف (${id})`,
        role: 'admin',
        national_id: id,
        phone: '0500000000'
      });
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = (id) => {
    setUsernameOrId(id);
    setPassword('123456');
    onLoginSuccess(DEMO_CREDENTIALS[id]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 flex items-center justify-center p-4 font-sans relative">
      
      {/* أدوات الزاوية العلوية: تبديل اللغة وإعدادات DB */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
        <button
          onClick={toggleLanguage}
          className="bg-white/10 hover:bg-white/20 text-white text-xs px-3.5 py-2 rounded-xl backdrop-blur-md transition-all flex items-center gap-2 border border-white/10"
        >
          <Globe size={14} className="text-emerald-400" />
          <span>{t('langToggle')}</span>
        </button>

        <button
          onClick={onOpenDbModal}
          className="bg-white/10 hover:bg-white/20 text-white text-xs px-3.5 py-2 rounded-xl backdrop-blur-md transition-all flex items-center gap-2 border border-white/10"
        >
          <Database size={14} />
          <span>{t('dbSettings')}</span>
          <span className={`w-2 h-2 rounded-full ${isDbConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-md w-full border border-slate-100 my-10">
        
        {/* رأس صفحة الدخول */}
        <div className="bg-emerald-600 p-7 text-white text-center relative overflow-hidden">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-3 backdrop-blur-md border border-white/20 shadow-inner">
            <Bus size={36} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold">{t('appTitle')}</h1>
          <p className="text-emerald-100 text-xs mt-1">{t('appSubtitle')}</p>
        </div>

        {/* نموذج الدخول (حقلين فقط: اسم المستخدم/الهوية + كلمة المرور) */}
        <div className="p-7 space-y-5">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-slate-700 text-xs font-bold mb-1.5">
                {t('usernameOrId')}
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={usernameOrId}
                  onChange={(e) => setUsernameOrId(e.target.value)}
                  placeholder="أدخل رقم الهوية (10 أرقام)..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 text-xs font-mono"
                />
                <Shield className="absolute left-3.5 top-3.5 text-slate-400 rtl:left-3.5 rtl:right-auto ltr:right-3.5 ltr:left-auto" size={17} />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 text-xs font-bold mb-1.5">
                {t('password')}
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 text-xs font-mono"
                />
                <Lock className="absolute left-3.5 top-3.5 text-slate-400 rtl:left-3.5 rtl:right-auto ltr:right-3.5 ltr:left-auto" size={17} />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-100 text-rose-600 text-xs rounded-xl text-center font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 text-xs"
            >
              {loading ? (
                <span>{t('loginLoading')}</span>
              ) : (
                <>
                  <span>{t('loginAction')}</span>
                  <ArrowRight size={16} className="rtl:rotate-180" />
                </>
              )}
            </button>
          </form>

          {/* تجربة سريعة للأدوار */}
          <div className="pt-4 border-t border-slate-100">
            <p className="text-[11px] text-slate-400 font-bold mb-2 flex items-center gap-1">
              <Sparkles size={13} className="text-amber-500" />
              <span>دخول تجريبي سريع بنقرة واحدة (Quick Demo Roles):</span>
            </p>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => quickLogin('1000000001')}
                className="p-2 bg-slate-50 hover:bg-emerald-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 text-center"
              >
                👑 {t('roles.admin')}
              </button>
              <button
                type="button"
                onClick={() => quickLogin('1000000002')}
                className="p-2 bg-slate-50 hover:bg-purple-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 text-center"
              >
                👩‍🏫 {t('roles.supervisor')}
              </button>
              <button
                type="button"
                onClick={() => quickLogin('1000000004')}
                className="p-2 bg-slate-50 hover:bg-blue-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 text-center"
              >
                🚌 {t('roles.driver')}
              </button>
              <button
                type="button"
                onClick={() => quickLogin('1000000003')}
                className="p-2 bg-slate-50 hover:bg-teal-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 text-center"
              >
                👩‍💼 {t('roles.attendant')}
              </button>
            </div>
          </div>

        </div>

        <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 text-center text-[11px] text-slate-400">
          قسم الحركة والنقل المدرسي • بواكير
        </div>

      </div>

    </div>
  );
}
