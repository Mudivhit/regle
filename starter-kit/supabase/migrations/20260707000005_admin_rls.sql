-- Admin RLS Policies for Profiles
CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
USING ( auth.jwt() -> 'app_metadata' ->> 'role' = 'admin' );

CREATE POLICY "Admins can update all profiles"
ON public.profiles FOR UPDATE
USING ( auth.jwt() -> 'app_metadata' ->> 'role' = 'admin' );

CREATE POLICY "Admins can delete profiles"
ON public.profiles FOR DELETE
USING ( auth.jwt() -> 'app_metadata' ->> 'role' = 'admin' );

-- Admin RLS Policies for User Roles
CREATE POLICY "Admins can view all roles"
ON public.user_roles FOR SELECT
USING ( auth.jwt() -> 'app_metadata' ->> 'role' = 'admin' );

CREATE POLICY "Admins can update all roles"
ON public.user_roles FOR UPDATE
USING ( auth.jwt() -> 'app_metadata' ->> 'role' = 'admin' );

-- Admin RLS Policies for User Activity
CREATE POLICY "Admins can view all activity"
ON public.user_activity FOR SELECT
USING ( auth.jwt() -> 'app_metadata' ->> 'role' = 'admin' );
