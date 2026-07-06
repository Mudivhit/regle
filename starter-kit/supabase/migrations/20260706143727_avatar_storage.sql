-- Create "avatars" bucket
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true);

-- Policy to allow public viewing
create policy "Avatar images are publicly accessible."
  on storage.objects for select
  using ( bucket_id = 'avatars' );

-- Policy to allow authenticated users to insert their own avatar
create policy "Users can upload their own avatar."
  on storage.objects for insert
  to authenticated
  with check ( bucket_id = 'avatars' and auth.uid() = owner );

-- Policy to allow authenticated users to update their own avatar
create policy "Users can update their own avatar."
  on storage.objects for update
  to authenticated
  using ( bucket_id = 'avatars' and auth.uid() = owner )
  with check ( bucket_id = 'avatars' and auth.uid() = owner );

-- Policy to allow authenticated users to delete their own avatar
create policy "Users can delete their own avatar."
  on storage.objects for delete
  to authenticated
  using ( bucket_id = 'avatars' and auth.uid() = owner );
