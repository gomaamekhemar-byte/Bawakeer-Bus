import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { UserCheck, Check, X, Search, CheckCircle2, Phone, MapPin, Users } from 'lucide-react';

export default function SupervisorView({ buses, students, onUpdateStatus, onApproveAll }) {
  const { t } = useLanguage();
  const [selectedBusId, setSelectedBusId] = useState('bus-1');
  const [searchQuery, setSearchQuery] = useState('');

  const currentBus = buses.find(b => b.id === selectedBusId) || buses[0];
  const busStudents = students.filter(s => s.busId === selectedBusId);

  const filteredStudents = busStudents.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.grade.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const boardedCount = busStudents.filter(s => s.status === 'boarded').length;
  const absentCount = busStudents.filter(s => s.status === 'absent').length;
  const deliveredCount = busStudents.filter(s => s.status === 'delivered').length;

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      
      {/* رأس الصفحة والمحدد */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-purple-100 text-purple-700 rounded-2xl flex items-center justify-center font-bold">
              <UserCheck size={22} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800">{t('supervisor.title')}</h2>
              <p className="text-[11px] text-slate-400">تحضير صعود الطلاب في رحلة العودة</p>
            </div>
          </div>

          <select
            value={selectedBusId}
            onChange={(e) => setSelectedBusId(e.target.value)}
            className="bg-slate-50 border border-slate-300 text-slate-800 text-xs font-bold rounded-xl px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
          >
            {buses.map(b => (
              <option key={b.id} value={b.id}>{b.number} ({b.route})</option>
            ))}
          </select>
        </div>

        {/* إحصائيات سريعة للركوب */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs pt-2 border-t border-slate-100">
          <div className="bg-emerald-50 text-emerald-800 p-2.5 rounded-xl font-bold">
            <span>ركب: </span>
            <span className="text-sm font-black">{boardedCount}</span>
          </div>
          <div className="bg-blue-50 text-blue-800 p-2.5 rounded-xl font-bold">
            <span>تم التسليم: </span>
            <span className="text-sm font-black">{deliveredCount}</span>
          </div>
          <div className="bg-rose-50 text-rose-800 p-2.5 rounded-xl font-bold">
            <span>غائب: </span>
            <span className="text-sm font-black">{absentCount}</span>
          </div>
        </div>

        {/* زر اعتماد الصعود بالكامل */}
        <button
          onClick={() => onApproveAll(selectedBusId)}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-2xl text-xs shadow-md shadow-purple-600/20 transition-all flex items-center justify-center gap-2"
        >
          <CheckCircle2 size={16} />
          <span>{t('supervisor.approveAll')} ({currentBus?.number})</span>
        </button>
      </div>

      {/* شريط البحث السريع للجوال */}
      <div className="relative">
        <input
          type="text"
          placeholder={t('supervisor.searchStudent')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm"
        />
        <Search className="absolute left-3.5 top-3.5 text-slate-400" size={16} />
      </div>

      {/* قائمة الطلاب المخصصة للجوال (Mobile First Cards) */}
      <div className="space-y-3">
        {filteredStudents.map(std => {
          const isBoarded = std.status === 'boarded';
          const isAbsent = std.status === 'absent';
          const isDelivered = std.status === 'delivered';

          return (
            <div
              key={std.id}
              className={`p-4 rounded-3xl border transition-all space-y-3 bg-white ${
                isBoarded ? 'border-emerald-300 ring-2 ring-emerald-100 shadow-sm' :
                isAbsent ? 'border-rose-200 bg-rose-50/40' :
                isDelivered ? 'border-blue-200 bg-blue-50/40' :
                'border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-bold flex items-center justify-center">
                      #{std.sequence}
                    </span>
                    <h3 className="font-bold text-slate-800 text-sm">{std.name}</h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{std.grade} • {std.address}</p>
                </div>

                <span className={`text-[11px] px-2.5 py-1 rounded-full font-bold ${
                  isBoarded ? 'bg-emerald-100 text-emerald-800' :
                  isAbsent ? 'bg-rose-100 text-rose-800' :
                  isDelivered ? 'bg-blue-100 text-blue-800' :
                  'bg-slate-100 text-slate-600'
                }`}>
                  {isBoarded ? '🚌 ركب' : isAbsent ? '🔴 غائب' : isDelivered ? '✅ تم التسليم' : '⏳ في الانتظار'}
                </span>
              </div>

              {/* أزرار التحضير الكبيرة المريحة للمس بالإبهام */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => onUpdateStatus(std.id, 'boarded')}
                  className={`py-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    isBoarded 
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' 
                      : 'bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700'
                  }`}
                >
                  <Check size={16} />
                  <span>{t('supervisor.boardedAction')}</span>
                </button>

                <button
                  onClick={() => onUpdateStatus(std.id, 'absent')}
                  className={`py-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    isAbsent 
                      ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20' 
                      : 'bg-slate-100 text-slate-700 hover:bg-rose-50 hover:text-rose-700'
                  }`}
                >
                  <X size={16} />
                  <span>{t('supervisor.absentAction')}</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
