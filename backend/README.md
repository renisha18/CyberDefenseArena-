# CyberDefense Arena — Backend API

Node.js + Express + MySQL backend for the CyberDefense Arena cybersecurity training game.

---

## Quick Start

### 1. Prerequisites
- Node.js ≥ 18
- MySQL 8.x running locally

### 2. Install dependencies
```bash
cd backend
npm install
```

### 3. Configure environment
```bash
cp .env.example .env
# Edit .env — set DB_PASSWORD and JWT_SECRET at minimum
```

### 4. Create database + seed challenges
```bash
npm run seed
```

### 5. Start the server
```bash
npm run dev        # development (nodemon, auto-restart)
npm start          # production
```

Server starts on **http://localhost:5000**

---

## Project Structure

```
backend/
├── config/
│   └── db.js                   # MySQL connection pool
├── controllers/
│   ├── authController.js       # signup / login
│   ├── userController.js       # dashboard, profile, leaderboard
│   └── challengeController.js  # list, detail, complete
├── middleware/
│   └── authMiddleware.js       # JWT protection (protect function)
├── models/
│   ├── userModel.js            # users table queries
│   ├── challengeModel.js       # challenges table queries
│   └── userChallengeModel.js   # user_challenges junction table
├── routes/
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── challengeRoutes.js
│   └── leaderboardRoutes.js
├── utils/
│   ├── jwt.js                  # signToken / verifyToken
│   └── seed.js                 # DB schema + starter data
├── frontend-api-service/
│   └── api.js                  # Drop into React src/services/
├── server.js
└── .env.example
```

---

## Database Schema

### `users`
| Column       | Type         | Notes                     |
|--------------|--------------|---------------------------|
| id           | INT PK AI    |                           |
| username     | VARCHAR(50)  | unique                    |
| email        | VARCHAR(100) | unique                    |
| password     | VARCHAR(255) | bcrypt hash               |
| health_score | INT          | 0–100, starts at 50       |
| xp           | INT          | cumulative XP             |
| streak       | INT          | consecutive days active   |
| last_active  | DATE         | for streak calculation    |
| created_at   | TIMESTAMP    |                           |

### `challenges`
| Column        | Type         | Notes                        |
|---------------|--------------|------------------------------|
| id            | INT PK AI    |                              |
| title         | VARCHAR(100) |                              |
| description   | TEXT         |                              |
| category      | VARCHAR(50)  | phishing / malware / network |
| health_reward | INT          | added to health_score        |
| xp_reward     | INT          | added to xp                  |
| level         | INT          | sequential unlock order      |

### `user_challenges`
| Column         | Type    | Notes                           |
|----------------|---------|---------------------------------|
| id             | INT PK  |                                 |
| user_id        | INT FK  | → users.id                      |
| challenge_id   | INT FK  | → challenges.id                 |
| completed      | BOOLEAN |                                 |
| completed_date | DATE    | for "one per day" enforcement   |

---

## API Reference

### Authentication

#### `POST /api/auth/signup`
```json
{ "username": "ninja", "email": "user@email.com", "password": "secret123" }
```
Response `201`:
```json
{ "token": "jwt...", "user": { "id": 1, "username": "ninja", "healthScore": 50, "xp": 0, "streak": 0 } }
```

#### `POST /api/auth/login`
```json
{ "email": "user@email.com", "password": "secret123" }
```
Response `200`:
```json
{ "token": "jwt...", "user": { "username": "ninja", "healthScore": 60, "xp": 20, "streak": 2 } }
```

---

### User (🔒 JWT required)

#### `GET /api/user/dashboard`
```json
{
  "username": "ninja",
  "healthScore": 70,
  "xp": 45,
  "streak": 3,
  "completedChallenges": 2,
  "currentLevel": 3
}
```

#### `GET /api/user/profile`
Full profile + completed challenge list.

---

### Challenges (🔒 JWT required)

#### `GET /api/challenges`
```json
[
  { "id": 1, "title": "Phishing Detection", "status": "completed", "level": 1 },
  { "id": 2, "title": "Social Engineering",  "status": "unlocked",  "level": 2 },
  { "id": 3, "title": "Malware Recognition", "status": "locked",    "level": 3 }
]
```

#### `GET /api/challenges/:id`
Single challenge with status.

#### `POST /api/challenges/complete`
```json
{ "challengeId": 2 }
```
Response `200`:
```json
{
  "message": "Challenge \"Social Engineering\" completed!",
  "healthReward": 10,
  "xpReward": 25,
  "streak": 4,
  "player": { "healthScore": 80, "xp": 70, "streak": 4 }
}
```

Error responses:
- `403` — challenge is locked
- `409` — already completed this challenge
- `429` — already completed a challenge today

---

### Leaderboard (🌐 public)

#### `GET /api/leaderboard?limit=10`
```json
[
  { "rank": 1, "username": "ninja",    "healthScore": 90, "xp": 120, "streak": 7 },
  { "rank": 2, "username": "byteguard","healthScore": 80, "xp": 95,  "streak": 5 }
]
```

---

## Frontend Integration

Copy `frontend-api-service/api.js` to `src/services/api.js` in your React project.

Add to your `.env` (Vite):
```
VITE_API_URL=http://localhost:5000/api
```

Usage in React components:
```js
import api from "../services/api";

// Signup
const { token, user } = await api.auth.signup({ username, email, password });

// Login
const { user } = await api.auth.login({ email, password });

// Dashboard data
const dashboard = await api.user.getDashboard();

// Challenge list
const challenges = await api.challenges.getAll();

// Complete a challenge
const result = await api.challenges.complete(1);
// result.player.healthScore — update your React state with this

// Leaderboard
const top10 = await api.leaderboard.getTop(10);

// Logout
api.auth.logout();
```

---

## Game Rules

| Rule | Detail |
|------|--------|
| One challenge per day | `completed_date` enforced per user |
| Sequential unlock | Challenge N available only after N-1 completed |
| Health cap | `health_score` capped at 100 |
| Health floor | `health_score` floored at 0 |
| Streak | Increments on consecutive calendar days; resets on any gap |
