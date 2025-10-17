
ROLONET SIGNALS — Full package (Frontend + Proxy) for Vercel deployment
=====================================================================

This archive contains a ready-to-deploy frontend and a small Node.js proxy
that fetches FX rates from exchangerate.host with Twelve Data as fallback.

Structure:
- frontend/    --> Vite + React app
- server/      --> Express proxy (exposes /api/rates?pair=EURUSD)
- vercel.json  --> config for easy deploy to Vercel

How to deploy on Vercel (quick):
1. Create a free Vercel account at https://vercel.com
2. On Vercel dashboard -> 'New Project' -> 'Import' -> 'Import from ZIP' and upload this ZIP.
3. Vercel will auto-detect builds. Wait a minute and your site will be live.

Local run (dev):
- Frontend:
  cd frontend
  npm install
  npm run dev

- Server (local, optional):
  cd server
  npm install
  node index.js
  Then open http://localhost:3000/api/rates?pair=EURUSD

Notes:
- This project uses public APIs; no API keys are required.
- For production reliability you may add your own Twelve Data or other provider key in server/.env

Enjoy — if you want, I can also deploy it to my Vercel and give you the URL, or guide you step-by-step.
