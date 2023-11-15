truncate table auth.users cascade;
-- this will clear all users in Supabase, AND all data connected to them.
-- since all data WILL be connected to users, this clears Supabase data.