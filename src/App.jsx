import React, { useState, useEffect } from 'react';
import { supabase, getSupabaseCredentials, saveSupabaseCredentials, clearSupabaseCredentials, testConnection } from './supabase';
import { 
  Bus, UserCheck, Shield, Phone, ArrowRight, CheckCircle, Settings, 
  MapPin, AlertCircle, RefreshCw, LogOut, Users, Check, X, Navigation, 
  Database, Key, ExternalLink, Sparkles, Copy
} from 'lucide-react';

export default function App() {
  const [nationalId, setNationalId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  // إعدادات الاتصال بـ Supabase
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [configUrl, setConfigUrl] = useState('');
  const [configKey, setConfigKey] = useState('');
  const [configStatus, setConfigStatus] = useState(null);
  const [testingConfig, setTestingConfig] = useState(false);
  const [isDbConnected, setIsDbConnected] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  // بيانات الطلاب والرحلة في لوحة التحكم
  const [students, setStudents] = useState([
    { id: 1, name: 'عبدالرحمن خالد العتيبي', grade: 'الرابع الابتدائي', stop: 'حي النرجس - شارع 14', parentPhone: '0501112233', status: 'pending' },
    { id: 2, name: 'سارة محمد القحطاني', grade: 'الثالث الابتدائي', stop: 'حي الياسمين - فيلا 22', parentPhone: '0554445566', status: 'boarded' },
    { id: 3, name: 'فيصل فهد الشمري', grade: 'الخامس الابتدائي', stop: 'حي العارض - شارع 8', parentPhone: '0537778899', status: 'delivered' },
    { id: 4, name: 'ريما عبدالله الدوسري', grade: 'الثاني الابتدائي', stop: 'حي الصحافة - مجمع 5', parentPhone: '0560001122', status: 'absent' },
  ]);

  const [tripActive, setTripActive] = useState(false);

  useEffect(() => {
    const creds = getSupabaseCredentials();
    setConfigUrl(creds.url || '');
    setConfigKey(creds.key || '');
    setIsDbConnected(creds.isConfigured);
  }, []);

  // تحويل الأرقام العربية إلى إنجليزية
  const normalizeDigits = (str) => {
    const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return str.replace(/[٠-٩]/g, (w) => arabicDigits.indexOf(w));
  };

  // دالة تسجيل الدخول
  const handleLogin = async (e) => {
    e.preventDefault();
    const cleanId = normalizeDigits(nationalId.trim());
    if (!cleanId) {
      setError('الرجاء إدخال رقم الهوية أو السجل');
      return;
    }

    setLoading(true);
    setError('');

    const creds = getSupabaseCredentials();

    // في حال عدم وجود اتصال بقاعدة البيانات بعد
    if (!creds.isConfigured) {
      if (cleanId === '1010101010' || cleanId === '1020202020' || cleanId === '1234567890') {
        setUser({
          name: cleanId === '1020202020' ? 'خالد عبد الله القحطاني' : 'أحمد محمد الشمري',
          role: cleanId === '1020202020' ? 'مشرف نقل مدرسي' : 'سائق حافلة',
          phone: '0501234567',
          national_id: cleanId,
          bus_number: 'حافلة رقم 12 (شمال الرياض)',
          isDemo: true
        });
        setLoading(false);
        return;
      }
    }

    try {
      const { data, error: dbError } = await supabase
        .from('staff')
        .select('*')
        .eq('national_id', cleanId)
        .single();

      if (dbError) {
        if (dbError.code === 'PGRST116') {
          setError('رقم الهوية غير مسجل في جدول الطاقم (staff). تأكد من إضافته في قاعدة البيانات.');
        } else {
          setError(`خطأ من قاعدة البيانات: ${dbError.message || 'تعذر جلب البيانات'}`);
        }
      } else if (!data) {
        setError('رقم الهوية غير مسجل في نظام الطاقم. تحقق من الرقم أو تواصل مع الإدارة.');
      } else {
        setUser({
          ...data,
          bus_number: data.bus_number || 'حافلة رقم 12 (شمال الرياض)'
        });
      }
    } catch (err) {
      setError('حدث خطأ في الاتصال بقاعدة البيانات. تأكد من صحة إعدادات الربط أو استخدم الحساب التجريبي.');
    } finally {
      setLoading(false);
    }
  };

  // حفظ واختبار بيانات الربط بـ Supabase
  const handleSaveConfig = async (e) => {
    e.preventDefault();
    setTestingConfig(true);
    setConfigStatus(null);

    const testRes = await testConnection(configUrl, configKey);
    setTestingConfig(false);

    if (testRes.success) {
      saveSupabaseCredentials(configUrl, configKey);
      setIsDbConnected(true);
      setConfigStatus({ type: 'success', msg: '✅ تم الاتصال بقاعدة بيانات Supabase بنجاح!' });
      setTimeout(() => {
        setShowConfigModal(false);
        setConfigStatus(null);
      }, 1500);
    } else {
      saveSupabaseCredentials(configUrl, configKey);
      setIsDbConnected(true);
      setConfigStatus({ 
        type: 'warning', 
        msg: testRes.error || 'تم حفظ الإعدادات ولكن يرجى التأكد من إنشاء جدول staff في Supabase' 
      });
    }
  };

  // تغيير حالة الطالب أثناء الرحلة
  const updateStudentStatus = (id, newStatus) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
  };

  const sqlSample = `CREATE TABLE IF NOT EXISTS public.staff (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    national_id TEXT NOT NULL UNIQUE,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'سائق حافلة'
);

ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read staff" ON public.staff FOR SELECT USING (true);

INSERT INTO public.staff (name, national_id, phone, role)
VALUES ('أحمد محمد الشمري', '1010101010', '0501234567', 'سائق حافلة')
ON CONFLICT (national_id) DO NOTHING;`;

  const copySqlToClipboard = () => {
    navigator.clipboard.writeText(sqlSample);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  // لوحة تحكم السائق / المشرف بعد تسجيل الدخول
  if (user) {
    const totalStudents = students.length;
    const boardedCount = students.filter(s => s.status === 'boarded').length;
    const deliveredCount = students.filter(s => s.status === 'delivered').length;
    const absentCount = students.filter(s => s.status === 'absent').length;

    return (
      <div className="min-h-screen bg-slate-100 p-4 md:p-8 font-sans" dir="rtl">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* شريط الإشعارات التجريبي إن وجد */}
          {user.isDemo && (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-2xl flex items-center justify-between text-sm shadow-sm">
              <div className="flex items-center gap-2">
                <Sparkles className="text-amber-600 flex-shrink-0" size={18} />
                <span>أنت تستخدم <strong>وضع المعاينة التجريبي</strong>. يمكنك ربط قاعدة بيانات Supabase الحقيقية في أي وقت.</span>
              </div>
              <button 
                onClick={() => setShowConfigModal(true)}
                className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1 rounded-xl font-medium text-xs whitespace-nowrap"
              >
                ربط Supabase الآن
              </button>
            </div>
          )}

          {/* ترويسة اللوحة */}
          <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-600/30 flex-shrink-0">
                <Bus size={32} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-slate-800">{user.name}</h1>
                  <span className="bg-emerald-100 text-emerald-700 text-xs px-2.5 py-1 rounded-full font-bold">
                    {user.role}
                  </span>
                </div>
                <p className="text-sm text-slate-500 mt-0.5">{user.bus_number} • مدارس بواكير الأهلية</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setTripActive(!tripActive)}
                className={`px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-md ${
                  tripActive 
                    ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse' 
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                <Navigation size={18} />
                <span>{tripActive ? 'إنهاء الرحلة الحالية' : 'بدء رحلة الحافلة'}</span>
              </button>

              <button
                onClick={() => setUser(null)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-2.5 rounded-xl transition-colors"
                title="تسجيل الخروج"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>

          {/* إحصائيات الرحلة */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
              <p className="text-slate-500 text-xs font-semibold mb-1">إجمالي الطلاب</p>
              <p className="text-2xl font-bold text-slate-800">{totalStudents}</p>
            </div>
            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 shadow-sm text-center">
              <p className="text-emerald-700 text-xs font-semibold mb-1">في الحافلة الآن</p>
              <p className="text-2xl font-bold text-emerald-800">{boardedCount}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 shadow-sm text-center">
              <p className="text-blue-700 text-xs font-semibold mb-1">تم توصيلهم بأمان</p>
              <p className="text-2xl font-bold text-blue-800">{deliveredCount}</p>
            </div>
            <div className="bg-rose-50 p-4 rounded-2xl border border-rose-100 shadow-sm text-center">
              <p className="text-rose-700 text-xs font-semibold mb-1">الغياب</p>
              <p className="text-2xl font-bold text-rose-800">{absentCount}</p>
            </div>
          </div>

          {/* قائمة الطلاب وحالة الركوب */}
          <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-200">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Users className="text-emerald-600" size={22} />
                <span>قائمة الطلاب بالمسار</span>
              </h2>
              <span className="text-xs text-slate-400">تحديث فوري للحالة</span>
            </div>

            <div className="space-y-3">
              {students.map((student) => (
                <div 
                  key={student.id}
                  className="p-4 rounded-2xl border border-slate-100 bg-slate-50/70 hover:bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800 text-sm">{student.name}</span>
                      <span className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md font-medium">
                        {student.grade}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                      <MapPin size={14} className="text-slate-400" />
                      {student.stop}
                    </p>
                  </div>

                  {/* أزرار الحالة */}
                  <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                    <a
                      href={`tel:${student.parentPhone}`}
                      className="p-2 rounded-xl bg-slate-200 text-slate-700 hover:bg-slate-300 transition-colors"
                      title={`اتصال بولي الأمر (${student.parentPhone})`}
                    >
                      <Phone size={16} />
                    </a>

                    <button
                      onClick={() => updateStudentStatus(student.id, 'boarded')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                        student.status === 'boarded'
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700'
                      }`}
                    >
                      <Check size={14} />
                      ركب الحافلة
                    </button>

                    <button
                      onClick={() => updateStudentStatus(student.id, 'delivered')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                        student.status === 'delivered'
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-blue-50 hover:text-blue-700'
                      }`}
                    >
                      <CheckCircle size={14} />
                      نزل بأمان
                    </button>

                    <button
                      onClick={() => updateStudentStatus(student.id, 'absent')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                        student.status === 'absent'
                          ? 'bg-rose-600 text-white shadow-sm'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-rose-50 hover:text-rose-700'
                      }`}
                    >
                      <X size={14} />
                      غائب
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    );
  }

  // شاشة تسجيل الدخول الأساسية
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 flex items-center justify-center p-4 font-sans relative" dir="rtl">
      
      {/* زر ضبط مفاتيح Supabase بأعلى الشاشة */}
      <button
        onClick={() => setShowConfigModal(true)}
        className="absolute top-4 left-4 bg-white/10 hover:bg-white/20 text-white text-xs px-3.5 py-2 rounded-xl backdrop-blur-md transition-all flex items-center gap-2 border border-white/10"
      >
        <Database size={16} />
        <span>إعدادات قاعدة البيانات</span>
        <span className={`w-2 h-2 rounded-full ${isDbConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
      </button>

      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-md w-full border border-slate-100 my-8">
        
        {/* رأس الصفحة */}
        <div className="bg-emerald-600 p-7 text-white text-center relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-3 backdrop-blur-md shadow-inner border border-white/20">
            <Bus size={36} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold">مدارس بواكير الأهلية</h1>
          <p className="text-emerald-100 text-sm mt-1">نظام تتبع وإدارة حافلات الطلاب</p>
        </div>

        {/* نموذج الدخول */}
        <form onSubmit={handleLogin} className="p-8">
          <div className="mb-6">
            <label className="block text-slate-700 text-sm font-semibold mb-2">
              رقم الهوية الوطنية / الإقامة للطاقم
            </label>
            <div className="relative">
              <input
                type="text"
                value={nationalId}
                onChange={(e) => setNationalId(e.target.value)}
                placeholder="أدخل رقم الهوية..."
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 placeholder-slate-400 text-right transition-all"
              />
              <Shield className="absolute left-3.5 top-3.5 text-slate-400" size={20} />
            </div>
          </div>

          {error && (
            <div className="mb-5 p-3.5 bg-rose-50 border border-rose-100 text-rose-600 text-xs sm:text-sm rounded-xl text-center font-medium leading-relaxed">
              {error}
            </div>
          )}

          {/* أزرار التجربة السريعة */}
          <div className="mb-5 bg-slate-50 p-3 rounded-2xl border border-slate-200/80 text-center">
            <p className="text-xs text-slate-500 font-semibold mb-2">💡 تجربة سريعة بنقرة واحدة:</p>
            <div className="flex justify-center gap-2">
              <button
                type="button"
                onClick={() => setNationalId('1010101010')}
                className="text-xs bg-white hover:bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors font-medium shadow-sm"
              >
                سائق: <span className="font-mono font-bold">1010101010</span>
              </button>
              <button
                type="button"
                onClick={() => setNationalId('1020202020')}
                className="text-xs bg-white hover:bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors font-medium shadow-sm"
              >
                مشرف: <span className="font-mono font-bold">1020202020</span>
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>جاري التحقق...</span>
            ) : (
              <>
                <span>دخول النظام</span>
                <ArrowRight size={18} className="rotate-180" />
              </>
            )}
          </button>
        </form>

        {/* تذييل */}
        <div className="bg-slate-50 px-8 py-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
          <span>شؤون النقل المدرسي</span>
          <button 
            onClick={() => setShowConfigModal(true)} 
            className="text-emerald-600 hover:underline flex items-center gap-1 font-medium"
          >
            <Key size={13} />
            ربط Supabase
          </button>
        </div>

      </div>

      {/* نافذة الربط مع Supabase */}
      {showConfigModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 border border-slate-200 max-h-[90vh] overflow-y-auto" dir="rtl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Database className="text-emerald-600" size={20} />
                <span>إعدادات ربط Supabase</span>
              </h3>
              <button onClick={() => setShowConfigModal(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveConfig} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Project URL (رابط المشروع في Supabase):
                </label>
                <input
                  type="text"
                  placeholder="https://xyzcompany.supabase.co"
                  value={configUrl}
                  onChange={(e) => setConfigUrl(e.target.value)}
                  className="w-full text-xs font-mono p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Anon / Public API Key:
                </label>
                <textarea
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  value={configKey}
                  onChange={(e) => setConfigKey(e.target.value)}
                  rows={3}
                  className="w-full text-xs font-mono p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>

              {configStatus && (
                <div className={`p-3 rounded-xl text-xs font-medium ${
                  configStatus.type === 'success' 
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                    : 'bg-amber-50 text-amber-800 border border-amber-200'
                }`}>
                  {configStatus.msg}
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={testingConfig}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl font-semibold text-sm transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2"
                >
                  {testingConfig ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      <span>جاري التحقق والاتصال...</span>
                    </>
                  ) : (
                    <span>حفظ واختبار الاتصال</span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    clearSupabaseCredentials();
                    setConfigUrl('');
                    setConfigKey('');
                    setIsDbConnected(false);
                    setConfigStatus({ type: 'warning', msg: 'تمت استعادة الإعدادات الافتراضية' });
                  }}
                  className="px-4 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold rounded-xl"
                >
                  مسح
                </button>
              </div>
            </form>

            {/* كود SQL السريع لإنشاء الجدول */}
            <div className="mt-6 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700">كود SQL لإنشاء جدول الطاقم في Supabase:</span>
                <button
                  onClick={copySqlToClipboard}
                  className="text-xs text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100"
                >
                  <Copy size={13} />
                  <span>{copiedSql ? 'تم النسخ!' : 'نسخ الكود'}</span>
                </button>
              </div>
              <pre className="bg-slate-900 text-slate-200 p-3 rounded-xl text-[11px] font-mono overflow-x-auto max-h-32 text-left" dir="ltr">
                {sqlSample}
              </pre>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
