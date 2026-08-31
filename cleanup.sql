-- ============================================
-- CLEANUP: Remove broken auto-triggers
-- Run this BEFORE applying the new schema if you
-- previously had the trigger-based version installed.
-- ============================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_partner_profile_created ON public.profiles;
DROP FUNCTION IF EXISTS public.handle_new_auth_user() CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_partner_profile() CASCADE;
