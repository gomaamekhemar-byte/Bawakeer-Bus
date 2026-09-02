import React, { useState, useEffect } from 'react';
import { 
  supabase, getSupabaseCredentials, saveSupabaseCredentials, 
  clearSupabaseCredentials, testConnection 
} from './supabase';
import { 
  Bus, UserCheck, Shield, Phone, ArrowRight, CheckCircle, Settings, 
  MapPin, AlertCircle, RefreshCw, LogOut, Users, Check, X, Navigation, 
  Database, Key, Sparkles, Copy, MessageSquare, Gauge, Clock, 
  AlertTriangle, ShieldCheck, ChevronLeft, Map, Search, Eye, Bell,
  FileSpreadsheet, Filter, CheckCircle2, CircleDot
} from 'lucide-react';

// ==========================================
// البيانات التجريبية المتكاملة
// ==========================================
const INITIAL_BUSES = [
  { id: 'bus-1', number: 'حافلة 12', plate: 'أ ب د 1234', capacity: 25, route: 'مسار شمال الرياض', districts: 'النرجس، الياسمين، العارض', status: 'active', driver: 'الكابتن أحمد الشمري', attendant: 'أم أحمد العتيبي', currentTrip: 'afternoon' },
  { id: 'bus-2', number: 'حافلة 08', plate: 'س ر ق 5678', capacity: 30, route: 'مسار غرب الرياض', districts: 'الملقا، الصحافة، حطين', status: 'active', driver: 'الكابتن سالم الدوسري', attendant: 'أم سارة القحطاني', currentTrip: 'idle' },
  { id: 'bus-3', number: 'حافلة 05', plate: 'م ن هـ 9012', capacity: 20, route: 'مسار شرق الرياض', districts: 'الرمال، المونسية، اليرموك', status: 'maintenance', driver: 'الكابتن فهد المطيري', attendant: 'أم خالد الحربي', currentTrip: 'idle' }
];

const INITIAL_STUDENTS = [
  { id: 'std-1', busId: 'bus-1', name: 'عبدالرحمن خالد العتيبي', grade: 'الرابع الابتدائي (أ)', sequence: 1, address: 'حي النرجس - شارع 14 - فيلا 6', lat: 24.8234, lng: 46.6543, fatherPhone: '0501112233', motherPhone: '0551112233', receiver: 'الأب (خالد العتيبي)', status: 'boarded', consecutiveAbsence: 0 },
  { id: 'std-2', busId: 'bus-1', name: 'سارة محمد القحطاني', grade: 'الثالث الابتدائي (ب)', sequence: 2, address: 'حي الياسمين - شارع 22 - فيلا 18', lat: 24.8150, lng: 46.6420, fatherPhone: '0554445566', motherPhone: '0544445566', receiver: 'الأم (منيرة السبيعي)', status: 'boarded', consecutiveAbsence: 0 },
  { id: 'std-3', busId: 'bus-1', name: 'فيصل فهد الشمري', grade: 'الخامس الابتدائي (ج)', sequence: 3, address: 'حي العارض - شارع 8 - مجمع النخيل', lat: 24.8390, lng: 46.6310, fatherPhone: '0537778899', motherPhone: '0567778899', receiver: 'السائق الخاص (راجو)', status: 'boarded', consecutiveAbsence: 0 },
  { id: 'std-4', busId: 'bus-1', name: 'ريما عبدالله الدوسري', grade: 'الثاني الابتدائي (أ)', sequence: 4, address: 'حي الصحافة - شارع العليا - عمارة 5', lat: 24.7920, lng: 46.6280, fatherPhone: '0560001122', motherPhone: '0570001122', receiver: 'الأب (عبدالله الدوسري)', status: 'delivered', consecutiveAbsence: 0 },
  { id: 'std-5', busId: 'bus-1', name: 'ريان فهد المطيري', grade: 'الرابع الابتدائي (ب)', sequence: 5, address: 'حي النرجس - شارع 30 - فيلا 12', lat: 24.8280, lng: 46.6590, fatherPhone: '0509998877', motherPhone: '0559998877', receiver: 'الأب (فهد المطيري)', status: 'absent', consecutiveAbsence: 3 },
  { id: 'std-6', busId: 'bus-2', name: 'جود سلطان الغامدي', grade: 'الأول الابتدائي (أ)', sequence: 1, address: 'حي الملقا - شارع أنس بن مالك', lat: 24.7980, lng: 46.6120, fatherPhone: '0541239876', motherPhone: '0561239876', receiver: 'الأم', status: 'pending', consecutiveAbsence: 0 }
];

const INITIAL_ALERTS = [
  { id: 'alt-1', studentId: 'std-5', studentName: 'ريان فهد المطيري', grade: 'الرابع الابتدائي (ب)', busNumber: 'حافلة 12', fatherPhone: '0509998877', motherPhone: '0559998877', consecutiveDays: 3, dates: 'الأحد 02/09، الخميس 29/08، الأربعاء 28/08 (مستثنى منها العطلات)', status: 'pending' }
];

const DEMO_USERS = {
  '1000000001': { name: 'أ. محمد السالم', role: 'general_admin', roleTitle: 'المشرف العام (تحكم شامل)', phone: '0501110001', national_id: '1000000001' },
  '1000000002': { name: 'أ. سارة المنصور', role: 'school_supervisor', roleTitle: 'مشرفة المدرسة (بوابة التفويج)', phone: '0501110002', national_id: '1000000002' },
  '1000000003': { name: 'أم أحمد العتيبي', role: 'attendant', roleTitle: 'مرافقة الحافلة (العاملة)', phone: '0501110003', national_id: '1000000003', busNumber: 'حافلة 12' },
  '1000000004': { name: 'الكابتن أحمد الشمري', role: 'driver', roleTitle: 'سائق الحافلة', phone: '0501110004', national_id: '1000000004', busNumber: 'حافلة 12' }
};

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [nationalIdInput, setNationalIdInput] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // حالات التطبيق العامة
  const [buses, setBuses] = useState(INITIAL_BUSES);
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [selectedBusId, setSelectedBusId] = useState('bus-1');
  const [toastMessage, setToastMessage] = useState(null);

  // حالة رحلة السائق (Active Trip State)
  const [activeTrip, setActiveTrip] = useState({
    isActive: true,
    busId: 'bus-1',
    type: 'afternoon',
    typeName: 'رحلة العودة (من المدرسة للمنازل)',
    startOdometer: 54200,
    startTime: '12:45 م',
    endOdometer: null,
    totalDistance: null
  });

  // نوافذ المودال
  const [showStartTripModal, setShowStartTripModal] = useState(false);
  const [showEndTripModal, setShowEndTripModal] = useState(false);
  const [tempOdometer, setTempOdometer] = useState('');
  const [tempTripType, setTempTripType] = useState('afternoon');
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [configUrl, setConfigUrl] = useState('');
  const [configKey, setConfigKey] = useState('');
  const [configStatus, setConfigStatus] = useState(null);
  const [testingConfig, setTestingConfig] = useState(false);
  const [isDbConnected, setIsDbConnected] = useState(false);

  useEffect(() => {
    const creds = getSupabaseCredentials();
    setConfigUrl(creds.url || '');
    setConfigKey(creds.key || '');
    setIsDbConnected(creds.isConfigured);
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // تسجيل الدخول
  const handleLogin = (idToLogin) => {
    const id = idToLogin || nationalIdInput.trim();
    if (!id) {
      setLoginError('الرجاء إدخال رقم الهوية');
      return;
    }

    setLoginLoading(true);
    setLoginError('');

    setTimeout(() => {
      if (DEMO_USERS[id]) {
        setCurrentUser(DEMO_USERS[id]);
      } else {
        // حساب افتراضي لأي رقم
        setCurrentUser({
          name: `موظف (${id})`,
          role: 'general_admin',
          roleTitle: 'مشرف عام للنظام',
          phone: '0500000000',
          national_id: id
        });
      }
      setLoginLoading(false);
    }, 400);
  };

  // تحديث حالة الطالب
  const setStudentStatus = (studentId, newStatus) => {
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        return { ...s, status: newStatus };
      }
      return s;
    }));

    const std = students.find(s => s.id === studentId);
    if (newStatus === 'boarded') showToast(`✅ تم تسجيل ركوب الطالب: ${std?.name}`);
    if (newStatus === 'delivered') showToast(`🏠 تم تسليم الطالب بأمان: ${std?.name}`);
    if (newStatus === 'absent') showToast(`🔴 تم تسجيل غياب الطالب: ${std?.name}`);
  };

  // بدء رحلة جديدة من السائق
  const handleStartTrip = (e) => {
    e.preventDefault();
    const odo = parseFloat(tempOdometer);
    if (!odo || odo <= 0) {
      alert('الرجاء إدخال قراءة صحيحة لعداد البداية');
      return;
    }

    setActiveTrip({
      isActive: true,
      busId: 'bus-1',
      type: tempTripType,
      typeName: tempTripType === 'morning' ? 'رحلة صباحية (للمدرسة)' : tempTripType === 'afternoon' ? 'رحلة العودة (للمنازل)' : 'خدمات ورحلات خارجية',
      startOdometer: odo,
      startTime: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
      endOdometer: null,
      totalDistance: null
    });

    setShowStartTripModal(false);
    setTempOdometer('');
    showToast('🚀 تم بدء الرحلة بنجاح وتوثيق عداد البداية!');
  };

  // إنهاء الرحلة وحساب الكيلومترات
  const handleEndTrip = (e) => {
    e.preventDefault();
    const odoEnd = parseFloat(tempOdometer);
    if (!odoEnd || odoEnd < activeTrip.startOdometer) {
      alert(`قراءة النهاية (${odoEnd}) يجب أن تكون أكبر أو تساوي قراءة البداية (${activeTrip.startOdometer})!`);
      return;
    }

    const dist = (odoEnd - activeTrip.startOdometer).toFixed(1);
    setActiveTrip(prev => ({
      ...prev,
      isActive: false,
      endOdometer: odoEnd,
      totalDistance: dist
    }));

    setShowEndTripModal(false);
    setTempOdometer('');
    showToast(`🏁 اكتملت الرحلة بنجاح! المسافة المقطوعة: ${dist} كم`);
  };

  // اعتماد صعود الباص بالكامل من المشرفة
  const handleApproveAllBoarded = (busId) => {
    setStudents(prev => prev.map(s => {
      if (s.busId === busId && s.status === 'pending') {
        return { ...s, status: 'boarded' };
      }
      return s;
    }));
    showToast('🚀 تم اعتماد ركوب الحافلة بالكامل وإشعار السائق والمشرف!');
  };

  // حل تنبيه الغياب
  const resolveAlert = (alertId) => {
    setAlerts(prev => prev.filter(a => a.id !== alertId));
    showToast('✅ تم توثيق التواصل مع الأسرة وحل التنبيه.');
  };

  // ==========================================
  // شاشة تسجيل الدخول
  // ==========================================
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 flex items-center justify-center p-4 font-sans relative" dir="rtl">
        
        {/* زر ضبط Supabase */}
        <button
          onClick={() => setShowConfigModal(true)}
          className="absolute top-4 left-4 bg-white/10 hover:bg-white/20 text-white text-xs px-3.5 py-2 rounded-xl backdrop-blur-md transition-all flex items-center gap-2 border border-white/10"
        >
          <Database size={15} />
          <span>ربط قاعدة البيانات</span>
          <span className={`w-2 h-2 rounded-full ${isDbConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
        </button>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-lg w-full border border-slate-100 my-8">
          
          {/* رأس الصفحة */}
          <div className="bg-emerald-600 p-7 text-white text-center relative overflow-hidden">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-3 backdrop-blur-md border border-white/20 shadow-inner">
              <Bus size={36} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold">مدارس بواكير الأهلية</h1>
            <p className="text-emerald-100 text-sm mt-1">منظومة النقل المدرسي وتتبع الحافلات الذكية</p>
          </div>

          <div className="p-7 space-y-6">
            
            {/* نموذج تسجيل الدخول بالهوية */}
            <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className="space-y-4">
              <div>
                <label className="block text-slate-700 text-xs font-bold mb-1.5">
                  رقم الهوية الوطنية / الإقامة للموظف
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={nationalIdInput}
                    onChange={(e) => setNationalIdInput(e.target.value)}
                    placeholder="أدخل رقم الهوية (10 أرقام)..."
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 text-right text-sm"
                  />
                  <Shield className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
                </div>
              </div>

              {loginError && (
                <div className="p-3 bg-rose-50 border border-rose-100 text-rose-600 text-xs rounded-xl text-center font-medium">
                  {loginError}
                </div>
              )}

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
              >
                {loginLoading ? (
                  <span>جاري الدخول...</span>
                ) : (
                  <>
                    <span>تسجيل الدخول للنظام</span>
                    <ArrowRight size={18} className="rotate-180" />
                  </>
                )}
              </button>
            </form>

            {/* أزرار التجربة الفورية لجميع الأدوار */}
            <div className="pt-4 border-t border-slate-100">
              <p className="text-xs text-slate-500 font-bold mb-3 flex items-center gap-1.5">
                <Sparkles size={14} className="text-amber-500" />
                <span>دخول سريع فوري حسب الدور الوظيفي (تجربة الشاشات):</span>
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {Object.entries(DEMO_USERS).map(([id, u]) => (
                  <button
                    key={id}
                    onClick={() => handleLogin(id)}
                    className="p-3 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-xl text-right transition-all flex flex-col group"
                  >
                    <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-700 flex items-center justify-between">
                      <span>{u.name}</span>
                      <span className="text-[10px] bg-slate-200 group-hover:bg-emerald-100 text-slate-600 group-hover:text-emerald-800 px-1.5 py-0.5 rounded">
                        {u.role === 'general_admin' ? 'مشرف عام' : u.role === 'school_supervisor' ? 'مشرفة مدرسة' : u.role === 'attendant' ? 'مرافقة' : 'سائق'}
                      </span>
                    </span>
                    <span className="text-[11px] text-slate-400 mt-0.5">{u.roleTitle}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>

          <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-100 text-center text-xs text-slate-400">
            مدارس بواكير الأهلية • قسم الحركة والنقل المدرسي
          </div>

        </div>

        {/* مودال إعدادات Supabase */}
        {showConfigModal && renderConfigModal()}
      </div>
    );
  }

  // الطلاب المخصصين للحافلة المحددة
  const activeBusStudents = students.filter(s => s.busId === selectedBusId);
  const nextStudentInQueue = activeBusStudents
    .filter(s => s.status === 'boarded')
    .sort((a, b) => a.sequence - b.sequence)[0];

  // ==========================================
  // شاشة التطبيق الرئيسية بعد تسجيل الدخول
  // ==========================================
  return (
    <div className="min-h-screen bg-slate-100 font-sans" dir="rtl">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl z-50 flex items-center gap-3 text-sm animate-bounce border border-slate-700">
          <Bell size={18} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* الشريط العلوي العام */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center shadow-md shadow-emerald-600/20">
              <Bus size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-800 text-sm">{currentUser.name}</span>
                <span className="bg-emerald-100 text-emerald-800 text-[11px] px-2 py-0.5 rounded-full font-bold">
                  {currentUser.role === 'general_admin' ? 'المشرف العام' : 
                   currentUser.role === 'school_supervisor' ? 'مشرفة المدرسة' : 
                   currentUser.role === 'attendant' ? 'مرافقة الحافلة' : 'سائق الحافلة'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">مدارس بواكير الأهلية • تتبع مباشر</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* مبدل سريع للأدوار للاختبار */}
            <div className="hidden sm:flex items-center bg-slate-100 p-1 rounded-xl text-xs">
              <button 
                onClick={() => handleLogin('1000000001')} 
                className={`px-2.5 py-1 rounded-lg transition-all ${currentUser.role === 'general_admin' ? 'bg-white font-bold shadow-sm text-emerald-700' : 'text-slate-600'}`}
              >
                مشرف عام
              </button>
              <button 
                onClick={() => handleLogin('1000000002')} 
                className={`px-2.5 py-1 rounded-lg transition-all ${currentUser.role === 'school_supervisor' ? 'bg-white font-bold shadow-sm text-emerald-700' : 'text-slate-600'}`}
              >
                مشرفة
              </button>
              <button 
                onClick={() => handleLogin('1000000003')} 
                className={`px-2.5 py-1 rounded-lg transition-all ${currentUser.role === 'attendant' ? 'bg-white font-bold shadow-sm text-emerald-700' : 'text-slate-600'}`}
              >
                مرافقة
              </button>
              <button 
                onClick={() => handleLogin('1000000004')} 
                className={`px-2.5 py-1 rounded-lg transition-all ${currentUser.role === 'driver' ? 'bg-white font-bold shadow-sm text-emerald-700' : 'text-slate-600'}`}
              >
                سائق
              </button>
            </div>

            <button
              onClick={() => setCurrentUser(null)}
              className="p-2 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 rounded-xl transition-colors"
              title="تسجيل الخروج"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* المحتوى الرئيسي المخصص حسب الدور */}
      <main className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
        
        {/* ==================================================== */}
        {/* 1. واجهة المشرف العام (General Admin Dashboard)      */}
        {/* ==================================================== */}
        {currentUser.role === 'general_admin' && (
          <div className="space-y-6">
            
            {/* إحصائيات سريعة للأسطول */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <span className="text-xs font-semibold">الحافلات في المسار</span>
                  <Bus size={18} className="text-emerald-600" />
                </div>
                <p className="text-2xl font-black text-slate-800">2 <span className="text-xs font-normal text-slate-400">من 3</span></p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <span className="text-xs font-semibold">الطلاب بالحافلات الآن</span>
                  <Users size={18} className="text-blue-600" />
                </div>
                <p className="text-2xl font-black text-blue-600">
                  {students.filter(s => s.status === 'boarded').length}
                </p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <span className="text-xs font-semibold">تم تسليمهم للمنزل</span>
                  <CheckCircle size={18} className="text-emerald-600" />
                </div>
                <p className="text-2xl font-black text-emerald-600">
                  {students.filter(s => s.status === 'delivered').length}
                </p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <span className="text-xs font-semibold">تنبيهات الغياب المتتالي</span>
                  <AlertTriangle size={18} className="text-amber-500" />
                </div>
                <p className="text-2xl font-black text-amber-600">{alerts.length}</p>
              </div>
            </div>

            {/* تنبيهات الغياب المتتالي الذكية (3 أيام دراسية متتالية مع استثناء الإجازات) */}
            {alerts.length > 0 && (
              <div className="bg-gradient-to-r from-amber-500/10 via-amber-50 to-orange-50 border-2 border-amber-300 rounded-3xl p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                    <AlertTriangle className="text-amber-600 animate-pulse" size={20} />
                    <span>تنبيه ذكي: رصد انقطاع وغياب متتالي للطلاب (3 أيام دراسية)</span>
                  </div>
                  <span className="text-xs bg-amber-200 text-amber-900 px-2.5 py-0.5 rounded-full font-bold">
                    مستثنى منها الإجازات الرسمية
                  </span>
                </div>

                {alerts.map(alt => (
                  <div key={alt.id} className="bg-white p-4 rounded-2xl border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800 text-sm">{alt.studentName}</span>
                        <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium">{alt.grade}</span>
                        <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md font-bold">{alt.busNumber}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        <strong>سجل أيام الغياب:</strong> {alt.dates}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <a
                        href={`tel:${alt.fatherPhone}`}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
                      >
                        <Phone size={14} />
                        <span>اتصال بالأب ({alt.fatherPhone})</span>
                      </a>

                      <a
                        href={`https://wa.me/966${alt.fatherPhone.slice(1)}?text=${encodeURIComponent(`السلام عليكم ورحمة الله، من مدارس بواكير الأهلية - نود الاطمئنان على الطالب ${alt.studentName} نظراً لغيابه لـ 3 أيام متتالية.`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
                      >
                        <MessageSquare size={14} />
                        <span>واتساب</span>
                      </a>

                      <button
                        onClick={() => resolveAlert(alt.id)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
                      >
                        تمت المتابعة
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* متابعة الأسطول والرحلات المباشرة والكيلومترات */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <Gauge className="text-emerald-600" size={20} />
                  <span>متابعة حركة الحافلات والعدادات واستهلاك المسافات</span>
                </h2>
                <span className="text-xs text-slate-400">تحديث لحظي</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {buses.map(b => (
                  <div key={b.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800">{b.number}</span>
                        <span className="text-xs font-mono bg-slate-200 text-slate-700 px-2 py-0.5 rounded">{b.plate}</span>
                      </div>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                        b.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {b.status === 'active' ? '🟢 قيد التشغيل' : '🟡 في الصيانة'}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 space-y-1">
                      <p><strong>المسار والأحياء:</strong> {b.route} ({b.districts})</p>
                      <p><strong>طاقم الحافلة:</strong> السائق: {b.driver} • المرافقة: {b.attendant}</p>
                    </div>

                    {b.id === 'bus-1' && activeTrip.isActive && (
                      <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 space-y-1">
                        <div className="flex items-center justify-between font-bold">
                          <span>الرحلة الجارية: {activeTrip.typeName}</span>
                          <span>البدء: {activeTrip.startTime}</span>
                        </div>
                        <p>قراءة عداد البداية: <strong>{activeTrip.startOdometer} كم</strong></p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ==================================================== */}
        {/* 2. واجهة مشرفة المدرسة (School Gate Supervisor View) */}
        {/* ==================================================== */}
        {currentUser.role === 'school_supervisor' && (
          <div className="space-y-6">
            
            {/* ترويسة المشرفة واختيار الحافلة */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <UserCheck className="text-emerald-600" size={24} />
                  <span>بوابة تفويج وصعود الطلاب - رحلة العودة</span>
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  تحضير صعود الطلاب في الحافلات قبل الانطلاق للمنازل
                </p>
              </div>

              {/* محدد الحافلة */}
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-slate-600">اختر الحافلة:</label>
                <select 
                  value={selectedBusId} 
                  onChange={(e) => setSelectedBusId(e.target.value)}
                  className="bg-slate-50 border border-slate-300 text-slate-800 text-xs rounded-xl px-3 py-2 font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="bus-1">حافلة 12 (شمال الرياض)</option>
                  <option value="bus-2">حافلة 08 (غرب الرياض)</option>
                </select>
              </div>
            </div>

            {/* شريط الإنجاز وسرعة التحضير */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center font-black text-lg">
                  {activeBusStudents.filter(s => s.status === 'boarded').length}/{activeBusStudents.length}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">حالة صعود الحافلة</h3>
                  <p className="text-xs text-slate-400">
                    ركب: {activeBusStudents.filter(s => s.status === 'boarded').length} • 
                    تم التسليم: {activeBusStudents.filter(s => s.status === 'delivered').length} • 
                    غياب: {activeBusStudents.filter(s => s.status === 'absent').length}
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleApproveAllBoarded(selectedBusId)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 size={16} />
                <span>اعتماد صعود الحافلة بالكامل وانطلاقها</span>
              </button>
            </div>

            {/* قائمة تفويج الطلاب */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-slate-800 mb-2">قائمة الطلاب المخصصين للحافلة:</h3>

              {activeBusStudents.map(std => (
                <div 
                  key={std.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    std.status === 'boarded' ? 'bg-emerald-50/70 border-emerald-200' :
                    std.status === 'absent' ? 'bg-rose-50/70 border-rose-200' :
                    std.status === 'delivered' ? 'bg-blue-50/70 border-blue-200' :
                    'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800 text-sm">{std.name}</span>
                      <span className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-medium">{std.grade}</span>
                      <span className="text-xs text-slate-400">تسلسل النزول: #{std.sequence}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{std.address}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setStudentStatus(std.id, 'boarded')}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        std.status === 'boarded' 
                          ? 'bg-emerald-600 text-white shadow-sm' 
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-emerald-50'
                      }`}
                    >
                      <Check size={14} />
                      <span>ركب الحافلة</span>
                    </button>

                    <button
                      onClick={() => setStudentStatus(std.id, 'absent')}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        std.status === 'absent' 
                          ? 'bg-rose-600 text-white shadow-sm' 
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-rose-50'
                      }`}
                    >
                      <X size={14} />
                      <span>غائب / استلم من المدرسة</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ==================================================== */}
        {/* 3. واجهة مرافقة الحافلة / العاملة (Attendant View)   */}
        {/* ==================================================== */}
        {currentUser.role === 'attendant' && (
          <div className="space-y-6">
            
            {/* بطاقة الطالب الحالي (المحطة القادمة للتسليم) */}
            {nextStudentInQueue ? (
              <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold">
                    <CircleDot size={14} className="animate-ping" />
                    <span>المحطة الحالية للتسليم (#{nextStudentInQueue.sequence})</span>
                  </div>
                  <span className="text-xs text-emerald-100">رحلة العودة للمنازل</span>
                </div>

                <div>
                  <h2 className="text-2xl font-black">{nextStudentInQueue.name}</h2>
                  <p className="text-emerald-100 text-xs mt-1">{nextStudentInQueue.grade} • {nextStudentInQueue.address}</p>
                  <p className="text-xs text-white/90 mt-1 font-semibold">المستلم المعتمد: {nextStudentInQueue.receiver}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                  <button
                    onClick={() => setStudentStatus(nextStudentInQueue.id, 'delivered')}
                    className="w-full bg-white text-emerald-800 hover:bg-emerald-50 py-3.5 rounded-2xl font-black text-sm shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={20} className="text-emerald-600" />
                    <span>تم تسليم الطالب لولي أمره بأمان (نزل)</span>
                  </button>

                  <div className="flex gap-2">
                    <a
                      href={`tel:${nextStudentInQueue.fatherPhone}`}
                      className="flex-1 bg-white/20 hover:bg-white/30 backdrop-blur-md py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Phone size={16} />
                      <span>اتصال بالأب</span>
                    </a>

                    <a
                      href={`https://wa.me/966${nextStudentInQueue.fatherPhone.slice(1)}?text=${encodeURIComponent(`السلام عليكم، حافلة مدارس بواكير على وشك الوصول لمنزل الطالب ${nextStudentInQueue.name}. يرجى التفضل بالاستلام.`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 bg-green-500 hover:bg-green-600 py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <MessageSquare size={16} />
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-emerald-50 border-2 border-dashed border-emerald-300 rounded-3xl p-8 text-center space-y-2">
                <CheckCircle2 size={40} className="text-emerald-600 mx-auto" />
                <h3 className="font-bold text-emerald-900 text-lg">تم تسليم جميع الطلاب بأمان!</h3>
                <p className="text-xs text-emerald-700">لا يوجد طلاب متبقين في الحافلة الآن.</p>
              </div>
            )}

            {/* قائمة الطلاب التالية في خط السير */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-slate-800">ترتيب مسار الطلاب في الحافلة (حافلة 12):</h3>

              {activeBusStudents.map(std => (
                <div 
                  key={std.id}
                  className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                    std.status === 'delivered' ? 'bg-slate-100 text-slate-400 border-slate-200 line-through' :
                    std.status === 'boarded' ? 'bg-white border-emerald-200 shadow-sm' :
                    'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-bold">
                      #{std.sequence}
                    </span>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{std.name}</p>
                      <p className="text-xs text-slate-400">{std.address}</p>
                    </div>
                  </div>

                  <span className={`text-xs px-2.5 py-1 rounded-xl font-bold ${
                    std.status === 'delivered' ? 'bg-blue-100 text-blue-800' :
                    std.status === 'boarded' ? 'bg-emerald-100 text-emerald-800' :
                    'bg-rose-100 text-rose-800'
                  }`}>
                    {std.status === 'delivered' ? '✅ تم التسليم' :
                     std.status === 'boarded' ? '🚌 في الباص' : 'غائب'}
                  </span>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ==================================================== */}
        {/* 4. واجهة سائق الحافلة (Bus Driver Dashboard)        */}
        {/* ==================================================== */}
        {currentUser.role === 'driver' && (
          <div className="space-y-6">
            
            {/* حالة الرحلة والتحكم بالعداد */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full font-bold">
                    حافلة 12 • الكابتن أحمد الشمري
                  </span>
                  {activeTrip.isActive && (
                    <span className="text-xs bg-emerald-500 text-slate-950 font-bold px-2.5 py-0.5 rounded-full animate-pulse">
                      الرحلة جارية
                    </span>
                  )}
                </div>
                <h1 className="text-xl font-bold mt-2">{activeTrip.typeName}</h1>
                <p className="text-xs text-slate-400 mt-1">
                  قراءة عداد البداية: <strong className="text-white font-mono">{activeTrip.startOdometer} كم</strong> • البدء: {activeTrip.startTime}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {activeTrip.isActive ? (
                  <button
                    onClick={() => { setTempOdometer(''); setShowEndTripModal(true); }}
                    className="bg-rose-600 hover:bg-rose-700 text-white px-5 py-3 rounded-2xl font-bold text-xs shadow-lg shadow-rose-600/30 transition-all flex items-center gap-2"
                  >
                    <Gauge size={16} />
                    <span>إنهاء الرحلة وتسجيل العداد</span>
                  </button>
                ) : (
                  <button
                    onClick={() => { setTempOdometer(''); setShowStartTripModal(true); }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-2xl font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2"
                  >
                    <Navigation size={16} />
                    <span>بدء رحلة جديدة</span>
                  </button>
                )}
              </div>
            </div>

            {/* بطاقة التوجيه للمحطة القادمة (Minimal Driving UI) */}
            {nextStudentInQueue && activeTrip.isActive && (
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-bold flex items-center gap-1.5 text-emerald-700">
                    <MapPin size={16} />
                    <span>المحطة التالية في خط السير:</span>
                  </span>
                  <span>الطلاب المتبقون: {activeBusStudents.filter(s => s.status === 'boarded').length}</span>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <h3 className="text-xl font-black text-slate-800">{nextStudentInQueue.name}</h3>
                  <p className="text-xs text-slate-600 mt-1 flex items-center gap-1">
                    <MapPin size={14} className="text-slate-400" />
                    {nextStudentInQueue.address}
                  </p>
                </div>

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${nextStudentInQueue.lat},${nextStudentInQueue.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-slate-900 hover:bg-black text-white py-3.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
                >
                  <Map size={18} />
                  <span>توجيه المسار عبر خرائط Google Maps</span>
                </a>
              </div>
            )}

            {/* مسافة الرحلة المنجزة إن وجدت */}
            {!activeTrip.isActive && activeTrip.totalDistance && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 text-center space-y-2">
                <CheckCircle2 size={40} className="text-emerald-600 mx-auto" />
                <h3 className="font-bold text-slate-800 text-base">تم إغلاق الرحلة بنجاح</h3>
                <p className="text-xs text-slate-600">
                  عداد النهاية: <strong>{activeTrip.endOdometer} كم</strong> • إجمالي المسافة المقطوعة: <strong className="text-emerald-700 text-sm font-black">{activeTrip.totalDistance} كم</strong>
                </p>
              </div>
            )}

          </div>
        )}

      </main>

      {/* ==================================================== */}
      {/* نوافذ المودال (Modals)                                */}
      {/* ==================================================== */}

      {/* مودال بدء الرحلة للسائق */}
      {showStartTripModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4" dir="rtl">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Navigation className="text-emerald-600" size={20} />
              <span>بدء رحلة جديدة للحافلة</span>
            </h3>

            <form onSubmit={handleStartTrip} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">نوع الرحلة:</label>
                <select 
                  value={tempTripType} 
                  onChange={(e) => setTempTripType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-800 text-xs rounded-xl p-3 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="morning">رحلة صباحية (من المنازل للمدرسة)</option>
                  <option value="afternoon">رحلة العودة (من المدرسة للمنازل)</option>
                  <option value="external_service">خدمات ورحلات خارجية / أنشطة</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">قراءة عداد الكيلومترات الحالي (البداية):</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="مثال: 54200"
                  value={tempOdometer}
                  onChange={(e) => setTempOdometer(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-800 text-xs font-mono rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-xs shadow-md transition-all"
                >
                  تأكيد وبدء الرحلة
                </button>
                <button
                  type="button"
                  onClick={() => setShowStartTripModal(false)}
                  className="px-4 bg-slate-100 text-slate-600 font-bold py-3 rounded-xl text-xs"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* مودال إنهاء الرحلة للسائق */}
      {showEndTripModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4" dir="rtl">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Gauge className="text-rose-600" size={20} />
              <span>إنهاء الرحلة وتسجيل العداد النهائي</span>
            </h3>

            <form onSubmit={handleEndTrip} className="space-y-4">
              <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600">
                قراءة عداد البداية الموثق: <strong>{activeTrip.startOdometer} كم</strong>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">قراءة عداد الكيلومترات عند الوصول (النهاية):</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder={`يجب أن تكون أكبر من ${activeTrip.startOdometer}`}
                  value={tempOdometer}
                  onChange={(e) => setTempOdometer(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-800 text-xs font-mono rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 rounded-xl text-xs shadow-md transition-all"
                >
                  حساب المسافة وإنهاء الرحلة
                </button>
                <button
                  type="button"
                  onClick={() => setShowEndTripModal(false)}
                  className="px-4 bg-slate-100 text-slate-600 font-bold py-3 rounded-xl text-xs"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* مودال إعدادات Supabase */}
      {showConfigModal && renderConfigModal()}

    </div>
  );

  function renderConfigModal() {
    return (
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 border border-slate-200 max-h-[90vh] overflow-y-auto" dir="rtl">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Database className="text-emerald-600" size={20} />
              <span>إعدادات ربط Supabase وقاعدة البيانات</span>
            </h3>
            <button onClick={() => setShowConfigModal(false)} className="text-slate-400 hover:text-slate-600 p-1">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={async (e) => {
            e.preventDefault();
            setTestingConfig(true);
            const res = await testConnection(configUrl, configKey);
            setTestingConfig(false);
            if (res.success) {
              saveSupabaseCredentials(configUrl, configKey);
              setIsDbConnected(true);
              setConfigStatus({ type: 'success', msg: '✅ تم الاتصال بـ Supabase بنجاح!' });
              setTimeout(() => { setShowConfigModal(false); setConfigStatus(null); }, 1500);
            } else {
              saveSupabaseCredentials(configUrl, configKey);
              setIsDbConnected(true);
              setConfigStatus({ type: 'warning', msg: res.error || 'تم حفظ الإعدادات' });
            }
          }} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Project URL:</label>
              <input
                type="text"
                value={configUrl}
                onChange={(e) => setConfigUrl(e.target.value)}
                className="w-full text-xs font-mono p-3 bg-slate-50 border border-slate-200 rounded-xl"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Anon Public Key:</label>
              <textarea
                value={configKey}
                onChange={(e) => setConfigKey(e.target.value)}
                rows={3}
                className="w-full text-xs font-mono p-3 bg-slate-50 border border-slate-200 rounded-xl"
                required
              />
            </div>

            {configStatus && (
              <div className={`p-3 rounded-xl text-xs ${configStatus.type === 'success' ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'}`}>
                {configStatus.msg}
              </div>
            )}

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={testingConfig}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl text-xs font-bold"
              >
                {testingConfig ? 'جاري الفحص...' : 'حفظ واختبار الاتصال'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
