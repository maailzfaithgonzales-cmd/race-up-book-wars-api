# Race up: Book Wars API

Backend API for **Race up: Book Wars**, a tournament game for the SorSU Bulan Campus library.
CS 313 Software Engineering 1, A.Y. 2026-2027.

- Developer: Ma. Ailz Faith B. Gonzales (maailzfaithgonzales-cmd), BSCS 3-2
- Group and game concept: Team 9

This is my own build of my group's game concept. Every commit in this repository was made by me, with Git, on my own computer or in my own Codespace.

## Tech stack

| Layer | Tool |
|---|---|
| Runtime | Node.js 22 LTS or newer |
| Web framework | Express 5 |
| Database | PostgreSQL 16 or newer |
| ORM and migrations | Sequelize 6 with sequelize-cli |

## Setup

```
git clone [repository-url]
cd [folder-name]
npm install
```

Copy `.env.example` to `.env`, then put your own PostgreSQL password in `DB_PASSWORD`.

```
npm run db:create     (first time only)
npm run db:migrate
npm run db:seed
npm run db:check
npm run dev
```

## Environment variables

| Key | Example | Purpose |
|---|---|---|
| NODE_ENV | development | Which config block to use |
| PORT | 3001 | Port the API listens on (the library assigns the final port at deployment) |
| DB_HOST | 127.0.0.1 | PostgreSQL host |
| DB_PORT | 5432 | PostgreSQL port |
| DB_NAME | your_game_slug | Database name: your game slug, with underscores |
| DB_USER | postgres | Database user |
| DB_PASSWORD | (your own) | Database password. Never commit this. |
| HUB_API_KEY | dev-hub-key | Key the Library Game Hub sends to read results. The library gives the real one at deployment. |

## Endpoints (Hub Contract v1.2)

Base URL: `http://localhost:3001/api/v1`

| Method | Path | Purpose | Success |
|---|---|---|---|
| GET | /health | Is the API up and can it reach the database? | 200 (503 when the database is down) |
| GET | /game-info | Slug, name, group, developer, description, player limits, version | 200 |
| GET | /results | Finished games, every player, and the top 3. Needs the `X-Hub-Key` header. Optional `?since=` | 200 (401 without the key) |

## What "completed" means in my game

A player is "completed" when they have answered every question in the game's
question set. The results query counts the player's rows in `answers` and compares
the count with the number of questions in the session's question set. A player who
left early has fewer answers, so `completed` is false.

## Tables

- `game_users`: registered accounts (players and hosts) with role, total EXP and school ID
- `question_sets`: a named set of questions the host picks for a session
- `book_effects`: effects that move a player on the shelf
- `questions`: the questions in a set, with choices and the correct answer
- `game_sessions`: one game run by a host, with join code, status, and start and end times
- `players`: one account's seat in one session, with shelf position, final ranking and session
output
- `player_question_progress`: each player's progress on each question in a session
- `answers`: every answer a player submitted
- `retry_pool`: questions a player got wrong and may retry
- `leaderboard`: the final ranking saved for each player after a session ends
- `exp_transactions`: EXP the host awarded to players after a session

## Database scripts

| Command | What it does |
|---|---|
| npm run db:migrate | Runs migrations that have not run yet |
| npm run db:migrate:status | Lists every migration as up or down |
| npm run db:seed | Loads the seed data |
| npm run db:check | Counts the rows in every table |
| npm run db:reset | Empties the database, rebuilds every table and reloads the seed data |
| npm run check | Runs the same automatic check that GitHub runs after every push |
