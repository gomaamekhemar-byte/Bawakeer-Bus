import { createClient } from '@supabase/supabase-js';

// جلب الإعدادات إما من التخزين المحلي أو من ملف .env
export function getSupabaseCredentials() {
  const savedUrl = localStorage.getItem('supabase_url');
  const savedKey = localStorage.getItem('supabase_anon_key');

  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  const url = savedUrl || (envUrl && !envUrl.includes('your-project') ? envUrl : '');
  const key = savedKey || (envKey && !envKey.includes('your-anon-key') ? envKey : '');

  return { url, key, isConfigured: Boolean(url && key) };
}

export function saveSupabaseCredentials(url, key) {
  if (url && key) {
    localStorage.setItem('supabase_url', url.trim());
    localStorage.setItem('supabase_anon_key', key.trim());
    // إعادة إنشاء العميل
    initSupabaseClient(url.trim(), key.trim());
  }
}

export function clearSupabaseCredentials() {
  localStorage.removeItem('supabase_url');
  localStorage.removeItem('supabase_anon_key');
}

let currentClient = null;

export function initSupabaseClient(customUrl, customKey) {
  const { url, key } = getSupabaseCredentials();
  const activeUrl = customUrl || url || 'https://placeholder.supabase.co';
  const activeKey = customKey || key || 'placeholder-key';

  try {
    currentClient = createClient(activeUrl, activeKey, {
      auth: { persistSession: true, autoRefreshToken: true }
    });
  } catch (err) {
    console.error('Failed to init Supabase client:', err);
  }
  return currentClient;
}

// تهيئة العميل عند بدء التطبيق
initSupabaseClient();

export const supabase = new Proxy({}, {
  get(target, prop) {
    if (!currentClient) {
      initSupabaseClient();
    }
    const val = currentClient ? currentClient[prop] : undefined;
    if (typeof val === 'function') {
      return val.bind(currentClient);
    }
    return val;
  }
});

// اختبار الاتصال بـ Supabase
export async function testConnection(customUrl, customKey) {
  try {
    const client = createClient(
      customUrl || getSupabaseCredentials().url,
      customKey || getSupabaseCredentials().key
    );
    const { data, error } = await client.from('staff').select('count', { count: 'exact', head: true });
    if (error) {
      if (error.code === '42P01') {
        return { success: false, error: 'تم الاتصال بـ Supabase بنجاح، ولكن جدول (staff) غير موجود بعد. يرجى إنشاء الجدول من SQL Editor.' };
      }
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message || 'فشل الاتصال بعنوان Supabase' };
  }
}
