-- Orders: authenticated users don't need INSERT (server functions use supabaseAdmin)
REVOKE INSERT ON public.orders FROM authenticated;

DROP POLICY IF EXISTS "Users can insert own orders" ON public.orders;

-- Sellers: remove UPDATE access entirely since there's no profile-edit UI
-- and the UPDATE policy was allowing privilege escalation (rating manipulation)
REVOKE UPDATE ON public.sellers FROM authenticated;

DROP POLICY IF EXISTS "Users can update own seller profile name" ON public.sellers;