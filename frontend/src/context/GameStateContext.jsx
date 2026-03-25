// ── src/context/GameStateContext.jsx ─────────────────────────────────────
// Tracks office room health and threats in real time.
// Only responsibility: keep the office map reactive.
//
// AuthContext = who you are (user identity, DB stats, JWT)
// GameContext = how the office map looks right now (room health per module)
//
// Persisted to localStorage — map survives page refresh.

import { createContext, useContext, useReducer, useEffect } from "react";

// Which module affects which rooms
// phishing  → HR + WORKSTATIONS A
// password  → WORKSTATIONS B
// social    → EXEC SUITE + DATABASE
// malware   → SERVER ROOM + SECURITY OPS + NETWORK HUB
export const ROOM_MODULE_MAP = {
  server:   "malware",
  security: "malware",
  network:  "malware",
  hr:       "phishing",
  work1:    "phishing",
  work2:    "password",
  exec:     "social",
  db:       "social",
};

// Starting room health before any play
const DEFAULT_ROOMS = {
  server:   { health: 75, threats: 1 },
  security: { health: 90, threats: 0 },
  network:  { health: 60, threats: 3 },
  hr:       { health: 82, threats: 1 },
  work1:    { health: 65, threats: 2 },
  work2:    { health: 91, threats: 0 },
  exec:     { health: 45, threats: 4 },
  db:       { health: 70, threats: 2 },
};

function updateRooms(rooms, module, correct) {
  const updated = { ...rooms };
  Object.entries(ROOM_MODULE_MAP).forEach(([roomId, roomModule]) => {
    if (roomModule !== module) return;
    const r = { ...updated[roomId] };
    if (correct) {
      r.health  = Math.min(100, r.health + 12);
      r.threats = Math.max(0,   r.threats - 1);
    } else {
      r.health  = Math.max(0,   r.health - 15);
      r.threats = Math.min(5,   r.threats + 1);
    }
    updated[roomId] = r;
  });
  return updated;
}

function reducer(state, action) {
  switch (action.type) {

    // Sync all rooms proportionally to player's real HP from DB
    // Called in Dashboard useEffect when user loads
    case "SYNC_HEALTH": {
      const hp = Math.max(1, action.payload.healthScore ?? 70);
      const scaled = {};
      Object.entries(DEFAULT_ROOMS).forEach(([id, room]) => {
        scaled[id] = {
          health:  Math.max(0, Math.min(100, Math.round(room.health * (hp / 70)))),
          threats: room.threats,
        };
      });
      return { ...state, rooms: scaled };
    }

    // Called by module pages after answering a scenario
    // payload: { module: "phishing"|"password"|"social"|"malware", correct: bool }
    case "SCENARIO_RESULT": {
      const { module, correct } = action.payload;
      return { ...state, rooms: updateRooms(state.rooms, module, correct) };
    }

    // Called on logout
    case "RESET":
      return { rooms: DEFAULT_ROOMS };

    default:
      return state;
  }
}

const STORAGE_KEY = "cda_office";

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function saveToStorage(state) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
  catch { /* quota — ignore */ }
}

const GameStateContext = createContext(null);

export function GameStateProvider({ children }) {
  const saved   = loadFromStorage();
  const initial = saved ? saved : { rooms: DEFAULT_ROOMS };
  const [state, dispatch] = useReducer(reducer, initial);

  useEffect(() => { saveToStorage(state); }, [state]);

  return (
    <GameStateContext.Provider value={{ rooms: state.rooms, dispatch }}>
      {children}
    </GameStateContext.Provider>
  );
}

export function useGameState() {
  const ctx = useContext(GameStateContext);
  if (!ctx) throw new Error("useGameState must be used inside <GameStateProvider>");
  return ctx;
}
