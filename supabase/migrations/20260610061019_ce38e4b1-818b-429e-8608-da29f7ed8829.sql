-- Orders: add missing grants and policies
GRANT INSERT, UPDATE ON public.orders TO authenticated;

DROP POLICY IF EXISTS "Users can insert own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can update own orders" ON public.orders;

CREATE POLICY "Users can insert own orders" ON public.orders FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own orders" ON public.orders FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Order items: add missing grants and policies
GRANT INSERT, UPDATE, DELETE ON public.order_items TO authenticated;

DROP POLICY IF EXISTS "Users can insert own order items" ON public.order_items;
DROP POLICY IF EXISTS "Users can update own order items" ON public.order_items;
DROP POLICY IF EXISTS "Users can delete own order items" ON public.order_items;

CREATE POLICY "Users can insert own order items" ON public.order_items FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_items.order_id AND o.user_id = auth.uid()));
CREATE POLICY "Users can update own order items" ON public.order_items FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_items.order_id AND o.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_items.order_id AND o.user_id = auth.uid()));
CREATE POLICY "Users can delete own order items" ON public.order_items FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_items.order_id AND o.user_id = auth.uid()));

-- Sellers: restrict INSERT so users can only register as unverified individuals
DROP POLICY IF EXISTS "Users can create own seller profile" ON public.sellers;
DROP POLICY IF EXISTS "Users can update own seller profile" ON public.sellers;

CREATE POLICY "Users can create own seller profile as individual" ON public.sellers FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id AND type = 'individual' AND verified = false);

CREATE POLICY "Users can update own seller profile name" ON public.sellers FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id AND type = 'individual' AND verified = false);