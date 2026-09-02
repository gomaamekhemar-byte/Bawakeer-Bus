export const translations = {
  ar: {
    // التطبيق العام
    appTitle: 'مدارس بواكير الأهلية',
    appSubtitle: 'نظام تتبع وإدارة حافلات الطلاب الذكي',
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
    print: 'طباعة الكشف',
    
    // الأدوار
    roles: {
      admin: 'المدير العام / الإدارة',
      general_admin: 'المدير العام / الإدارة',
      bus_supervisor: 'مشرف الحركة والنقل',
      school_supervisor: 'مشرفة المدرسة (بوابة التفويج)',
      supervisor: 'مشرفة المدرسة (بوابة التفويج)',
      driver: 'سائق الحافلة (الكابتن)',
      attendant: 'مرافقة الحافلة (العاملة)'
    },

    // القائمة الجانبية
    nav: {
      dashboard: 'لوحة القيادة والمؤشرات',
      fleet: 'متابعة حركة الأسطول',
      attendance: 'سجل التحضير والغياب',
      reports: 'التقارير وسجلات الرحلات',
      settings: 'إدارة الطاقم والأسطول',
      driverScreen: 'كابينة السائق المتقدمة',
      supervisorScreen: 'بوابة تفويج الطلاب'
    },

    // الإحصائيات
    stats: {
      totalBuses: 'إجمالي الحافلات',
      totalStudents: 'عدد الطلاب المسجلين',
      absentToday: 'الطلاب الغائبين اليوم',
      activeTrips: 'الرحلات النشطة حالياً',
      movingBuses: 'الحافلات في المسار',
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
      exportExcel: 'تصدير إلى Excel (.xlsx)',
      printReport: 'طباعة التقرير',
      exporting: 'جاري التصدير...',
      studentName: 'اسم الطالب',
      busNumber: 'رقم الحافلة المخصصة',
      grade: 'المرحلة / الصف',
      status: 'الحالة',
      time: 'وقت التسجيل',
      recordedBy: 'مُسجل الإجراء',
      filterAll: 'جميع الحالات',
      filterBoarded: 'ركب الحافلة',
      filterDelivered: 'نزل بأمان',
      filterAbsent: 'غائب',
      searchPlaceholder: 'بحث باسم الطالب أو الحافلة أو الصف...'
    },

    // الإعدادات وإدارة الأسطول
    settings: {
      title: 'إدارة الأسطول والكوادر والطلاب',
      tabBuses: 'الحافلات والمسارات',
      tabDrivers: 'السائقين والمشرفات',
      tabStudents: 'الطلاب وتوزيع الحافلات',
      addBus: 'إضافة حافلة جديدة',
      addStaff: 'إضافة موظف جديد',
      addStudent: 'إضافة طالب جديد',
      busNumber: 'رقم الحافلة',
      plateNumber: 'رقم اللوحة',
      capacity: 'السعة الاستيعابية',
      route: 'اسم المسار والأحياء المشمولة',
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

    // واجهة السائق المتقدمة
    driver: {
      title: 'كابينة السائق الذكية',
      preTripTitle: 'إعدادات تفويج الرحلة (قبل الانطلاق)',
      preTripSubtitle: 'يرجى اختيار الحافلة والمسار وتسجيل قراءة العداد للبدء',
      selectBusToDrive: 'اختر الحافلة التي ستقودها اليوم:',
      assignedDefault: 'الحافلة المعتادة المخصصة لك',
      selectTripType: 'اختر وجهة ونوع الرحلة:',
      morningTrip: 'رحلة صباحية (من المنازل للمدرسة)',
      afternoonTrip: 'رحلة العودة (من المدرسة للمنازل)',
      externalTrip: 'خدمات ورحلات خارجية / أنشطة',
      activeTripBanner: 'خط سير الرحلة الحالي:',
      currentRoute: 'المسار المحدد',
      coveredDistricts: 'الأحياء المشمولة',
      odometerStart: 'قراءة عداد البداية (كم)',
      odometerEnd: 'قراءة عداد النهاية (كم)',
      totalDistance: 'المسافة المقطوعة',
      nextStop: 'المحطة القادمة على المسار',
      remainingStudents: 'الطلاب المتبقون بالحافلة',
      googleMaps: 'توجيه المسار عبر Google Maps',
      deliveredAction: 'تم تسليم الطالب لولي أمره (نزل)',
      allDelivered: 'تم تسليم جميع طلاب المسار بأمان!',
      geoOrder: 'الترتيب الجغرافي للمسار (geo_order)',
      startTripBtn: 'تأكيد وبدء انطلاق الرحلة',
      endTripBtn: 'إنهاء الرحلة وتسجيل العداد النهائي'
    },

    // واجهة المشرفة
    supervisor: {
      title: 'بوابة تفويج وتوجيه الطلاب',
      subtitle: 'فرز الطلاب وتوجيههم للحافلة المخصصة مع التمييز اللوني',
      allBuses: 'جميع الحافلات (عرض شامل)',
      selectBus: 'تصفية حسب الحافلة:',
      boardedCount: 'الطلاب الراكبون:',
      approveAll: 'اعتماد صعود الحافلة بالكامل وانطلاقها',
      boardedAction: '✅ ركب الحافلة',
      absentAction: '❌ غائب / استلم من المدرسة',
      searchStudent: 'بحث سريع بالاسم أو الصف أو رقم الحافلة...',
      busBadgeLabel: 'مخصص لحافلة:',
      routeLabel: 'المسار:'
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
    print: 'Print Report',
    
    // Roles
    roles: {
      admin: 'General Manager / Admin',
      general_admin: 'General Manager / Admin',
      bus_supervisor: 'Fleet & Bus Supervisor',
      school_supervisor: 'School Gate Supervisor',
      supervisor: 'School Gate Supervisor',
      driver: 'Bus Driver (Captain)',
      attendant: 'Bus Attendant (Matron)'
    },

    // Navigation
    nav: {
      dashboard: 'Dashboard & Metrics',
      fleet: 'Fleet Tracking',
      attendance: 'Attendance Logs',
      reports: 'Reports & Export',
      settings: 'Fleet & Staff Management',
      driverScreen: 'Advanced Driver Cabin',
      supervisorScreen: 'Gate Boarding Portal'
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
      printReport: 'Print Report',
      exporting: 'Exporting...',
      studentName: 'Student Name',
      busNumber: 'Assigned Bus',
      grade: 'Grade',
      status: 'Status',
      time: 'Timestamp',
      recordedBy: 'Recorded By',
      filterAll: 'All Statuses',
      filterBoarded: 'Boarded',
      filterDelivered: 'Delivered',
      filterAbsent: 'Absent',
      searchPlaceholder: 'Search student, bus, or grade...'
    },

    // Settings
    settings: {
      title: 'Fleet, Staff & Student Management',
      tabBuses: 'Buses & Routes',
      tabDrivers: 'Drivers & Supervisors',
      tabStudents: 'Students & Bus Assignment',
      addBus: 'Add New Bus',
      addStaff: 'Add Staff Member',
      addStudent: 'Add Student',
      busNumber: 'Bus Number',
      plateNumber: 'Plate Number',
      capacity: 'Capacity',
      route: 'Route & Covered Districts',
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
      title: 'Smart Driver Cabin',
      preTripTitle: 'Pre-Trip Setup & Dispatch',
      preTripSubtitle: 'Please select the bus, destination, and log starting odometer to begin',
      selectBusToDrive: 'Select the bus you will drive today:',
      assignedDefault: 'Your assigned default bus',
      selectTripType: 'Select Trip Destination & Type:',
      morningTrip: 'Morning Trip (To School)',
      afternoonTrip: 'Afternoon Return (To Homes)',
      externalTrip: 'External Services & Field Trips',
      activeTripBanner: 'Active Route & Itinerary:',
      currentRoute: 'Assigned Route',
      coveredDistricts: 'Covered Districts',
      odometerStart: 'Start Odometer (km)',
      odometerEnd: 'End Odometer (km)',
      totalDistance: 'Distance Traveled',
      nextStop: 'Next Stop on Route',
      remainingStudents: 'Students Remaining on Bus',
      googleMaps: 'Navigate with Google Maps',
      deliveredAction: 'Student Delivered (Drop Off)',
      allDelivered: 'All students safely delivered!',
      geoOrder: 'Geographical Route Order (geo_order)',
      startTripBtn: 'Confirm & Start Trip',
      endTripBtn: 'End Trip & Log Odometer'
    },

    // Supervisor View
    supervisor: {
      title: 'Student Boarding & Gate Sorting',
      subtitle: 'Sort students and guide them to their assigned buses with visual badges',
      allBuses: 'All Buses (Overview)',
      selectBus: 'Filter by Bus:',
      boardedCount: 'Boarded Students:',
      approveAll: 'Approve Complete Bus Boarding & Departure',
      boardedAction: '✅ Boarded Bus',
      absentAction: '❌ Absent / Picked Up at School',
      searchStudent: 'Quick search by name, grade, or bus number...',
      busBadgeLabel: 'Assigned Bus:',
      routeLabel: 'Route:'
    }
  }
};
