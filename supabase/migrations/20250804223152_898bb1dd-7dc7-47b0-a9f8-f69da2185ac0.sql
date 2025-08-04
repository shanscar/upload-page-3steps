-- 修復函數搜索路徑安全問題
ALTER FUNCTION public.update_updated_at_column() SET search_path = public;