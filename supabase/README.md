# Supabase account foundation

The schema in `schema.sql` is ready for DeutschScanner accounts. It creates:

- one profile per authenticated user;
- durable saved destinations;
- one visited record per destination, including visit date and optional notes;
- row-level security so users can only read or change their own records;
- a trigger that creates the profile automatically after sign-up.

The web app activates its account UI whenever both public Supabase environment variables are present. Signed-out visitors can save favorites locally; those favorites sync into their account after sign-in.

After changing this schema, paste the complete `schema.sql` file into Supabase → SQL Editor and run it. The script is idempotent, so it is safe to run again when policies change.

For Vercel, add both variables to Production and Preview, then redeploy:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

Authentication redirects should allow both `https://deutschscanner.vercel.app/**` and `http://localhost:3000/**`.

Required public environment variables are documented in the repository's `.env.example`. Never commit `.env.local`, a service-role key, or any private database password.
