import * as XLSX from 'xlsx';

/**
 * تصدير جدول سجلات التحضير إلى ملف Excel حقيقي (.xlsx)
 * @param {Array} data - مصفوفة البيانات المراد تصديرها
 * @param {string} fileName - اسم الملف الناتج
 * @param {boolean} isRTL - هل الاتجاه عربي لتفعيل RTL في إكسيل
 */
export function exportAttendanceToExcel(data, fileName = 'سجل_تحضير_حافلات_بواكير', isRTL = true) {
  try {
    // تجهيز الصفوف بتسميات الأعمدة المناسبة
    const formattedData = data.map((item, index) => ({
      '#': index + 1,
      'اسم الطالب': item.studentName || item.student_name,
      'المرحلة / الصف': item.grade || item.grade_level,
      'الحافلة': item.busNumber || item.bus_number,
      'الحالة': item.status === 'boarded' ? 'ركب الحافلة' : 
               item.status === 'delivered' ? 'نزل وسُلّم بأمان' : 
               item.status === 'absent' ? 'غائب' : 'في الانتظار',
      'وقت التسجيل': item.time || new Date(item.timestamp || Date.now()).toLocaleTimeString('ar-SA'),
      'التاريخ': item.date || new Date().toLocaleDateString('ar-SA'),
      'مُسجل الإجراء': item.recordedBy || 'مشرفة البوابة',
      'جوال الأب': item.fatherPhone || '-',
      'جوال الأم': item.motherPhone || '-'
    }));

    // إنشاء ورقة العمل والمصنف
    const worksheet = XLSX.utils.json_to_sheet(formattedData);

    // ضبط اتجاه الورقة من اليمين لليسار إذا كانت عربية
    if (isRTL) {
      if (!worksheet['!views']) worksheet['!views'] = [];
      worksheet['!views'].push({ RTL: true });
    }

    // ضبط عرض الأعمدة تلقائياً لسهولة القراءة
    const colWidths = [
      { wch: 5 },  // #
      { wch: 26 }, // اسم الطالب
      { wch: 20 }, // المرحلة
      { wch: 14 }, // الحافلة
      { wch: 18 }, // الحالة
      { wch: 14 }, // الوقت
      { wch: 14 }, // التاريخ
      { wch: 20 }, // المسجل
      { wch: 16 }, // جوال الأب
      { wch: 16 }  // جوال الأم
    ];
    worksheet['!cols'] = colWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'سجل التحضير اليومي');

    // تحميل الملف
    XLSX.writeFile(workbook, `${fileName}_${new Date().toISOString().slice(0, 10)}.xlsx`);
    return true;
  } catch (err) {
    console.error('Failed to export to Excel:', err);
    return false;
  }
}
