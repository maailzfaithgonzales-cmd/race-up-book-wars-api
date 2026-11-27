# Development journey: Race Up: Book Wars API

Student: Ma. Ailz Faith B. Gonzales · Section: 3-2 · Group: Team 9

One entry per milestone, written the week you did it. Newest at the bottom.

## M1 · Accounts, passwords and tokens
- Dates worked: Nov 20, 2026 · Time spent: 2
- Goal: Players and hosts will be able to register, log in, and get a token that proves who they are.
- What I built: The new files, auth.validator.js, auth.service.js, auth.controller.js, auth.routes.js, user.service.js, user.controller.js, user.routes.js, user-json.js, and the two new migrations and two new seeders. The endpoints are POST /auth/register, POST /auth/login, GET /auth/me, GET /users and PATCH /users/:id/role.
- Evidence: https://github.com/maailzfaithgonzales-cmd/race-up-book-wars-api/pull/3 · fb60a3a, 7b3072c, 71513a3
- Problem I hit: The module said to add a password_hash column, but my users table already had one, and nickname was required, so registration would have crashed.
- How I solved it: I created a new migration instead of editing the old ones, used {{baseUrl}} in every URL, and db:reset before every full run.
- Decision I made and why: I chose to make nickname optional, because player only need one when joining a game.
- Changes to my design set: he users table now allows an empty nickname, password_hash is 60 characters and optional, the role rule allows ADMIN, and there's a demo admin account. Five endpoints were added to the endpoint table.
- What I would explain to a classmate: I would explain about the changes in the users table.

## M2 · The question bank

## M3 · Gameplay

## M4 · Automated tests and server preparation

## M5 · API documentation and deployment

## M6 · The SE1 portfolio and the release

## M7 · The Test Report
