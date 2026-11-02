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

## Request headers and authentication

### X-Demo-User

The `X-Demo-User` header identifies the host or player making a request. During Week 11, this is a temporary identity mechanism that uses seeded school IDs to identify accounts.

Example:

`X-Demo-User: 2099-0001`

This is not real authentication because anyone can enter a seeded school ID. It is used for development and testing until the actual authentication system is implemented in Week 12.

### X-Hub-Key

The `X-Hub-Key` header is used by the Library Game Hub to access the `/results` endpoint.

Example:

`X-Hub-Key: dev-hub-key`

The API checks this key before returning game results. The development key is stored in the `HUB_API_KEY` environment variable. The actual deployment key will be provided by the library.

## Endpoints (Hub Contract v1.2)

Base URL: `http://localhost:3001/api/v1`

| Method | Path | Purpose | Who may call it | Success |
|---|---|---|---|---|
| GET | /health | Check if the API is running and can reach the database | Anyone | 200 (503 when the database is down) |
| GET | /game-info | Retrieve game information | Anyone | 200 |
| GET | /results | Retrieve finished games, every player, and the top 3 | Library Game Hub with a valid X-Hub-Key | 200 |
| POST | /sessions | Create a new game session | HOST or ADMIN | 201 |
| GET | /sessions/{code} | Retrieve session details using its join code | No role restriction | 200 |
| PATCH | /sessions/{code} | Update the session status (start or end the game) | HOST or ADMIN | 200 |
| POST | /sessions/{code}/players | Join a session or rejoin an existing seat | Any identified user | 201 (new player), 200 (rejoin) |
| GET | /sessions/{code}/players | Retrieve the players in a session | No role restriction | 200 |
| GET |	/question-sets | HOST or ADMIN	| 200 |
| POST | /question-sets	| HOST or ADMIN	| 201 |
| GET | /question-sets/{id}	| HOST or ADMIN, subject to ownership	| 200 |
| PATCH	| /question-sets/{id} | HOST or ADMIN, subject to ownership	| 200 |
| DELETE |/question-sets/{id} | HOST or ADMIN, subject to ownership	| 204 |

## What "completed" means in my game

A player is "completed" when they have answered every question in the game's
question set. The results query counts the player's rows in `answers` and compares
the count with the number of questions in the session's question set. A player who
left early has fewer answers, so `completed` is false.

## Tables

- `users`: registered accounts (players and hosts) with role, total EXP and school ID
- `question_sets`: a named set of questions the host picks for a session
- `book_effects`: effects that move a player on the shelf
- `questions`: the questions in a set, with choices and the correct answer
- `game_sessions`: one game run by a host, with join code, status, and start and end times
- `players`: one account's seat in one session, with shelf position, final ranking and session output
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
