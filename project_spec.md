# Project Specification: FPL Strategy & Management Suite

## 1. Overview

Full-stack app for Fantasy Premier League team management. View squad, browse GW history, get AI strategy advice, captain picks, transfer suggestions, live ranks, price trends, and league standings.

## 2. Tech Stack

| Layer | Tech |
|---|---|
| Backend | NestJS (TypeScript), `@nestjs/axios` |
| Frontend | Vite + React 19, `@tanstack/react-router` |
| Data | React Query v5 (`@tanstack/react-query`) |
| Styling | Tailwind CSS v4 (glassmorphic, custom tokens) |
| AI | Vercel AI SDK v6 + `@ai-sdk/anthropic` (Claude Haiku) |
| Data source | FPL Unofficial API (`https://fantasy.premierleague.com/api/`) |

## 3. Architecture

### Backend modules (`source/backend/src/`)
| Module | Purpose |
|---|---|
| `FplClientModule` | Proxy + cache all FPL API calls |
| `RecommendationModule` | Transfer, lineup, chip suggestion engine |
| `StatsModule` | League standings, trends, price changes |
| `TeamsModule` | Team data, enriched picks |
| `AiModule` | Claude streaming chat, strategy planner, captain pick |
| `AuthModule` | Session/cookie management (framework ready) |

### Frontend routes (`source/frontend/src/routes/`)
| Route | Component | Description |
|---|---|---|
| `/` | Landing | Hero, features, team ID form |
| `/team/:teamId` | Dashboard | Squad pitch, live rank, chips, lineup rec, AI chat |
| `/strategy/:teamId` | Strategy | 50/50 squad + AI strategy planner |
| `/stats` | Stats | League standings, best players |
| `/trends` | Trends | Price changes, transfer activity |

## 4. Key Constraints

- FPL API has no CORS — backend proxies all requests
- `bootstrap-static` cached 5 min, events 1h, other data 24h
- Strict TypeScript interfaces for all FPL responses (`common/interfaces/`)
- Handle "Expired Session" errors

## 5. Env Vars

### Backend (`source/backend/.env`)
| Var | Default | Required |
|---|---|---|
| `ANTHROPIC_API_KEY` | — | ✅ for AI features |
| `FPL_BASE_URL` | `https://fantasy.premierleague.com/api` | ✅ |
| `FPL_LOGIN_URL` | `https://users.premierleague.com/accounts/login/` | ✅ |
| `CACHE_TTL_BOOTSTRAP` | `300000` | optional |
| `PORT` | `3000` | optional |

### Frontend (`source/frontend/.env.local`)
| Var | Default |
|---|---|
| `VITE_API_URL` | `http://localhost:3000` |

## 6. Implementation Status

- ✅ Phase 1: FplClientModule — bootstrap, fixtures, public data
- ✅ Phase 2: Entry data, picks, live GW, element summaries
- ✅ Phase 3: Recommendation engine (transfers, lineup, chips)
- ✅ Phase 4: AI features (strategy planner, captain pick, chat panel)
- ✅ Frontend: Full React UI with glassmorphic design
