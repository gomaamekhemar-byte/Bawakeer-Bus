-- ==========================================================
-- نظام مدارس بواكير الأهلية - هيكلة قاعدة البيانات المتكاملة
-- Bawakeer School Bus Fleet & Student Management System
-- ==========================================================

-- 1. جدول الحافلات (Buses)
CREATE TABLE IF NOT EXISTS public.buses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bus_number TEXT NOT NULL UNIQUE,       -- رقم الباص (مثال: 12)
    plate_number TEXT NOT NULL,            -- لوحة الباص (مثال: أ ب ج 1234)
    capacity INTEGER NOT NULL DEFAULT 25,  -- السعة الاستيعابية
    route_name TEXT NOT NULL,              -- اسم المسار (مثال: مسار شمال الرياض)
    covered_districts TEXT NOT NULL,       -- الأحياء المشمولة
    status TEXT NOT NULL DEFAULT 'active', -- active, maintenance, inactive
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. جدول الطاقم والموظفين (Staff)
CREATE TABLE IF NOT EXISTS public.staff (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    national_id TEXT NOT NULL UNIQUE,      -- رقم الهوية الوطنية أو الإقامة
    full_name TEXT NOT NULL,               -- الاسم رباعي
    phone TEXT NOT NULL,                   -- رقم الجوال
    role TEXT NOT NULL,                    -- general_admin, school_supervisor, attendant, driver
    assigned_bus_id UUID REFERENCES public.buses(id) ON DELETE SET NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. جدول الطلاب (Students)
CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,               -- اسم الطالب رباعي
    grade_level TEXT NOT NULL,             -- المرحلة والصف (مثال: الرابع الابتدائي)
    assigned_bus_id UUID REFERENCES public.buses(id) ON DELETE SET NULL,
    dropoff_sequence INTEGER NOT NULL DEFAULT 1, -- الترتيب الجغرافي للنزول
    home_address TEXT NOT NULL,            -- العنوان والحي
    latitude DOUBLE PRECISION,             -- إحداثيات خط العرض
    longitude DOUBLE PRECISION,            -- إحداثيات خط الطول
    father_phone TEXT NOT NULL,            -- جوال الأب
    mother_phone TEXT,                     -- جوال الأم
    authorized_receiver_phone TEXT,        -- جوال المستلم المعتمد
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. جدول الرحلات (Trips)
CREATE TABLE IF NOT EXISTS public.trips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bus_id UUID NOT NULL REFERENCES public.buses(id) ON DELETE CASCADE,
    driver_id UUID REFERENCES public.staff(id) ON DELETE SET NULL,
    attendant_id UUID REFERENCES public.staff(id) ON DELETE SET NULL,
    trip_type TEXT NOT NULL,               -- morning, afternoon, external_service
    purpose TEXT DEFAULT 'نقل الطلاب اليومي',-- الغرض
    trip_date DATE DEFAULT CURRENT_DATE NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE,
    end_time TIMESTAMP WITH TIME ZONE,
    odometer_start DOUBLE PRECISION,       -- قراءة العداد عند البداية
    odometer_end DOUBLE PRECISION,         -- قراءة العداد عند النهاية
    total_distance DOUBLE PRECISION,       -- المسافة المقطوعة بالكيلومتر
    status TEXT NOT NULL DEFAULT 'scheduled', -- scheduled, in_progress, completed, cancelled
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. جدول سجل التحضير اللحظي (Attendance Logs)
CREATE TABLE IF NOT EXISTS public.attendance_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'pending', -- pending, boarded, delivered, absent
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    recorded_by_staff_id UUID REFERENCES public.staff(id) ON DELETE SET NULL,
    notes TEXT
);

-- 6. جدول التقويم الدراسي والإجازات (Academic Calendar)
CREATE TABLE IF NOT EXISTS public.academic_calendar (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    calendar_date DATE NOT NULL UNIQUE,
    day_type TEXT NOT NULL,                -- school_day, weekend, official_holiday
    description TEXT
);

-- 7. جدول تنبيهات الغياب المتتالي (Absence Alerts)
CREATE TABLE IF NOT EXISTS public.absence_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    bus_id UUID REFERENCES public.buses(id) ON DELETE SET NULL,
    consecutive_days INTEGER NOT NULL DEFAULT 3,
    alert_date DATE DEFAULT CURRENT_DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending_followup', -- pending_followup, resolved
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- تفعيل الأمان وسياسات الوصول العام (RLS)
ALTER TABLE public.buses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_calendar ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.absence_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read buses" ON public.buses FOR ALL USING (true);
CREATE POLICY "Allow public read staff" ON public.staff FOR ALL USING (true);
CREATE POLICY "Allow public read students" ON public.students FOR ALL USING (true);
CREATE POLICY "Allow public read trips" ON public.trips FOR ALL USING (true);
CREATE POLICY "Allow public read logs" ON public.attendance_logs FOR ALL USING (true);
CREATE POLICY "Allow public read calendar" ON public.academic_calendar FOR ALL USING (true);
CREATE POLICY "Allow public read alerts" ON public.absence_alerts FOR ALL USING (true);

-- تفعيل التحديث اللحظي في Supabase Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.trips, public.attendance_logs, public.absence_alerts;

-- ==========================================================
-- إضافة البيانات التجريبية الأولية لجميع الأدوار والمسارات
-- ==========================================================

-- حافلات تجريبية
INSERT INTO public.buses (id, bus_number, plate_number, capacity, route_name, covered_districts)
VALUES 
    ('a0000000-0000-0000-0000-000000000001', 'حافلة 12', 'أ ب د 1234', 25, 'مسار شمال الرياض', 'حي النرجس، حي الياسمين، حي العارض'),
    ('a0000000-0000-0000-0000-000000000002', 'حافلة 08', 'س ر ق 5678', 30, 'مسار غرب الرياض', 'حي الملقا، حي الصحافة، حي حطين')
ON CONFLICT (bus_number) DO NOTHING;

-- الطاقم الوظيفي بمختلف الأدوار
INSERT INTO public.staff (id, national_id, full_name, phone, role, assigned_bus_id)
VALUES 
    ('b0000000-0000-0000-0000-000000000001', '1000000001', 'أ. محمد السالم', '0501110001', 'general_admin', NULL),
    ('b0000000-0000-0000-0000-000000000002', '1000000002', 'أ. سارة المنصور', '0501110002', 'school_supervisor', NULL),
    ('b0000000-0000-0000-0000-000000000003', '1000000003', 'أم أحمد العتيبي', '0501110003', 'attendant', 'a0000000-0000-0000-0000-000000000001'),
    ('b0000000-0000-0000-0000-000000000004', '1000000004', 'الكابتن أحمد الشمري', '0501110004', 'driver', 'a0000000-0000-0000-0000-000000000001')
ON CONFLICT (national_id) DO NOTHING;

-- طلاب تجريبيون للحافلة رقم 12 بترتيب جغرافي للنزول
INSERT INTO public.students (id, full_name, grade_level, assigned_bus_id, dropoff_sequence, home_address, latitude, longitude, father_phone, mother_phone, authorized_receiver_phone)
VALUES 
    ('c0000000-0000-0000-0000-000000000001', 'عبدالرحمن خالد العتيبي', 'الرابع الابتدائي', 'a0000000-0000-0000-0000-000000000001', 1, 'حي النرجس - شارع 14 - فيلا 6', 24.8234, 46.6543, '0501112233', '0551112233', '0501112233'),
    ('c0000000-0000-0000-0000-000000000002', 'سارة محمد القحطاني', 'الثالث الابتدائي', 'a0000000-0000-0000-0000-000000000001', 2, 'حي الياسمين - شارع 22 - فيلا 18', 24.8150, 46.6420, '0554445566', '0544445566', '0554445566'),
    ('c0000000-0000-0000-0000-000000000003', 'فيصل فهد الشمري', 'الخامس الابتدائي', 'a0000000-0000-0000-0000-000000000001', 3, 'حي العارض - شارع 8 - مجمع النخيل', 24.8390, 46.6310, '0537778899', '0567778899', '0537778899'),
    ('c0000000-0000-0000-0000-000000000004', 'ريما عبدالله الدوسري', 'الثاني الابتدائي', 'a0000000-0000-0000-0000-000000000001', 4, 'حي الصحافة - شارع العليا - عمارة 5', 24.7920, 46.6280, '0560001122', '0570001122', '0560001122')
ON CONFLICT DO NOTHING;
