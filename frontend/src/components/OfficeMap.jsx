// Pixel SVG office network map with room health indicators
import { useState } from "react";

const ROOMS = [
  { id: "server",   label: "SERVER ROOM",     x: 55,  y: 75,  w: 175, h: 125, health: 75, threats: 2 },
  { id: "security", label: "SECURITY OPS",    x: 295, y: 58,  w: 155, h: 108, health: 90, threats: 0 },
  { id: "network",  label: "NETWORK HUB",     x: 510, y: 75,  w: 148, h: 98,  health: 58, threats: 4 },
  { id: "hr",       label: "HR STATION",      x: 75,  y: 262, w: 128, h: 98,  health: 82, threats: 1 },
  { id: "work1",    label: "WORKSTATIONS A",  x: 265, y: 244, w: 155, h: 108, health: 65, threats: 3 },
  { id: "work2",    label: "WORKSTATIONS B",  x: 482, y: 234, w: 148, h: 108, health: 91, threats: 0 },
  { id: "exec",     label: "EXEC SUITE",      x: 155, y: 412, w: 138, h: 98,  health: 44, threats: 5 },
  { id: "db",       label: "DATABASE",        x: 355, y: 392, w: 128, h: 118, health: 70, threats: 2 },
];

const CORRIDORS = [
  { x1: 230, y1: 138, x2: 295, y2: 112 },
  { x1: 450, y1: 130, x2: 510, y2: 124 },
  { x1: 139, y1: 200, x2: 139, y2: 262 },
  { x1: 343, y1: 166, x2: 343, y2: 244 },
  { x1: 556, y1: 173, x2: 556, y2: 234 },
  { x1: 203, y1: 311, x2: 265, y2: 298 },
  { x1: 420, y1: 298, x2: 482, y2: 288 },
  { x1: 224, y1: 360, x2: 224, y2: 412 },
  { x1: 343, y1: 352, x2: 355, y2: 392 },
];

function roomColor(health) {
  if (health >= 80) return "#39ff14";
  if (health >= 55) return "#ffd700";
  return "#ff2d55";
}

export default function OfficeMap({ onRoomClick }) {
  const [hovered, setHovered] = useState(null);
  const [tipPos, setTipPos] = useState({ x: 0, y: 0 });

  const hovRoom = ROOMS.find((r) => r.id === hovered);

  return (
    <div className="office-map">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 720 555"
        style={{ position: "absolute", inset: 0 }}
      >
        <defs>
          <pattern id="pgrid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M20 0L0 0 0 20" fill="none" stroke="rgba(0,245,255,0.04)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="720" height="555" fill="url(#pgrid)" />

        {/* Corridors */}
        {CORRIDORS.map((c, i) => (
          <line
            key={i} x1={c.x1} y1={c.y1} x2={c.x2} y2={c.y2}
            stroke="rgba(0,245,255,0.16)" strokeWidth="6" strokeDasharray="4 4"
          />
        ))}

        {/* Rooms */}
        {ROOMS.map((room) => {
          const isHov = hovered === room.id;
          const rc = roomColor(room.health);
          const corners = [
            [room.x, room.y], [room.x + room.w - 4, room.y],
            [room.x, room.y + room.h - 4], [room.x + room.w - 4, room.y + room.h - 4],
          ];
          return (
            <g
              key={room.id}
              onMouseEnter={(e) => { setHovered(room.id); setTipPos({ x: e.clientX, y: e.clientY }); }}
              onMouseLeave={() => setHovered(null)}
              onClick={() => onRoomClick && onRoomClick(room)}
              style={{ cursor: "pointer" }}
            >
              <rect
                x={room.x} y={room.y} width={room.w} height={room.h}
                fill={isHov ? "rgba(0,245,255,0.08)" : "rgba(13,27,46,0.9)"}
                stroke={isHov ? "#00f5ff" : "rgba(30,58,95,0.8)"}
                strokeWidth={isHov ? 2 : 1.5}
                style={{ filter: isHov ? "drop-shadow(0 0 8px #00f5ff)" : "none", transition: "all .2s" }}
              />
              {corners.map((p, pi) => (
                <rect key={pi} x={p[0]} y={p[1]} width={4} height={4} fill={rc} opacity={0.75} />
              ))}
              {/* Health bar */}
              <rect x={room.x + 4} y={room.y + 4} width={room.w - 8} height={5} fill="#0a0e1a" opacity={0.8} />
              <rect x={room.x + 4} y={room.y + 4} width={(room.w - 8) * (room.health / 100)} height={5} fill={rc} />
              {/* Labels */}
              <text x={room.x + room.w / 2} y={room.y + room.h / 2 - 6}
                textAnchor="middle" fontFamily="'Press Start 2P'" fontSize="6" fill={rc} opacity={0.85}>
                {room.label}
              </text>
              <text x={room.x + room.w / 2} y={room.y + room.h / 2 + 10}
                textAnchor="middle" fontFamily="'Press Start 2P'" fontSize="7" fill="#fff" opacity={0.7}>
                {room.health}%
              </text>
              {/* Threat pings */}
              {room.threats > 0 &&
                Array.from({ length: Math.min(room.threats, 3) }).map((_, ti) => (
                  <g key={ti}>
                    <circle cx={room.x + room.w - 14 - ti * 13} cy={room.y + 14} r={4} fill="#ff2d55" opacity={0.9} />
                    <circle
                      cx={room.x + room.w - 14 - ti * 13} cy={room.y + 14} r={4}
                      fill="none" stroke="#ff2d55"
                      style={{
                        animation: "ping 1.5s ease-out infinite",
                        transformOrigin: `${room.x + room.w - 14 - ti * 13}px ${room.y + 14}px`,
                      }}
                    />
                  </g>
                ))}
            </g>
          );
        })}
      </svg>

      {/* Hover tooltip */}
      {hovRoom && (
        <div
          className="office-map__tooltip"
          style={{
            left: tipPos.x + 14,
            top: tipPos.y - 10,
            border: `2px solid ${roomColor(hovRoom.health)}`,
            boxShadow: `0 0 14px ${roomColor(hovRoom.health)}66`,
          }}
        >
          <div className="office-map__tooltip-title">{hovRoom.label}</div>
          <div className="office-map__tooltip-health" style={{ color: roomColor(hovRoom.health) }}>
            HEALTH: {hovRoom.health}%
          </div>
          <div className="office-map__tooltip-threats" style={{ color: hovRoom.threats > 0 ? "#ff2d55" : "#39ff14" }}>
            THREATS: {hovRoom.threats > 0 ? `${hovRoom.threats} ACTIVE` : "CLEAR"}
          </div>
        </div>
      )}
    </div>
  );
}
