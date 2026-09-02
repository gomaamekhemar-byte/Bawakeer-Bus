-- إنشاء جدول الكادر المدرسي وسائقي الحافلات (staff)
CREATE TABLE IF NOT EXISTS public.staff (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    national_id TEXT NOT NULL UNIQUE,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'سائق حافلة' -- مثال: 'سائق حافلة', 'مشرف نقل', 'مسؤول حركة'
);

-- تفعيل ميزة الأمان على مستوى الصف (RLS)
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;

-- السماح بالقراءة لأي شخص مسجل أو عبر Anon Key للتحقق من تسجيل الدخول
CREATE POLICY "Allow public read staff" ON public.staff
    FOR SELECT
    USING (true);

-- إضافة بيانات تجريبية
INSERT INTO public.staff (name, national_id, phone, role)
VALUES 
    ('أحمد محمد الشمري', '1010101010', '0501234567', 'سائق حافلة'),
    ('خالد عبد الله القحطاني', '1020202020', '0559876543', 'مشرف نقل مدرسي'),
    ('سعد إبراهيم الدوسري', '1030303030', '0543210987', 'مسؤول حركة الحافلات')
ON CONFLICT (national_id) DO NOTHING;
