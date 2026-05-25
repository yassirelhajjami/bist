# Badrane International School — Tanger

Official website and administration panel for **Badrane International School**, Tanger, Morocco.

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

## Deployment

Deployed as a single Vercel project.
- School website → `dist/`
- Admin panel → `dist/admin-panel/`
