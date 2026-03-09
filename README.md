# FPL Strategy & Management Suite

Full-stack Fantasy Premier League manager. View your squad on a pitch, get AI-powered transfer advice, captain picks, multi-GW strategy plans, live rank tracking, and player trends.

## What it does

- **Squad dashboard** — pitch view with player cards, GW navigation, live rank bar
- **AI strategy planner** — Claude-powered 1/2/3/5-GW plan with transfer priorities, chip timing, captains
- **AI chat** — ask anything about your squad in a slide-in panel
- **Lineup recommendations** — optimal starting XI with reasoning
- **Captain/chip suggestions** — confidence-scored picks
- **Stats & trends** — league standings, price risers/fallers, transfer activity

## Routes

| URL | Description |
|---|---|
| `/` | Landing — enter your FPL team ID to start |
| `/team/:teamId` | Main dashboard with squad, rank, chips, AI chat |
| `/strategy/:teamId` | 50/50 layout: squad + AI strategy panel |
| `/stats` | League standings and best players |
| `/trends` | Price changes and transfer trends |

## How to run

### 1. Install & setup env files

```bash
npm run setup
```

This installs deps in both `source/backend` and `source/frontend`, and creates `.env` files from templates if they don't exist.

### 2. Set your Anthropic API key

Edit `source/backend/.env`:
```
ANTHROPIC_API_KEY=sk-ant-...
```

AI features (strategy, captain pick, chat) won't work without this. Get a key at console.anthropic.com.

### 3. Run backend

```bash
npm run dev:backend
# NestJS starts on http://localhost:3000
# Swagger docs: http://localhost:3000/api
```

### 4. Run frontend

```bash
npm run dev:frontend
# Vite starts on http://localhost:5173
```

Open http://localhost:5173, enter your FPL team ID (find it at fantasy.premierleague.com → Points → your URL).

## Env vars reference

### Backend (`source/backend/.env`)

| Var | Default | Notes |
|---|---|---|
| `ANTHROPIC_API_KEY` | — | Required for AI features |
| `FPL_BASE_URL` | `https://fantasy.premierleague.com/api` | |
| `PORT` | `3000` | |
| `CACHE_TTL_BOOTSTRAP` | `300000` | ms, 5 min |

### Frontend (`source/frontend/.env.local`)

| Var | Default |
|---|---|
| `VITE_API_URL` | `http://localhost:3000` |
