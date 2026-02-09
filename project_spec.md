This is a smart move. Providing a clear, technical specification to an AI agent will ensure the code it generates is modular, correctly typed, and adheres to the FPL API's unique quirks.

Here is a comprehensive **`FPL_PROJECT_SPEC.md`** file you can give to any LLM/Agent to kickstart the development.

---

# Project Specification: FPL Strategy & Management Suite

## 1. Project Overview

A full-stack application that allows users to manage their Fantasy Premier League (FPL) teams directly, while integrating external betting/statistical data to provide "Optimal Move" suggestions.

## 2. Tech Stack

- **Backend Framework:** NestJS (TypeScript)
- **HTTP Client:** `@nestjs/axios`
- **Frontend (Planned):** Next.js / React
- **Data Source 1:** Official FPL Unofficial API (`https://fantasy.premierleague.com/api/`)
- **Data Source 2:** API-Football or Sportmonks (For odds/advanced predictions)

## 3. Core Requirements

### A. Authentication & Session Management

- **Login Proxy:** The API must handle authentication with `https://users.premierleague.com/accounts/login/`.
- **Cookie Handling:** Capture the `pl_profile` cookie. This cookie must be passed in the headers of all "Write" requests.
- **CSRF:** Handle potential CSRF requirements for state-changing requests (transfers/chips).

### B. FPL API Integration (Priority Endpoints)

1. **Bootstrap Static:** `/bootstrap-static/` (Player names, teams, basic stats).
2. **User Team:** `/my-team/{manager_id}/` (Requires Auth).
3. **Fixtures:** `/fixtures/` (Schedule and difficulty).
4. **Transfer Endpoint:** `POST /transfers/` (Requires Auth).
5. **Chips Endpoint:** `POST /my-team/{manager_id}/chips/` (Requires Auth).

### C. Prediction Logic

- Integrate an external API to fetch win/loss probabilities and xG (Expected Goals).
- **Mapping Layer:** A service that maps external Team/Player IDs (e.g., from API-Football) to Official FPL IDs.

## 4. Proposed NestJS Architecture

### Modules:

1. `AuthModule`: Handles FPL login and session persistence.
2. `FplClientModule`: A wrapper for all GET/POST requests to the official FPL endpoints.
3. `StatsModule`: Fetches and cleans data from betting/prediction APIs.
4. `RecommendationModule`: The engine that compares current user team stats vs. upcoming fixture predictions.

### Key DTOs (Data Transfer Objects):

- `LoginDto`: email, password.
- `TransferRequestDto`: list of `player_in` IDs, `player_out` IDs, and `chip_to_use`.
- `ChipRequestDto`: `chip_name` (e.g., 'wildcard', '3xc', 'bboost').

## 5. Known Constraints & Implementation Rules

- **CORS:** FPL API does not support CORS; the NestJS backend must act as a transparent proxy.
- **Caching:** Implement a 5-minute cache for `/bootstrap-static/` to avoid rate limiting.
- **Error Handling:** Must handle "Expired Session" errors from FPL and prompt for re-login.
- **Types:** Use strict TypeScript interfaces for all FPL JSON responses (Players, Teams, Elements).

## 6. Implementation Phases

1. **Phase 1:** Setup NestJS project and `FplClient` to fetch public data.
2. **Phase 2:** Implement Login proxy and Session (Cookie) management.
3. **Phase 3:** Build the "Write" services (Transfers/Chips).
4. **Phase 4:** Integrate external Odds/Prediction APIs and build the "Optimal Suggestion" algorithm.

---

### How to use this file:

1. Create a new file named `FPL_PROJECT_SPEC.md` in your project root.
2. Paste the content above.
3. When you start your next session with an AI, say: **"Read FPL_PROJECT_SPEC.md. I want to start by implementing Phase 1: The FplClientModule in NestJS."**
