// ── src/context/GameStateContext.jsx ─────────────────────────────────────
// Tracks office room health and threats in real time.
//
// AuthContext = who you are (user identity, DB stats, JWT)
// GameContext = how the office map looks right now (room health per module)
//
// Room state is driven entirely by applyScenarioResult from officeStateService.
// Persisted to localStorage — map survives page refresh.

import { createContext, useContext, useReducer, useEffect } from "react";
import {
  buildInitialRooms,
  applyScenarioResult,
} from "../services/officeStateService";

function reducer(state, action) {
  switch (action.type) {

    // Called by module pages after answering a scenario.
    // payload: { module: "phishing"|"password"|"social"|"malware", correct: bool }
    case "SCENARIO_RESULT": {
      const { module, correct } = action.payload;
      return { ...state, rooms: applyScenarioResult(state.rooms, module, correct) };
    }

    // Called on logout — reset to baseline
    case "RESET":
      return { rooms: buildInitialRooms() };

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
  const initial = saved ? saved : { rooms: buildInitialRooms() };
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
