# Supabase account foundation

The schema in `schema.sql` is ready for DeutschScanner accounts. It creates:

- one profile per authenticated user;
- durable saved destinations;
- one visited record per destination, including visit date and optional notes;
- row-level security so users can only read or change their own records;
- a trigger that creates the profile automatically after sign-up.

The web app intentionally does not activate account UI until the Supabase project exists and its public environment variables are configured. This avoids shipping a profile that only appears to save data.

Required public environment variables are documented in the repository's `.env.example`. Never commit `.env.local`, a service-role key, or any private database password.
