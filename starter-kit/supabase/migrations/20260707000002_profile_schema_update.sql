ALTER TABLE public.profiles 
  ADD COLUMN first_name text,
  ADD COLUMN last_name text,
  ADD COLUMN mobile_number text,
  ADD COLUMN bio text,
  DROP COLUMN full_name;

-- Update the handle_new_user trigger to support first_name and last_name
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, avatar_url)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
