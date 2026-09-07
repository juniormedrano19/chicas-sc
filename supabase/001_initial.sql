-- Execute once in the Supabase SQL editor. Keep service_role server-only.
create table public.matches (
 id uuid primary key default gen_random_uuid(),
 opponent text not null,
 played_at timestamptz not null,
 home boolean not null default true,
 goals_for integer not null check (goals_for >= 0),
 goals_against integer not null check (goals_against >= 0),
 competition text not null,
 published boolean not null default false
);
create index matches_latest on public.matches (played_at desc) where published;
alter table public.matches enable row level security;
create policy "Published results are readable" on public.matches for select to anon, authenticated using (published);
create table public.contact_messages (
 id uuid primary key default gen_random_uuid(),
 name text not null check (char_length(name) between 2 and 80),
 email text not null check (char_length(email) <= 254),
 message text not null check (char_length(message) between 10 and 2000),
 consent_at timestamptz not null default now(),
 created_at timestamptz not null default now()
);
alter table public.contact_messages enable row level security;
-- No public select or write policy: only the server service role can access messages.
revoke all on public.contact_messages from anon, authenticated;
create index contact_email_created on public.contact_messages (email, created_at desc);
create function public.submit_contact(p_name text,p_email text,p_message text)
returns boolean language plpgsql security invoker set search_path='' as $$
begin
 perform pg_advisory_xact_lock(hashtextextended(lower(trim(p_email)),0));
 if (select count(*) from public.contact_messages where email=lower(trim(p_email)) and created_at > now()-interval '15 minutes') >= 3 then return false; end if;
 insert into public.contact_messages(name,email,message) values(trim(p_name),lower(trim(p_email)),trim(p_message));
 return true;
end;
$$;
revoke all on function public.submit_contact(text,text,text) from public, anon, authenticated;
grant execute on function public.submit_contact(text,text,text) to service_role;
