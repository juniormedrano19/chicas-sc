-- Run after 001_initial.sql in the Supabase SQL editor.
alter table public.contact_messages
  add column if not exists whatsapp text check (char_length(whatsapp) <= 24);

create function public.submit_contact(
  p_name text,
  p_email text,
  p_message text,
  p_whatsapp text
)
returns boolean language plpgsql security invoker set search_path='' as $$
begin
  perform pg_advisory_xact_lock(hashtextextended(lower(trim(p_email)), 0));
  if (
    select count(*)
    from public.contact_messages
    where email = lower(trim(p_email))
      and created_at > now() - interval '15 minutes'
  ) >= 3 then
    return false;
  end if;

  insert into public.contact_messages(name, email, message, whatsapp)
  values (trim(p_name), lower(trim(p_email)), trim(p_message), nullif(trim(p_whatsapp), ''));
  return true;
end;
$$;

revoke all on function public.submit_contact(text, text, text, text) from public, anon, authenticated;
grant execute on function public.submit_contact(text, text, text, text) to service_role;
