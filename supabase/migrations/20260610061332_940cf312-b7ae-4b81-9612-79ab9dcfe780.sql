-- Remove UPDATE access on orders from authenticated users
-- All order updates are done via server functions using supabaseAdmin (service_role)
REVOKE UPDATE ON public.orders FROM authenticated;

DROP POLICY IF EXISTS "Users can update own orders" ON public.orders;