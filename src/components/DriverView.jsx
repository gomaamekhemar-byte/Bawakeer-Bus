import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  Navigation, Gauge, MapPin, Map, CheckCircle2, Phone, 
  MessageSquare, CircleDot, AlertCircle, CheckCircle 
} from 'lucide-react';

export default function DriverView({ 
  trip, students, onStartTrip, onEndTrip, onDeliverStudent 
}) {
  const { t } = useLanguage();
  
  // نوافذ المودال لإدخال العداد
  const [showStartModal, setShowStartModal] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);
  const [odometerInput, setOdometerInput] = useState('');
  const [tripTypeInput, setTripTypeInput] = useState('afternoon');

  // ترتيب الطلاب جغرافياً حسب geo_order والذين هم في الحافلة حالياً
  const onboardStudents = students
    .filter(s => s.status === 'boarded')
    .sort((a, b) => a.sequence - b.sequence);

  const nextStudent = onboardStudents[0];

  const handleStartSubmit = (e) => {
    e.preventDefault();
    const odo = parseFloat(odometerInput);
    if (!odo || odo <= 0) return alert('أدخل قراءة عداد صحيحة');
    onStartTrip(odo, tripTypeInput);
    setShowStartModal(false);
    setOdometerInput('');
  };

  const handleEndSubmit = (e) => {
    e.preventDefault();
    const odo = parseFloat(odometerInput);
    if (!odo || odo < (trip.startOdometer || 0)) {
      return alert(`يجب أن تكون القراءة أكبر من قراءة البداية (${trip.startOdometer})`);
    }
    onEndTrip(odo);
    setShowEndModal(false);
    setOdometerInput('');
  };

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      
      {/* بطاقة حالة الرحلة والعداد */}
      <div className="bg-slate-900 text-white rounded-3xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full font-bold">
              {trip.busNumber || 'حافلة 12'} • {trip.driverName || 'الكابتن أحمد'}
            </span>
            {trip.isActive && (
              <span className="text-xs bg-emerald-500 text-slate-950 font-bold px-2.5 py-0.5 rounded-full animate-pulse">
                الرحلة جارية 🟢
              </span>
            )}
          </div>
          <span className="text-xs text-slate-400">{trip.startTime || '12:45 م'}</span>
        </div>

        <div>
          <h2 className="text-lg font-bold">{trip.typeName || t('driver.afternoonTrip')}</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {t('driver.odometerStart')}: <strong className="text-white font-mono">{trip.startOdometer || 54200} كم</strong>
          </p>
        </div>

        {/* أزرار التحكم بالرحلة والعداد */}
        <div className="pt-2 border-t border-slate-800">
          {trip.isActive ? (
            <button
              onClick={() => { setOdometerInput(''); setShowEndModal(true); }}
              className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 rounded-2xl text-xs shadow-lg shadow-rose-600/30 transition-all flex items-center justify-center gap-2"
            >
              <Gauge size={16} />
              <span>{t('driver.endTrip')}</span>
            </button>
          ) : (
            <button
              onClick={() => { setOdometerInput(''); setShowStartModal(true); }}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-2xl text-xs shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
            >
              <Navigation size={16} />
              <span>{t('driver.startTrip')}</span>
            </button>
          )}
        </div>
      </div>

      {/* بطاقة المحطة القادمة على المسار (Spotlight Destination) */}
      {nextStudent && trip.isActive ? (
        <div className="bg-white rounded-3xl p-5 border-2 border-emerald-500 shadow-lg space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-bold flex items-center gap-1.5">
              <CircleDot size={14} className="text-emerald-600 animate-ping" />
              <span>{t('driver.nextStop')} (#{nextStudent.sequence})</span>
            </span>
            <span className="text-slate-400 font-bold">
              {t('driver.remainingStudents')}: {onboardStudents.length}
            </span>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <h3 className="text-xl font-black text-slate-800">{nextStudent.name}</h3>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <MapPin size={14} className="text-slate-400 flex-shrink-0" />
              <span>{nextStudent.address}</span>
            </p>
            <p className="text-xs text-slate-700 font-bold mt-1">المستلم: {nextStudent.receiver}</p>
          </div>

          {/* زر توجيه الخرائط وزر التسليم */}
          <div className="space-y-2">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${nextStudent.lat},${nextStudent.lng}`}
              target="_blank"
              rel="noreferrer"
              className="w-full bg-slate-900 hover:bg-black text-white py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <Map size={16} />
              <span>{t('driver.googleMaps')}</span>
            </a>

            <button
              onClick={() => onDeliverStudent(nextStudent.id)}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-2xl font-black text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle size={18} />
              <span>{t('driver.deliveredAction')}</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 text-center space-y-2">
          <CheckCircle2 size={36} className="text-emerald-600 mx-auto" />
          <h3 className="font-bold text-slate-800 text-sm">{t('driver.allDelivered')}</h3>
          {!trip.isActive && trip.totalDistance && (
            <p className="text-xs text-slate-600">
              {t('driver.totalDistance')}: <strong className="text-emerald-700 font-black">{trip.totalDistance} كم</strong>
            </p>
          )}
        </div>
      )}

      {/* قائمة ترتيب الطلاب في المسار (geo_order) */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
        <h3 className="text-xs font-bold text-slate-500">{t('driver.geoOrder')} (المسار الجغرافي):</h3>

        <div className="space-y-2">
          {students.map(std => {
            const isBoarded = std.status === 'boarded';
            const isDelivered = std.status === 'delivered';
            const isAbsent = std.status === 'absent';

            return (
              <div 
                key={std.id}
                className={`p-3 rounded-2xl border flex items-center justify-between text-xs transition-colors ${
                  isDelivered ? 'bg-slate-50 border-slate-100 text-slate-400 line-through' :
                  isBoarded ? 'bg-white border-emerald-200 font-bold' :
                  'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center text-[11px] font-bold">
                    #{std.sequence}
                  </span>
                  <div>
                    <p className="font-bold text-slate-800">{std.name}</p>
                    <p className="text-[11px] text-slate-400 font-normal">{std.address}</p>
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                  isDelivered ? 'bg-blue-100 text-blue-800' :
                  isBoarded ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}>
                  {isDelivered ? 'نزل ✅' : isBoarded ? 'في الباص 🚌' : 'غائب 🔴'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================= */}
      {/* مودال بدء الرحلة للعداد                                   */}
      {/* ========================================================= */}
      {showStartModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4" dir="rtl">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Navigation className="text-emerald-600" size={18} />
              <span>{t('driver.startTrip')}</span>
            </h3>

            <form onSubmit={handleStartSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">{t('driver.tripType')}:</label>
                <select
                  value={tripTypeInput}
                  onChange={e => setTripTypeInput(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                >
                  <option value="morning">{t('driver.morningTrip')}</option>
                  <option value="afternoon">{t('driver.afternoonTrip')}</option>
                  <option value="external_service">{t('driver.externalTrip')}</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">{t('driver.odometerStart')}:</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  placeholder="مثال: 54200"
                  value={odometerInput}
                  onChange={e => setOdometerInput(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-sm"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 bg-emerald-600 text-white font-bold py-2.5 rounded-xl">
                  تأكيد والبدء
                </button>
                <button type="button" onClick={() => setShowStartModal(false)} className="px-4 bg-slate-100 text-slate-600 rounded-xl">
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* مودال إنهاء الرحلة والعداد النهائي                         */}
      {/* ========================================================= */}
      {showEndModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4" dir="rtl">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Gauge className="text-rose-600" size={18} />
              <span>{t('driver.endTrip')}</span>
            </h3>

            <form onSubmit={handleEndSubmit} className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl text-slate-600">
                قراءة البداية: <strong>{trip.startOdometer} كم</strong>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">{t('driver.odometerEnd')}:</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  placeholder={`أكبر من ${trip.startOdometer}`}
                  value={odometerInput}
                  onChange={e => setOdometerInput(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-sm"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 bg-rose-600 text-white font-bold py-2.5 rounded-xl">
                  حساب المسافة وإنهاء
                </button>
                <button type="button" onClick={() => setShowEndModal(false)} className="px-4 bg-slate-100 text-slate-600 rounded-xl">
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
