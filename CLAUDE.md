# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FPL Strategy & Management Suite - full-stack app for Fantasy Premier League team management with betting/statistical data integration for "Optimal Move" suggestions.

## Tech Stack

- **Backend:** NestJS (TypeScript) with @nestjs/axios
- **Frontend:** Next.js/React (planned)
- **Data Sources:**
  - FPL Unofficial API (https://fantasy.premierleague.com/api/)
  - API-Football or Sportmonks for odds/predictions

## Architecture

Four NestJS modules:
- `AuthModule` - FPL login, pl_profile cookie handling, CSRF
- `FplClientModule` - GET/POST wrapper for FPL endpoints
- `StatsModule` - External betting/prediction API integration
- `RecommendationModule` - Team comparison vs fixture predictions

## Key Constraints

- FPL API has no CORS - backend must proxy all requests
- Cache `/bootstrap-static/` for 5min to avoid rate limits
- Strict TypeScript interfaces for all FPL JSON responses
- Handle "Expired Session" errors, prompt re-login

## FPL API Endpoints

Priority endpoints to implement:
- `/bootstrap-static/` - player/team data (public)
- `/my-team/{manager_id}/` - user team (auth required)
- `/fixtures/` - schedule/difficulty (public)
- `POST /transfers/` - make transfers (auth required)
- `POST /my-team/{manager_id}/chips/` - use chips (auth required)

## Implementation Phases

1. NestJS setup + FplClient for public data
2. Login proxy + session/cookie management
3. Write services (Transfers/Chips)
4. External odds API integration + recommendation algorithm

## Plan Mode

- Make plans extremely concise, sacrifice grammar
- End plans with unresolved questions list if any
