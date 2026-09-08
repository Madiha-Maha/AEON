# Aeon — The Living Symphony of Earth

A generative ambient music experience driven by real-time planetary data and rendered through an audio-reactive aurora visualizer.

## Architecture

- **`apps/web`**: Next.js / React 19 PWA frontend with procedural Web Audio / Tone.js synthesis engine and Canvas/WebGL aurora visualizer. Deploys to **Vercel**.
- **`apps/api`**: Node.js + Express + Socket.io backend with external data source ingestion (Weather, Markets, Sentiment, Seismic), parameter normalization, and Prisma PostgreSQL ORM. Deploys to **Railway**.
- **`packages/shared`**: Shared TypeScript types (`WorldParameters`, Moment artifacts, Room contracts) and schemas.

---

## 8. DEPLOYMENT STEPS (write into README.md verbatim, then follow)

1. Push repo to GitHub.
2. **Railway**: New Project → Deploy from GitHub → service root `apps/api` →
   Add PostgreSQL plugin → set `JWT_SECRET`, `CORS_ORIGIN`, and the three
   data-source API keys → deploy → confirm `/health` returns 200 → copy the
   public URL (and its `wss://` equivalent).
3. **Vercel**: New Project → same repo → root directory `apps/web` → set
   `NEXT_PUBLIC_API_BASE_URL` and `NEXT_PUBLIC_WS_URL` to the Railway URL
   from step 2 → deploy.
4. Update `CORS_ORIGIN` on Railway to the final Vercel domain, redeploy.
5. Open the deployed PWA, confirm the `pulse:update` stream arrives and the
   audio engine + visualizer both react to changing parameters within a
   few seconds of load.

---

## Manual Dashboard Steps for Vercel & Railway

### Railway Dashboard:
1. **Root Directory**: In service settings, verify Root Directory is set to `apps/api`.
2. **Database Plugin**: Add the Railway PostgreSQL plugin. Railway automatically injects the `DATABASE_URL` environment variable.
3. **Variables**: Set the following variables in the Railway Variables tab:
   - `JWT_SECRET`: Random 32+ character string.
   - `CORS_ORIGIN`: Your Vercel URL (e.g., `https://aeon.vercel.app,http://localhost:3000`).
   - `WEATHER_API_KEY`: (Optional) OpenWeatherMap or Open-Meteo key. Falls back to simulated organic live telemetry if empty.
   - `MARKETS_API_KEY`: (Optional) AlphaVantage or TwelveData key. Falls back to organic market drift if empty.
   - `NEWS_SENTIMENT_API_KEY`: (Optional) GDELT/NewsAPI key. Falls back to organic sentiment baseline if empty.
   - `PORT`: Set to `4000` (or Railway's `$PORT`).
4. **Networking**: Click "Generate Domain" to expose the public endpoint (e.g. `https://aeon-api.up.railway.app`).

### Vercel Dashboard:
1. **Framework Preset**: Next.js or Vite.
2. **Root Directory**: In Project Settings, set Root Directory to `apps/web` (or root for monorepo with `apps/web/vercel.json`).
3. **Environment Variables**:
   - `NEXT_PUBLIC_API_BASE_URL`: The HTTPS URL from Railway (e.g. `https://aeon-api.up.railway.app`).
   - `NEXT_PUBLIC_WS_URL`: The WSS WebSocket URL from Railway (e.g. `wss://aeon-api.up.railway.app`).
4. **Redeploy**: Once both are deployed, verify the live pulse stream connection and start the audio engine.

---

## Local Development

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev
```
Open `http://localhost:3000` to experience Aeon.
