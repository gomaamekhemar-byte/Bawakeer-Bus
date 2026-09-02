import React, { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { getSupabaseCredentials, saveSupabaseCredentials, testConnection } from './supabase';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import AdminDashboard from './components/AdminDashboard';
import SupervisorView from './components/SupervisorView';
import DriverView from './components/DriverView';
import Login from './components/Login';
import { Database, X, RefreshCw, Bell } from 'lucide-react';

// البيانات الأولية للنظام
const INITIAL_BUSES = [
  { id: 'bus-1', number: 'حافلة 12', plate: 'أ ب د 1234', capacity: 25, route: 'مسار شمال الرياض', districts: 'النرجس، الياسمين، العارض', status: 'active', driver: 'الكابتن أحمد الشمري', attendant: 'أم أحمد العتيبي' },
  { id: 'bus-2', number: 'حافلة 08', plate: 'س ر ق 5678', capacity: 30, route: 'مسار غرب الرياض', districts: 'الملقا، الصحافة، حطين', status: 'active', driver: 'الكابتن سالم الدوسري', attendant: 'أم سارة القحطاني' },
  { id: 'bus-3', number: 'حافلة 05', plate: 'م ن هـ 9012', capacity: 20, route: 'مسار شرق الرياض', districts: 'الرمال، المونسية، اليرموك', status: 'maintenance', driver: 'الكابتن فهد المطيري', attendant: 'أم خالد الحربي' }
];

const INITIAL_STAFF = [
  { id: 'staff-1', national_id: '1000000004', full_name: 'الكابتن أحمد الشمري', name: 'الكابتن أحمد الشمري', phone: '0501110004', role: 'driver', busId: 'bus-1' },
  { id: 'staff-2', national_id: '1000000003', full_name: 'أم أحمد العتيبي', name: 'أم أحمد العتيبي', phone: '0501110003', role: 'attendant', busId: 'bus-1' },
  { id: 'staff-3', national_id: '1000000002', full_name: 'أ. سارة المنصور', name: 'أ. سارة المنصور', phone: '0501110002', role: 'school_supervisor', busId: 'bus-1' }
];

const INITIAL_STUDENTS = [
  { id: 'std-1', busId: 'bus-1', name: 'عبدالرحمن خالد العتيبي', grade: 'الرابع الابتدائي (أ)', sequence: 1, address: 'حي النرجس - شارع 14 - فيلا 6', lat: 24.8234, lng: 46.6543, fatherPhone: '0501112233', motherPhone: '0551112233', receiver: 'الأب (خالد العتيبي)', status: 'boarded' },
  { id: 'std-2', busId: 'bus-1', name: 'سارة محمد القحطاني', grade: 'الثالث الابتدائي (ب)', sequence: 2, address: 'حي الياسمين - شارع 22 - فيلا 18', lat: 24.8150, lng: 46.6420, fatherPhone: '0554445566', motherPhone: '0544445566', receiver: 'الأم (منيرة السبيعي)', status: 'boarded' },
  { id: 'std-3', busId: 'bus-1', name: 'فيصل فهد الشمري', grade: 'الخامس الابتدائي (ج)', sequence: 3, address: 'حي العارض - شارع 8 - مجمع النخيل', lat: 24.8390, lng: 46.6310, fatherPhone: '0537778899', motherPhone: '0567778899', receiver: 'السائق الخاص (راجو)', status: 'boarded' },
  { id: 'std-4', busId: 'bus-1', name: 'ريما عبدالله الدوسري', grade: 'الثاني الابتدائي (أ)', sequence: 4, address: 'حي الصحافة - شارع العليا - عمارة 5', lat: 24.7920, lng: 46.6280, fatherPhone: '0560001122', motherPhone: '0570001122', receiver: 'الأب (عبدالله الدوسري)', status: 'delivered' },
  { id: 'std-5', busId: 'bus-1', name: 'ريان فهد المطيري', grade: 'الرابع الابتدائي (ب)', sequence: 5, address: 'حي النرجس - شارع 30 - فيلا 12', lat: 24.8280, lng: 46.6590, fatherPhone: '0509998877', motherPhone: '0559998877', receiver: 'الأب (فهد المطيري)', status: 'absent' },
  { id: 'std-6', busId: 'bus-2', name: 'جود سلطان الغامدي', grade: 'الأول الابتدائي (أ)', sequence: 1, address: 'حي الملقا - شارع أنس بن مالك', lat: 24.7980, lng: 46.6120, fatherPhone: '0541239876', motherPhone: '0561239876', receiver: 'الأم', status: 'boarded' }
];

const INITIAL_ALERTS = [
  { id: 'alt-1', studentId: 'std-5', studentName: 'ريان فهد المطيري', grade: 'الرابع الابتدائي (ب)', busNumber: 'حافلة 12', fatherPhone: '0509998877', motherPhone: '0559998877', consecutiveDays: 3, dates: 'الأحد 02/09، الخميس 29/08، الأربعاء 28/08 (مستثنى منها الإجازات)', status: 'pending' }
];

function MainApp() {
  const { t, isRTL } = useLanguage();
  const [currentUser, setCurrentUser] = useState(null);
  const [currentTab, setCurrentTab] = useState('dashboard');
  
  // بيانات المنظومة
  const [buses, setBuses] = useState(INITIAL_BUSES);
  const [staffList, setStaffList] = useState(INITIAL_STAFF);
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [toastMessage, setToastMessage] = useState(null);

  // حالة رحلة السائق
  const [trip, setTrip] = useState({
    isActive: true,
    busId: 'bus-1',
    busNumber: 'حافلة 12',
    driverName: 'الكابتن أحمد الشمري',
    type: 'afternoon',
    typeName: 'رحلة العودة (من المدرسة للمنازل)',
    startOdometer: 54200,
    startTime: '12:45 م',
    endOdometer: null,
    totalDistance: null
  });

  // حالة الاتصال بقاعدة البيانات
  const [showDbModal, setShowDbModal] = useState(false);
  const [configUrl, setConfigUrl] = useState('');
  const [configKey, setConfigKey] = useState('');
  const [isDbConnected, setIsDbConnected] = useState(false);
  const [configStatus, setConfigStatus] = useState(null);
  const [testingConfig, setTestingConfig] = useState(false);

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
  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData);
    if (userData.role === 'admin' || userData.role === 'general_admin') {
      setCurrentTab('dashboard');
    } else if (userData.role === 'supervisor' || userData.role === 'school_supervisor' || userData.role === 'bus_supervisor') {
      setCurrentTab('supervisor-view');
    } else if (userData.role === 'driver') {
      setCurrentTab('driver-view');
    } else {
      setCurrentTab('driver-view');
    }
    showToast(`مرحباً بك، ${userData.name}`);
  };

  // تحديث حالة حضور الطالب
  const handleUpdateStudentStatus = (studentId, status) => {
    setStudents(prev => prev.map(s => s.id === studentId ? { ...s, status } : s));
    const std = students.find(s => s.id === studentId);
    if (status === 'boarded') showToast(`✅ ركب الطالب: ${std?.name}`);
    if (status === 'absent') showToast(`🔴 غياب الطالب: ${std?.name}`);
    if (status === 'delivered') showToast(`🏠 تم تسليم: ${std?.name}`);
  };

  // بدء رحلة جديدة
  const handleStartTrip = (odometer, type, chosenBus) => {
    const busObj = chosenBus || buses[0];
    setTrip({
      isActive: true,
      busId: busObj.id,
      busNumber: busObj.number,
      driverName: currentUser?.name || 'الكابتن أحمد',
      type,
      typeName: type === 'morning' ? 'رحلة صباحية (للمدرسة)' : type === 'afternoon' ? 'رحلة العودة (للمنازل)' : 'خدمات خارجية',
      startOdometer: odometer,
      startTime: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
      endOdometer: null,
      totalDistance: null
    });
    showToast(`🚀 تم بدء رحلة ${busObj.number} (${busObj.route}) بنجاح!`);
  };

  // إنهاء الرحلة وحساب المسافة
  const handleEndTrip = (odometerEnd) => {
    const distance = (odometerEnd - (trip.startOdometer || 0)).toFixed(1);
    setTrip(prev => ({
      ...prev,
      isActive: false,
      endOdometer: odometerEnd,
      totalDistance: distance
    }));
    showToast(`🏁 تم إنهاء الرحلة! المسافة المقطوعة: ${distance} كم`);
  };

  // اعتماد صعود الباص بالكامل
  const handleApproveAll = (busId) => {
    setStudents(prev => prev.map(s => (s.busId === busId && s.status === 'pending') ? { ...s, status: 'boarded' } : s));
    showToast('🚀 تم اعتماد ركوب الحافلة بالكامل وانطلاقها للمنازل!');
  };

  if (!currentUser) {
    return (
      <Login 
        onLoginSuccess={handleLoginSuccess}
        onOpenDbModal={() => setShowDbModal(true)}
        isDbConnected={isDbConnected}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 font-sans flex flex-col">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl z-50 flex items-center gap-3 text-xs font-bold animate-bounce border border-slate-700">
          <Bell size={16} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* الشريط العلوي */}
      <Header 
        user={currentUser}
        onLogout={() => setCurrentUser(null)}
        onOpenDbModal={() => setShowDbModal(true)}
        isDbConnected={isDbConnected}
      />

      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto">
        
        {/* القائمة الجانبية المخصصة حسب الدور */}
        <Sidebar 
          role={currentUser.role}
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
        />

        {/* جسم الصفحة الرئيسي */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          
          {/* 1. لوحة تحكم المشرف العام / المدير */}
          {(currentTab === 'dashboard' || currentTab === 'reports' || currentTab === 'settings') && (
            <AdminDashboard 
              currentTab={currentTab}
              onSelectTab={setCurrentTab}
              buses={buses}
              students={students}
              alerts={alerts}
              onResolveAlert={(id) => {
                setAlerts(prev => prev.filter(a => a.id !== id));
                showToast('✅ تم توثيق المتابعة مع الأسرة.');
              }}
              onAddBus={(b) => { setBuses(prev => [...prev, b]); showToast('✅ تمت إضافة الحافلة بنجاح'); }}
              onDeleteBus={(id) => { setBuses(prev => prev.filter(b => b.id !== id)); showToast('تم حذف الحافلة'); }}
              staffList={staffList}
              onAddStaff={(st) => { setStaffList(prev => [...prev, st]); showToast('✅ تمت إضافة الموظف وربطه بالحافلة'); }}
              onDeleteStaff={(id) => { setStaffList(prev => prev.filter(st => st.id !== id)); showToast('تم حذف الموظف'); }}
              onAddStudent={(s) => { setStudents(prev => [...prev, s]); showToast('✅ تمت إضافة الطالب وتخصيص الحافلة بنجاح'); }}
              onDeleteStudent={(id) => { setStudents(prev => prev.filter(s => s.id !== id)); showToast('تم حذف الطالب'); }}
            />
          )}

          {/* 2. شاشة مشرفة المدرسة */}
          {(currentTab === 'supervisor-view' || currentTab === 'supervisor-preview') && (
            <SupervisorView 
              buses={buses}
              students={students}
              onUpdateStatus={handleUpdateStudentStatus}
              onApproveAll={handleApproveAll}
            />
          )}

          {/* 3. شاشة سائق الحافلة / المرافقة */}
          {(currentTab === 'driver-view' || currentTab === 'driver-preview' || currentTab === 'attendant-view') && (
            <DriverView 
              buses={buses}
              trip={trip}
              students={students}
              onStartTrip={handleStartTrip}
              onEndTrip={handleEndTrip}
              onDeliverStudent={(id) => handleUpdateStudentStatus(id, 'delivered')}
            />
          )}

        </main>
      </div>

      {/* مودال إعدادات Supabase */}
      {showDbModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4" dir="rtl">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Database className="text-emerald-600" size={18} />
                <span>إعدادات قاعدة بيانات Supabase</span>
              </h3>
              <button onClick={() => setShowDbModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
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
                setTimeout(() => { setShowDbModal(false); setConfigStatus(null); }, 1500);
              } else {
                saveSupabaseCredentials(configUrl, configKey);
                setIsDbConnected(true);
                setConfigStatus({ type: 'warning', msg: res.error || 'تم حفظ الإعدادات' });
              }
            }} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Project URL:</label>
                <input required value={configUrl} onChange={e => setConfigUrl(e.target.value)} className="w-full p-2.5 bg-slate-50 border rounded-xl font-mono text-xs" />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Anon API Key:</label>
                <textarea rows={3} required value={configKey} onChange={e => setConfigKey(e.target.value)} className="w-full p-2.5 bg-slate-50 border rounded-xl font-mono text-xs" />
              </div>

              {configStatus && (
                <div className={`p-2.5 rounded-xl text-xs ${configStatus.type === 'success' ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'}`}>
                  {configStatus.msg}
                </div>
              )}

              <button type="submit" disabled={testingConfig} className="w-full bg-emerald-600 text-white font-bold py-2.5 rounded-xl">
                {testingConfig ? 'جاري الفحص...' : 'حفظ واختبار الاتصال'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <MainApp />
    </LanguageProvider>
  );
}
