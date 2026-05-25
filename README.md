# Badrane International School

## Structure

```
bist/
├── src/       # School website (React + Vite)
└── admin/     # Admin dashboard (React + Vite)
```

## Development

**School website** (port 5173):
```bash
npm run dev
```

**Admin panel** (port 5174):
```bash
cd admin && npm run dev
```

## Environment variables

Both apps require a `.env` file:
```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

## Admin credentials

- Email: `contact@bist.ma`
- Password: set in Supabase Auth dashboard

## Deployment

Deployed as a single Vercel project. The build command compiles both apps:
- School website → `dist/`
- Admin panel → `dist/admin-panel/`

Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Vercel environment variables.
