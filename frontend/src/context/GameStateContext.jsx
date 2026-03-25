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
  applyPlayerAction,
} from "../services/officeStateService";

function reducer(state, action) {
  switch (action.type) {

    case "SCENARIO_RESULT": {
      const { module, correct } = action.payload;
      return { ...state, rooms: applyScenarioResult(state.rooms, module, correct) };
    }

    // Strategic room action from Dashboard popup
    // payload: { roomId: string, action: "isolate"|"patch"|"ignore" }
    case "PLAYER_ACTION": {
      const { roomId, action: roomAction } = action.payload;
      return { ...state, rooms: applyPlayerAction(state.rooms, roomId, roomAction) };
    }

    // Crisis event — damages all rooms in the affected module
    // payload: { module: string }
    case "CRISIS": {
      const { module } = action.payload;
      // Crisis hits all rooms of that module hard
      let rooms = { ...state.rooms };
      Object.keys(rooms).forEach((id) => {
        if (rooms[id] && state.rooms[id]) {
          // We don't have module info here — applyScenarioResult with correct=false handles it
        }
      });
      rooms = applyScenarioResult(state.rooms, module, false);
      rooms = applyScenarioResult(rooms, module, false); // double hit for crisis
      return { ...state, rooms, crisis: action.payload };
    }

    // Clear active crisis after player acknowledges
    case "CLEAR_CRISIS":
      return { ...state, crisis: null };

    case "RESET":
      return { rooms: buildInitialRooms(), crisis: null };

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
  const initial = saved ? saved : { rooms: buildInitialRooms(), crisis: null };
  const [state, dispatch] = useReducer(reducer, initial);

  useEffect(() => { saveToStorage(state); }, [state]);

  return (
    <GameStateContext.Provider value={{ rooms: state.rooms, crisis: state.crisis, dispatch }}>
      {children}
    </GameStateContext.Provider>
  );
}

export function useGameState() {
  const ctx = useContext(GameStateContext);
  if (!ctx) throw new Error("useGameState must be used inside <GameStateProvider>");
  return ctx;
}
