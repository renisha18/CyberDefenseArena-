// ── src/services/officeStateService.js ───────────────────────────────────
// Pure logic — no React. GameStateContext calls these and stores results.
// Correct answers heal rooms. Wrong answers spread threats.
// Threats spread to adjacent rooms when health is critically low.

export const ROOMS = [
  { id: "server",   label: "SERVER ROOM",    module: "malware",  baseThreat: 1, x: 55,  y: 75,  w: 175, h: 125 },
  { id: "security", label: "SECURITY OPS",   module: "network",  baseThreat: 0, x: 295, y: 58,  w: 155, h: 108 },
  { id: "network",  label: "NETWORK HUB",    module: "network",  baseThreat: 2, x: 510, y: 75,  w: 148, h: 98  },
  { id: "hr",       label: "HR STATION",     module: "phishing", baseThreat: 1, x: 75,  y: 262, w: 128, h: 98  },
  { id: "work1",    label: "WORKSTATIONS A", module: "phishing", baseThreat: 1, x: 265, y: 244, w: 155, h: 108 },
  { id: "work2",    label: "WORKSTATIONS B", module: "password", baseThreat: 0, x: 482, y: 234, w: 148, h: 108 },
  { id: "exec",     label: "EXEC SUITE",     module: "social",   baseThreat: 2, x: 155, y: 412, w: 138, h: 98  },
  { id: "db",       label: "DATABASE",       module: "malware",  baseThreat: 1, x: 355, y: 392, w: 128, h: 118 },
];

// Corridor adjacency — threat spread map
const ADJACENT = {
  server:   ["security", "hr"],
  security: ["server", "network", "work1"],
  network:  ["security", "work2"],
  hr:       ["server", "work1", "exec"],
  work1:    ["security", "hr", "work2"],
  work2:    ["network", "work1", "db"],
  exec:     ["hr", "db"],
  db:       ["work2", "exec"],
};

export function buildInitialRooms() {
  return Object.fromEntries(
    ROOMS.map((r) => [r.id, { health: 80, threats: r.baseThreat }])
  );
}

/** Apply a scenario result to the rooms for the affected module */
export function applyScenarioResult(rooms, module, correct) {
  const updated = { ...rooms };
  ROOMS.forEach((room) => {
    if (room.module !== module) return;
    const r = { ...updated[room.id] };
    if (correct) {
      r.health  = Math.min(100, r.health + 12);
      r.threats = Math.max(0,   r.threats - 1);
    } else {
      r.health  = Math.max(0,   r.health - 15);
      r.threats = Math.min(5,   r.threats + 1);
    }
    updated[room.id] = r;
  });

  // Spread threats if any room is now critical
  return spreadThreats(updated);
}

/** Threats spread to adjacent rooms when health < 30 */
export function spreadThreats(rooms) {
  const updated = { ...rooms };
  ROOMS.forEach((room) => {
    const hasCriticalNeighbour = (ADJACENT[room.id] ?? []).some((nId) => {
      return rooms[nId] && rooms[nId].health < 30;
    });
    if (hasCriticalNeighbour && updated[room.id].threats < 5) {
      updated[room.id] = { ...updated[room.id], threats: updated[room.id].threats + 1 };
    }
  });
  return updated;
}

/** Overall security score 0–100 averaged across all rooms */
export function computeSecurityScore(rooms) {
  const vals = Object.values(rooms);
  return Math.round(vals.reduce((sum, r) => sum + r.health, 0) / vals.length);
}
