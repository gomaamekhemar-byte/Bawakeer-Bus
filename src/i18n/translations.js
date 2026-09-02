export const translations = {
  ar: {
    // التطبيق العام
    appTitle: 'مدارس بواكير الأهلية',
    appSubtitle: 'نظام إدارة وتتبع حركة الحافلات المدرسية',
    login: 'تسجيل الدخول',
    logout: 'تسجيل الخروج',
    usernameOrId: 'اسم المستخدم أو رقم الهوية',
    password: 'كلمة المرور',
    loginAction: 'دخول النظام',
    loginLoading: 'جاري التحقق من البيانات...',
    loginError: 'رقم الهوية أو كلمة المرور غير صحيحة',
    langToggle: 'English',
    language: 'اللغة',
    connected: 'متصل بالقاعدة',
    demoMode: 'وضع المعاينة',
    dbSettings: 'إعدادات قاعدة البيانات',
    
    // الأدوار
    roles: {
      admin: 'المشرف العام / الإدارة',
      general_admin: 'المشرف العام / الإدارة',
      school_supervisor: 'مشرفة المدرسة',
      supervisor: 'مشرفة المدرسة',
      driver: 'سائق الحافلة',
      attendant: 'مرافقة الحافلة'
    },

    // القائمة الجانبية
    nav: {
      dashboard: 'لوحة التحكم',
      fleet: 'متابعة الأسطول',
      attendance: 'سجل التحضير والغياب',
      reports: 'التقارير والتصدير',
      settings: 'إدارة الطاقم والطلاب',
      driverScreen: 'كابينة السائق',
      supervisorScreen: 'بوابة التفويج'
    },

    // الإحصائيات
    stats: {
      totalBuses: 'إجمالي الحافلات',
      totalStudents: 'عدد الطلاب المسجلين',
      absentToday: 'الطلاب الغائبين اليوم',
      activeTrips: 'الرحلات الجارية الآن',
      movingBuses: 'الحافلات المتحركة',
      deliveredStudents: 'تم تسليمهم للمنازل',
      boardedStudents: 'في الحافلات الآن'
    },

    // التنبيهات الذكية
    alerts: {
      title: 'نظام التنبيهات الذكي للانقطاع (3 أيام متتالية)',
      subtitle: 'يتم استبعاد العطلات الأسبوعية والإجازات الرسمية آلياً',
      fatherCall: 'اتصال بالأب',
      motherCall: 'اتصال بالأم',
      whatsapp: 'مراسلة واتساب',
      resolved: 'تمت المتابعة',
      noAlerts: 'لا توجد تنبيهات غياب حرجة حالياً'
    },

    // التقارير والتصدير
    reports: {
      title: 'سجلات التحضير اليومية والتقارير',
      subtitle: 'كشف حضور وغياب الطلاب وتتبع الحافلات',
      exportExcel: 'تصدير الكشف إلى Excel',
      exporting: 'جاري التصدير...',
      studentName: 'اسم الطالب',
      busNumber: 'رقم الحافلة',
      grade: 'المرحلة / الصف',
      status: 'الحالة',
      time: 'وقت التسجيل',
      recordedBy: 'مُسجل الحالة',
      filterAll: 'جميع الحالات',
      filterBoarded: 'ركب الحافلة',
      filterDelivered: 'نزل بأمان',
      filterAbsent: 'غائب',
      searchPlaceholder: 'بحث باسم الطالب أو الحافلة...'
    },

    // الإعدادات وإدارة الأسطول
    settings: {
      title: 'إدارة الأسطول والكوادر والطلاب',
      tabBuses: 'الحافلات',
      tabDrivers: 'السائقين والمشرفات',
      tabStudents: 'الطلاب وتوزيع المسارات',
      addBus: 'إضافة حافلة جديدة',
      addStaff: 'إضافة موظف جديد',
      addStudent: 'إضافة طالب جديد',
      busNumber: 'رقم الحافلة',
      plateNumber: 'رقم اللوحة',
      capacity: 'السعة',
      route: 'المسار والأحياء',
      actions: 'الإجراءات',
      name: 'الاسم الكامل',
      nationalId: 'رقم الهوية',
      phone: 'رقم الجوال',
      role: 'الدور الوظيفي',
      assignedBus: 'الحافلة المخصصة',
      fatherPhone: 'جوال الأب',
      motherPhone: 'جوال الأم',
      sequence: 'تسلسل النزول (geo_order)',
      save: 'حفظ البيانات',
      cancel: 'إلغاء',
      delete: 'حذف',
      edit: 'تعديل'
    },

    // واجهة السائق
    driver: {
      title: 'كابينة قيادة الحافلة',
      activeTrip: 'الرحلة النشطة',
      noActiveTrip: 'لا توجد رحلة جارية حالياً',
      startTrip: 'بدء رحلة جديدة',
      endTrip: 'إنهاء الرحلة وتسجيل العداد',
      tripType: 'نوع الرحلة',
      morningTrip: 'رحلة صباحية (للمدرسة)',
      afternoonTrip: 'رحلة العودة (للمنازل)',
      externalTrip: 'خدمات ورحلات خارجية',
      odometerStart: 'قراءة عداد البداية (كم)',
      odometerEnd: 'قراءة عداد النهاية (كم)',
      totalDistance: 'المسافة المقطوعة',
      nextStop: 'المحطة القادمة على المسار',
      remainingStudents: 'الطلاب المتبقون بالحافلة',
      googleMaps: 'توجيه المسار عبر خرائط Google',
      deliveredAction: 'تم تسليم الطالب (نزل)',
      allDelivered: 'تم تسليم جميع طلاب المسار بأمان!',
      geoOrder: 'الترتيب الجغرافي للنزول'
    },

    // واجهة المشرفة
    supervisor: {
      title: 'بوابة تفويج الطلاب - المشرفة',
      selectBus: 'اختر الحافلة:',
      boardedCount: 'الطلاب الراكبون:',
      approveAll: 'اعتماد صعود الحافلة بالكامل',
      boardedAction: 'حضر / ركب',
      absentAction: 'غائب',
      searchStudent: 'بحث عن طالب في الحافلة...'
    }
  },

  en: {
    // General
    appTitle: 'Bawakeer Schools',
    appSubtitle: 'Smart School Bus Fleet & Student Tracking System',
    login: 'Sign In',
    logout: 'Sign Out',
    usernameOrId: 'Username or National ID',
    password: 'Password',
    loginAction: 'Sign In',
    loginLoading: 'Authenticating...',
    loginError: 'Invalid ID or password',
    langToggle: 'عربي',
    language: 'Language',
    connected: 'DB Connected',
    demoMode: 'Demo Mode',
    dbSettings: 'Database Settings',
    
    // Roles
    roles: {
      admin: 'General Admin',
      general_admin: 'General Admin',
      school_supervisor: 'School Supervisor',
      supervisor: 'School Supervisor',
      driver: 'Bus Driver',
      attendant: 'Bus Attendant'
    },

    // Navigation
    nav: {
      dashboard: 'Dashboard',
      fleet: 'Fleet Tracking',
      attendance: 'Attendance Logs',
      reports: 'Reports & Export',
      settings: 'Staff & Students',
      driverScreen: 'Driver Cabin',
      supervisorScreen: 'Gate Supervisor'
    },

    // Statistics
    stats: {
      totalBuses: 'Total Buses',
      totalStudents: 'Enrolled Students',
      absentToday: 'Absent Today',
      activeTrips: 'Active Trips',
      movingBuses: 'Moving Buses',
      deliveredStudents: 'Delivered Home',
      boardedStudents: 'On Board Now'
    },

    // Smart Alerts
    alerts: {
      title: 'Smart Consecutive Absence Alerts (3 Days)',
      subtitle: 'Weekends and official holidays are automatically excluded',
      fatherCall: 'Call Father',
      motherCall: 'Call Mother',
      whatsapp: 'WhatsApp',
      resolved: 'Mark Followed Up',
      noAlerts: 'No critical absence alerts at this time'
    },

    // Reports & Export
    reports: {
      title: 'Daily Attendance Logs & Reports',
      subtitle: 'Student boarding status and bus fleet audit',
      exportExcel: 'Export to Excel (.xlsx)',
      exporting: 'Exporting...',
      studentName: 'Student Name',
      busNumber: 'Bus Number',
      grade: 'Grade',
      status: 'Status',
      time: 'Timestamp',
      recordedBy: 'Recorded By',
      filterAll: 'All Statuses',
      filterBoarded: 'Boarded',
      filterDelivered: 'Delivered',
      filterAbsent: 'Absent',
      searchPlaceholder: 'Search student or bus...'
    },

    // Settings
    settings: {
      title: 'Fleet, Staff & Student Management',
      tabBuses: 'Buses',
      tabDrivers: 'Drivers & Supervisors',
      tabStudents: 'Students & Route Assignment',
      addBus: 'Add New Bus',
      addStaff: 'Add Staff Member',
      addStudent: 'Add Student',
      busNumber: 'Bus Number',
      plateNumber: 'Plate Number',
      capacity: 'Capacity',
      route: 'Route & Districts',
      actions: 'Actions',
      name: 'Full Name',
      nationalId: 'National ID',
      phone: 'Phone Number',
      role: 'Role',
      assignedBus: 'Assigned Bus',
      fatherPhone: 'Father Phone',
      motherPhone: 'Mother Phone',
      sequence: 'Dropoff Order (geo_order)',
      save: 'Save Details',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit'
    },

    // Driver View
    driver: {
      title: 'Driver Cabin Dashboard',
      activeTrip: 'Active Trip',
      noActiveTrip: 'No active trip at the moment',
      startTrip: 'Start New Trip',
      endTrip: 'End Trip & Log Odometer',
      tripType: 'Trip Type',
      morningTrip: 'Morning Trip (To School)',
      afternoonTrip: 'Afternoon Return (To Home)',
      externalTrip: 'External / Field Trip',
      odometerStart: 'Start Odometer (km)',
      odometerEnd: 'End Odometer (km)',
      totalDistance: 'Distance Traveled',
      nextStop: 'Next Stop on Route',
      remainingStudents: 'Students Remaining on Bus',
      googleMaps: 'Navigate via Google Maps',
      deliveredAction: 'Delivered (Drop Off)',
      allDelivered: 'All students safely delivered!',
      geoOrder: 'Geographical Drop-off Order'
    },

    // Supervisor View
    supervisor: {
      title: 'Gate Departure Supervisor',
      selectBus: 'Select Bus:',
      boardedCount: 'Boarded Students:',
      approveAll: 'Approve Complete Bus Boarding',
      boardedAction: 'Boarded / Present',
      absentAction: 'Absent',
      searchStudent: 'Search student in bus...'
    }
  }
};
