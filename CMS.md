# Blog CMS setup (Payload + Neon)

## 1. Neon on Vercel

1. Open your Vercel project → **Storage** / **Marketplace** → install **Neon**.
2. Attach the database to this project so connection env vars are injected (`DATABASE_URL`, `POSTGRES_URL`, or similar).
3. Copy those values into a local `.env.local` (see `.env.example`).

## 2. Local env

```bash
cp .env.example .env.local
# set PAYLOAD_SECRET (openssl rand -hex 32)
# set DATABASE_URI to your Neon connection string
```

## 3. Run

```bash
npm run dev
```

- Admin: [http://localhost:3000/admin](http://localhost:3000/admin) — create the first user on first visit
- Blog index: [http://localhost:3000/blog](http://localhost:3000/blog)
- Create a **Post**, set slug, write content, **Publish**

## Notes

- Fonts: choose heading + body under **Globals → Site Settings** in `/admin`. Defaults are Boska + Switzer. The public site only loads the two selected Fontshare faces.
- Media uploads are stored under `/media` locally; for production on Vercel, add object storage (e.g. Vercel Blob) later so files persist across deploys
