import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { exportAttendanceToExcel } from '../utils/excelExport';
import { 
  Bus, Users, AlertTriangle, Navigation, FileSpreadsheet, Download, 
  Search, Filter, Plus, Trash2, Phone, MessageSquare, Check, 
  CheckCircle, X, Shield, Settings as SettingsIcon, Printer, 
  Route, ShieldCheck, Activity, MapPin, Gauge, UserCheck, ShieldAlert
} from 'lucide-react';

export default function AdminDashboard({ 
  currentTab, onSelectTab, buses, students, alerts, onResolveAlert, 
  onAddBus, onDeleteBus, staffList, onAddStaff, onDeleteStaff, 
  onAddStudent, onDeleteStudent 
}) {
  const { t, isRTL } = useLanguage();
  
  // مزامنة التبويب الحالي مع القائمة الجانبية
  const [activeSubTab, setActiveSubTab] = useState('overview'); // overview, reports, settings
  const [settingsSubTab, setSettingsSubTab] = useState('buses'); // buses, staff, students

  useEffect(() => {
    if (currentTab === 'reports') {
      setActiveSubTab('reports');
    } else if (currentTab === 'settings') {
      setActiveSubTab('settings');
    } else if (currentTab === 'dashboard') {
      setActiveSubTab('overview');
    }
  }, [currentTab]);

  const handleTabChange = (tabId) => {
    setActiveSubTab(tabId);
    if (onSelectTab) {
      if (tabId === 'overview') onSelectTab('dashboard');
      if (tabId === 'reports') onSelectTab('reports');
      if (tabId === 'settings') onSelectTab('settings');
    }
  };

  // حالات فلترة التقارير
  const [reportFilter, setReportFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  // نوافذ إضافة جديدة
  const [showAddBusModal, setShowAddBusModal] = useState(false);
  const [newBus, setNewBus] = useState({ number: '', plate: '', capacity: 25, route: '', districts: '' });

  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [newStaff, setNewStaff] = useState({ 
    name: '', national_id: '', phone: '', role: 'driver', busId: buses[0]?.id || 'bus-1' 
  });

  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [newStudent, setNewStudent] = useState({ 
    name: '', grade: '', busId: buses[0]?.id || 'bus-1', sequence: 1, 
    address: '', fatherPhone: '', motherPhone: '', receiver: '' 
  });

  // حساب الإحصائيات
  const totalBuses = buses.length;
  const totalStudents = students.length;
  const absentToday = students.filter(s => s.status === 'absent').length;
  const boardedCount = students.filter(s => s.status === 'boarded').length;
  const deliveredCount = students.filter(s => s.status === 'delivered').length;
  const activeTripsCount = buses.filter(b => b.status === 'active').length;

  // تجهيز بيانات التقارير
  const filteredLogs = students.filter(std => {
    const bus = buses.find(b => b.id === std.busId);
    const busName = bus ? bus.number : '';
    const matchesFilter = reportFilter === 'all' || std.status === reportFilter;
    const matchesSearch = std.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          busName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          std.grade.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleExportExcel = () => {
    setIsExporting(true);
    const exportData = filteredLogs.map(std => {
      const bus = buses.find(b => b.id === std.busId);
      return {
        studentName: std.name,
        grade: std.grade,
        busNumber: bus ? `${bus.number} (${bus.route})` : 'حافلة 12',
        status: std.status,
        time: new Date().toLocaleTimeString('ar-SA'),
        recordedBy: 'مشرفة البوابة',
        fatherPhone: std.fatherPhone,
        motherPhone: std.motherPhone
      };
    });

    setTimeout(() => {
      exportAttendanceToExcel(exportData, 'كشف_تحضير_حافلات_بواكير', isRTL);
      setIsExporting(false);
    }, 400);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* شريط التبويبات العلوي للوحة التحكم */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 no-print overflow-x-auto">
        <button
          onClick={() => handleTabChange('overview')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeSubTab === 'overview' 
              ? 'bg-slate-900 text-white shadow-md' 
              : 'text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Activity size={15} />
          <span>{t('nav.dashboard')}</span>
        </button>

        <button
          onClick={() => handleTabChange('reports')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeSubTab === 'reports' 
              ? 'bg-slate-900 text-white shadow-md' 
              : 'text-slate-600 hover:bg-slate-200'
          }`}
        >
          <FileSpreadsheet size={15} />
          <span>{t('nav.reports')}</span>
        </button>

        <button
          onClick={() => handleTabChange('settings')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeSubTab === 'settings' 
              ? 'bg-slate-900 text-white shadow-md' 
              : 'text-slate-600 hover:bg-slate-200'
          }`}
        >
          <SettingsIcon size={15} />
          <span>{t('nav.settings')}</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* 1. التبويب الأول: الإحصائيات والتنبيهات ومراقبة الأسطول     */}
      {/* ========================================================= */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6">
          
          {/* كروت الإحصائيات (Stats Cards) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-xs font-bold">{t('stats.totalBuses')}</span>
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Bus size={18} />
                </div>
              </div>
              <p className="text-2xl font-black text-slate-800">{totalBuses}</p>
              <p className="text-[10px] text-emerald-600 font-semibold mt-1">2 قيد العمل الآن 🟢</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-xs font-bold">{t('stats.totalStudents')}</span>
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Users size={18} />
                </div>
              </div>
              <p className="text-2xl font-black text-slate-800">{totalStudents}</p>
              <p className="text-[10px] text-blue-600 font-semibold mt-1">{boardedCount} بالحافلات حالياً</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-xs font-bold">{t('stats.absentToday')}</span>
                <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                  <X size={18} />
                </div>
              </div>
              <p className="text-2xl font-black text-rose-600">{absentToday}</p>
              <p className="text-[10px] text-rose-500 font-semibold mt-1">تم توثيق الغياب 🔴</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-xs font-bold">{t('stats.activeTrips')}</span>
                <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                  <Navigation size={18} />
                </div>
              </div>
              <p className="text-2xl font-black text-teal-700">{activeTripsCount}</p>
              <p className="text-[10px] text-teal-600 font-semibold mt-1">رحلات عودة للمنازل 🚌</p>
            </div>

          </div>

          {/* التنبيهات الذكية للغياب المتتالي */}
          {alerts.length > 0 ? (
            <div className="bg-gradient-to-r from-amber-500/10 via-amber-50 to-orange-50 border-2 border-amber-300 rounded-3xl p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                  <AlertTriangle className="text-amber-600 animate-pulse" size={20} />
                  <span>{t('alerts.title')}</span>
                </div>
                <span className="text-xs bg-amber-200 text-amber-900 px-2.5 py-0.5 rounded-full font-bold">
                  {t('alerts.subtitle')}
                </span>
              </div>

              {alerts.map(alt => (
                <div key={alt.id} className="bg-white p-4 rounded-2xl border border-amber-200 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-sm">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800 text-sm">{alt.studentName}</span>
                      <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">{alt.grade}</span>
                      <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold">{alt.busNumber}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      <strong>سجل أيام الانقطاع:</strong> {alt.dates}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <a
                      href={`tel:${alt.fatherPhone}`}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
                    >
                      <Phone size={14} />
                      <span>{t('alerts.fatherCall')}</span>
                    </a>

                    <a
                      href={`https://wa.me/966${alt.fatherPhone.slice(1)}?text=${encodeURIComponent(`السلام عليكم ورحمة الله، من مدارس بواكير الأهلية - نود الاطمئنان على الطالب ${alt.studentName} نظراً لغيابه لـ 3 أيام متتالية.`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
                    >
                      <MessageSquare size={14} />
                      <span>{t('alerts.whatsapp')}</span>
                    </a>

                    <button
                      onClick={() => onResolveAlert(alt.id)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
                    >
                      {t('alerts.resolved')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-4 text-center text-xs text-emerald-800 font-bold">
              ✅ {t('alerts.noAlerts')}
            </div>
          )}

          {/* بطاقات الحافلات ومتابعة الأسطول والمسارات */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Route size={18} className="text-emerald-600" />
                <span>متابعة حركة الحافلات والمسارات والأحياء</span>
              </h2>
              <span className="text-xs text-slate-400">تحديث لحظي 🟢</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {buses.map(b => (
                <div key={b.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 text-sm">{b.number}</span>
                    <span className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-mono font-bold">{b.plate}</span>
                  </div>
                  <p className="text-xs text-slate-600"><strong>المسار:</strong> {b.route}</p>
                  <p className="text-xs text-slate-500"><strong>الأحياء:</strong> {b.districts}</p>
                  <p className="text-xs text-slate-500"><strong>السائق:</strong> {b.driver}</p>
                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-400">السعة: {b.capacity} طالب</span>
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-bold">رحلة نشطة ✅</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* 2. التبويب الثاني: التقارير وسجلات التحضير وتصدير Excel    */}
      {/* ========================================================= */}
      {activeSubTab === 'reports' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <FileSpreadsheet className="text-emerald-600" size={20} />
                <span>{t('reports.title')}</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">{t('reports.subtitle')}</p>
            </div>

            {/* أزرار التصدير والطباعة */}
            <div className="flex items-center gap-2 no-print">
              <button
                onClick={handlePrint}
                className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
              >
                <Printer size={15} />
                <span>{t('reports.printReport')}</span>
              </button>

              <button
                onClick={handleExportExcel}
                disabled={isExporting}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5"
              >
                <Download size={15} />
                <span>{isExporting ? t('reports.exporting') : t('reports.exportExcel')}</span>
              </button>
            </div>
          </div>

          {/* شريط الفلاتر والبحث */}
          <div className="flex flex-col sm:flex-row items-center gap-3 no-print">
            <div className="relative flex-1 w-full">
              <input
                type="text"
                placeholder={t('reports.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
              <Search className="absolute left-3.5 top-3 text-slate-400" size={16} />
            </div>

            <div className="flex items-center gap-1.5 w-full sm:w-auto">
              <Filter size={15} className="text-slate-400" />
              <select
                value={reportFilter}
                onChange={(e) => setReportFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">{t('reports.filterAll')}</option>
                <option value="boarded">{t('reports.filterBoarded')}</option>
                <option value="delivered">{t('reports.filterDelivered')}</option>
                <option value="absent">{t('reports.filterAbsent')}</option>
              </select>
            </div>
          </div>

          {/* جدول سجلات التحضير */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                <tr>
                  <th className="p-3">#</th>
                  <th className="p-3">{t('reports.studentName')}</th>
                  <th className="p-3">{t('reports.grade')}</th>
                  <th className="p-3">{t('reports.busNumber')}</th>
                  <th className="p-3">{t('reports.status')}</th>
                  <th className="p-3">{t('reports.time')}</th>
                  <th className="p-3">{t('settings.fatherPhone')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLogs.map((std, idx) => {
                  const bus = buses.find(b => b.id === std.busId);
                  return (
                    <tr key={std.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-3 font-bold text-slate-400">{idx + 1}</td>
                      <td className="p-3 font-bold text-slate-800">{std.name}</td>
                      <td className="p-3 text-slate-500">{std.grade}</td>
                      <td className="p-3 font-semibold text-slate-700">
                        <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-bold">
                          {bus ? bus.number : 'حافلة 12'}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          std.status === 'boarded' ? 'bg-emerald-100 text-emerald-800' :
                          std.status === 'delivered' ? 'bg-blue-100 text-blue-800' :
                          std.status === 'absent' ? 'bg-rose-100 text-rose-800' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {std.status === 'boarded' ? '🚌 ركب الحافلة' :
                           std.status === 'delivered' ? '✅ تم التسليم' :
                           std.status === 'absent' ? '🔴 غائب' : 'في الانتظار'}
                        </span>
                      </td>
                      <td className="p-3 text-slate-400 font-mono">01:15 م</td>
                      <td className="p-3 font-mono text-slate-600">{std.fatherPhone}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* 3. التبويب الثالث: الإعدادات وإدارة الأسطول والكوادر والطلاب */}
      {/* ========================================================= */}
      {activeSubTab === 'settings' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <SettingsIcon className="text-emerald-600" size={20} />
                <span>{t('settings.title')}</span>
              </h2>
            </div>

            {/* محدد قسم الإعدادات */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl text-xs font-bold">
              <button
                onClick={() => setSettingsSubTab('buses')}
                className={`px-3.5 py-1.5 rounded-xl transition-all ${
                  settingsSubTab === 'buses' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600'
                }`}
              >
                {t('settings.tabBuses')}
              </button>
              <button
                onClick={() => setSettingsSubTab('staff')}
                className={`px-3.5 py-1.5 rounded-xl transition-all ${
                  settingsSubTab === 'staff' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600'
                }`}
              >
                {t('settings.tabDrivers')}
              </button>
              <button
                onClick={() => setSettingsSubTab('students')}
                className={`px-3.5 py-1.5 rounded-xl transition-all ${
                  settingsSubTab === 'students' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600'
                }`}
              >
                {t('settings.tabStudents')}
              </button>
            </div>
          </div>

          {/* قسم إدارة الحافلات */}
          {settingsSubTab === 'buses' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500">قائمة الحافلات المسجلة بالنظام:</span>
                <button
                  onClick={() => setShowAddBusModal(true)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
                >
                  <Plus size={15} />
                  <span>{t('settings.addBus')}</span>
                </button>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                    <tr>
                      <th className="p-3">{t('settings.busNumber')}</th>
                      <th className="p-3">{t('settings.plateNumber')}</th>
                      <th className="p-3">{t('settings.capacity')}</th>
                      <th className="p-3">{t('settings.route')}</th>
                      <th className="p-3">{t('settings.actions')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {buses.map(b => (
                      <tr key={b.id} className="hover:bg-slate-50/60">
                        <td className="p-3 font-bold text-slate-800">{b.number}</td>
                        <td className="p-3 font-mono text-slate-600">{b.plate}</td>
                        <td className="p-3 text-slate-600">{b.capacity} مقعد</td>
                        <td className="p-3 text-slate-600">{b.route} ({b.districts})</td>
                        <td className="p-3">
                          <button 
                            onClick={() => onDeleteBus && onDeleteBus(b.id)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* قسم إدارة الطاقم (سائقين ومشرفات مع ربط الحافلة الإلزامي) */}
          {settingsSubTab === 'staff' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500">قائمة السائقين والمشرفات والحافلات المسندة:</span>
                <button
                  onClick={() => setShowAddStaffModal(true)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
                >
                  <Plus size={15} />
                  <span>{t('settings.addStaff')}</span>
                </button>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                    <tr>
                      <th className="p-3">{t('settings.name')}</th>
                      <th className="p-3">{t('settings.nationalId')}</th>
                      <th className="p-3">{t('settings.phone')}</th>
                      <th className="p-3">{t('settings.role')}</th>
                      <th className="p-3">{t('settings.assignedBus')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {staffList && staffList.length > 0 ? staffList.map(st => {
                      const bus = buses.find(b => b.id === st.busId || b.id === st.assigned_bus_id);
                      return (
                        <tr key={st.id} className="hover:bg-slate-50/60">
                          <td className="p-3 font-bold text-slate-800">{st.full_name || st.name}</td>
                          <td className="p-3 font-mono text-slate-600">{st.national_id}</td>
                          <td className="p-3 font-mono text-slate-600">{st.phone}</td>
                          <td className="p-3 font-bold text-emerald-700">
                            {st.role === 'driver' ? 'سائق حافلة' : 
                             st.role === 'attendant' ? 'مرافقة حافلة' : 
                             st.role === 'school_supervisor' || st.role === 'supervisor' ? 'مشرفة مدرسة' : st.role}
                          </td>
                          <td className="p-3">
                            <span className="bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-lg font-bold border border-emerald-200">
                              {bus ? `${bus.number} - ${bus.route}` : 'حافلة 12'}
                            </span>
                          </td>
                        </tr>
                      );
                    }) : (
                      <>
                        <tr>
                          <td className="p-3 font-bold">الكابتن أحمد الشمري</td>
                          <td className="p-3 font-mono">1000000004</td>
                          <td className="p-3 font-mono">0501110004</td>
                          <td className="p-3 font-bold text-emerald-700">سائق حافلة</td>
                          <td className="p-3">
                            <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-bold border border-emerald-200">
                              حافلة 12 - مسار شمال الرياض
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td className="p-3 font-bold">أم أحمد العتيبي</td>
                          <td className="p-3 font-mono">1000000003</td>
                          <td className="p-3 font-mono">0501110003</td>
                          <td className="p-3 font-bold text-blue-700">مرافقة حافلة</td>
                          <td className="p-3">
                            <span className="bg-blue-50 text-blue-800 px-2 py-0.5 rounded font-bold border border-blue-200">
                              حافلة 12 - مسار شمال الرياض
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td className="p-3 font-bold">أ. سارة المنصور</td>
                          <td className="p-3 font-mono">1000000002</td>
                          <td className="p-3 font-mono">0501110002</td>
                          <td className="p-3 font-bold text-purple-700">مشرفة مدرسة</td>
                          <td className="p-3">
                            <span className="bg-purple-50 text-purple-800 px-2 py-0.5 rounded font-bold border border-purple-200">
                              جميع الحافلات (بوابة التفويج)
                            </span>
                          </td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* قسم إدارة الطلاب والترتيب الجغرافي (مع ربط الحافلة الإلزامي) */}
          {settingsSubTab === 'students' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500">قائمة الطلاب وتوزيع الحافلات والتسلسل (geo_order):</span>
                <button
                  onClick={() => setShowAddStudentModal(true)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
                >
                  <Plus size={15} />
                  <span>{t('settings.addStudent')}</span>
                </button>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                    <tr>
                      <th className="p-3">{t('settings.sequence')}</th>
                      <th className="p-3">{t('reports.studentName')}</th>
                      <th className="p-3">{t('reports.grade')}</th>
                      <th className="p-3">{t('settings.assignedBus')}</th>
                      <th className="p-3">{t('settings.fatherPhone')}</th>
                      <th className="p-3">{t('settings.motherPhone')}</th>
                      <th className="p-3">العنوان</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {students.map(std => {
                      const bus = buses.find(b => b.id === std.busId);
                      return (
                        <tr key={std.id} className="hover:bg-slate-50/60">
                          <td className="p-3 font-black text-emerald-700">#{std.sequence}</td>
                          <td className="p-3 font-bold text-slate-800">{std.name}</td>
                          <td className="p-3 text-slate-500">{std.grade}</td>
                          <td className="p-3 font-bold text-slate-700">
                            <span className="bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-lg font-bold border border-emerald-200">
                              {bus ? `${bus.number} - ${bus.route}` : 'حافلة 12'}
                            </span>
                          </td>
                          <td className="p-3 font-mono text-slate-600">{std.fatherPhone}</td>
                          <td className="p-3 font-mono text-slate-600">{std.motherPhone}</td>
                          <td className="p-3 text-slate-500">{std.address}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ========================================================= */}
      {/* نماذج الإضافة المنبثقة مع القوائم المنسدلة الإلزامية للباصات */}
      {/* ========================================================= */}

      {/* 1. مودال إضافة حافلة */}
      {showAddBusModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4" dir="rtl">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Bus className="text-emerald-600" size={18} />
              <span>{t('settings.addBus')}</span>
            </h3>

            <form onSubmit={(e) => {
              e.preventDefault();
              onAddBus({ id: `bus-${Date.now()}`, ...newBus, status: 'active' });
              setShowAddBusModal(false);
              setNewBus({ number: '', plate: '', capacity: 25, route: '', districts: '' });
            }} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">رقم الحافلة (إلزامي):</label>
                <input required placeholder="مثال: حافلة 14" value={newBus.number} onChange={e => setNewBus({...newBus, number: e.target.value})} className="w-full p-2.5 bg-slate-50 border rounded-xl" />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">رقم اللوحة المرورية (إلزامي):</label>
                <input required placeholder="مثال: د ر ق 4567" value={newBus.plate} onChange={e => setNewBus({...newBus, plate: e.target.value})} className="w-full p-2.5 bg-slate-50 border rounded-xl" />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">السعة الاستيعابية (مقاعد):</label>
                <input type="number" required value={newBus.capacity} onChange={e => setNewBus({...newBus, capacity: parseInt(e.target.value) || 25})} className="w-full p-2.5 bg-slate-50 border rounded-xl" />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">اسم المسار والأحياء المشمولة:</label>
                <input required placeholder="مثال: مسار حي الملقا والصحافة" value={newBus.route} onChange={e => setNewBus({...newBus, route: e.target.value, districts: e.target.value})} className="w-full p-2.5 bg-slate-50 border rounded-xl" />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 bg-emerald-600 text-white font-bold py-2.5 rounded-xl">حفظ الحافلة</button>
                <button type="button" onClick={() => setShowAddBusModal(false)} className="px-4 bg-slate-100 text-slate-600 rounded-xl">إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. مودال إضافة موظف (سائق / مشرفة) مع قائمة منسدلة إجبارية لاختيار الحافلة */}
      {showAddStaffModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4" dir="rtl">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <UserCheck className="text-emerald-600" size={18} />
              <span>{t('settings.addStaff')}</span>
            </h3>

            <form onSubmit={(e) => {
              e.preventDefault();
              if (!newStaff.busId) {
                alert('الرجاء اختيار الحافلة المخصصة للموظف');
                return;
              }
              onAddStaff({ id: `staff-${Date.now()}`, ...newStaff, full_name: newStaff.name });
              setShowAddStaffModal(false);
              setNewStaff({ name: '', national_id: '', phone: '', role: 'driver', busId: buses[0]?.id || 'bus-1' });
            }} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">الاسم الكامل للموظف:</label>
                <input required placeholder="مثال: خالد محمد الشمري" value={newStaff.name} onChange={e => setNewStaff({...newStaff, name: e.target.value})} className="w-full p-2.5 bg-slate-50 border rounded-xl" />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">رقم الهوية الوطنية / الإقامة (10 أرقام):</label>
                <input required placeholder="10xxxxxxxx" value={newStaff.national_id} onChange={e => setNewStaff({...newStaff, national_id: e.target.value})} className="w-full p-2.5 bg-slate-50 border rounded-xl font-mono" />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">رقم الجوال:</label>
                <input required placeholder="05xxxxxxxx" value={newStaff.phone} onChange={e => setNewStaff({...newStaff, phone: e.target.value})} className="w-full p-2.5 bg-slate-50 border rounded-xl font-mono" />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">الدور الوظيفي:</label>
                <select value={newStaff.role} onChange={e => setNewStaff({...newStaff, role: e.target.value})} className="w-full p-2.5 bg-slate-50 border rounded-xl font-bold">
                  <option value="driver">سائق حافلة (Driver)</option>
                  <option value="attendant">مرافقة حافلة (Attendant / العاملة)</option>
                  <option value="school_supervisor">مشرفة مدرسة (School Supervisor)</option>
                </select>
              </div>

              {/* القائمة المنسدلة الإلزامية لاختيار الحافلة (Select Bus Dropdown) */}
              <div>
                <label className="font-bold text-emerald-800 block mb-1 flex items-center gap-1">
                  <Bus size={14} className="text-emerald-600" />
                  <span>الحافلة والمسار المخصص (إلزامي):</span>
                </label>
                <select 
                  required
                  value={newStaff.busId} 
                  onChange={e => setNewStaff({...newStaff, busId: e.target.value})}
                  className="w-full p-3 bg-emerald-50/50 border-2 border-emerald-300 text-slate-800 rounded-xl font-bold text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  {buses.map(b => (
                    <option key={b.id} value={b.id}>
                      🚌 {b.number} - {b.route} ({b.plate})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 bg-emerald-600 text-white font-bold py-2.5 rounded-xl">حفظ الموظف</button>
                <button type="button" onClick={() => setShowAddStaffModal(false)} className="px-4 bg-slate-100 text-slate-600 rounded-xl">إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. مودال إضافة طالب مع قائمة منسدلة إجبارية لاختيار الحافلة */}
      {showAddStudentModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4" dir="rtl">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Users className="text-emerald-600" size={18} />
              <span>{t('settings.addStudent')}</span>
            </h3>

            <form onSubmit={(e) => {
              e.preventDefault();
              if (!newStudent.busId) {
                alert('الرجاء اختيار الحافلة المخصصة للطالب');
                return;
              }
              onAddStudent({ 
                id: `std-${Date.now()}`, 
                ...newStudent, 
                status: 'boarded', 
                consecutiveAbsence: 0 
              });
              setShowAddStudentModal(false);
              setNewStudent({ name: '', grade: '', busId: buses[0]?.id || 'bus-1', sequence: 1, address: '', fatherPhone: '', motherPhone: '', receiver: '' });
            }} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">اسم الطالب رباعي (إلزامي):</label>
                <input required placeholder="مثال: محمد عبدالله الشمري" value={newStudent.name} onChange={e => setNewStudent({...newStudent, name: e.target.value})} className="w-full p-2.5 bg-slate-50 border rounded-xl" />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">المرحلة / الصف:</label>
                <input required placeholder="مثال: الرابع الابتدائي (أ)" value={newStudent.grade} onChange={e => setNewStudent({...newStudent, grade: e.target.value})} className="w-full p-2.5 bg-slate-50 border rounded-xl" />
              </div>

              {/* القائمة المنسدلة الإلزامية لاختيار الحافلة (Select Bus Dropdown) */}
              <div>
                <label className="font-bold text-emerald-800 block mb-1 flex items-center gap-1">
                  <Bus size={14} className="text-emerald-600" />
                  <span>الحافلة المخصصة لنقل الطالب (إلزامي):</span>
                </label>
                <select 
                  required
                  value={newStudent.busId} 
                  onChange={e => setNewStudent({...newStudent, busId: e.target.value})}
                  className="w-full p-3 bg-emerald-50/50 border-2 border-emerald-300 text-slate-800 rounded-xl font-bold text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  {buses.map(b => (
                    <option key={b.id} value={b.id}>
                      🚌 {b.number} - {b.route} ({b.plate})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">جوال الأب:</label>
                  <input required placeholder="0500000000" value={newStudent.fatherPhone} onChange={e => setNewStudent({...newStudent, fatherPhone: e.target.value})} className="w-full p-2.5 bg-slate-50 border rounded-xl font-mono" />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">تسلسل النزول (geo_order):</label>
                  <input type="number" required value={newStudent.sequence} onChange={e => setNewStudent({...newStudent, sequence: parseInt(e.target.value) || 1})} className="w-full p-2.5 bg-slate-50 border rounded-xl font-mono" />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">جوال الأم أو المستلم:</label>
                <input placeholder="0550000000" value={newStudent.motherPhone} onChange={e => setNewStudent({...newStudent, motherPhone: e.target.value})} className="w-full p-2.5 bg-slate-50 border rounded-xl font-mono" />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">العنوان والحي بالتفصيل:</label>
                <input required placeholder="حي النرجس - شارع 12 - فيلا 4" value={newStudent.address} onChange={e => setNewStudent({...newStudent, address: e.target.value})} className="w-full p-2.5 bg-slate-50 border rounded-xl" />
              </div>

              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 bg-emerald-600 text-white font-bold py-2.5 rounded-xl">حفظ الطالب</button>
                <button type="button" onClick={() => setShowAddStudentModal(false)} className="px-4 bg-slate-100 text-slate-600 rounded-xl">إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
