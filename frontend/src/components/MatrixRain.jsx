// Animated matrix rain background
const CHARS = "01アイウエオカキクケコサシスセソ";
const COLS = 18;

export default function MatrixRain({ opacity = 0.06 }) {
  return (
    <div className="matrix-rain" style={{ opacity }}>
      {Array.from({ length: COLS }).map((_, i) => (
        <div
          key={i}
          className="matrix-rain__col"
          style={{
            left: `${(i / COLS) * 100}%`,
            animation: `matrix-fall ${4 + (i % 4)}s linear ${(i * 0.4) % 4}s infinite`,
          }}
        >
          {Array.from({ length: 22 })
            .map(() => CHARS[Math.floor(Math.random() * CHARS.length)])
            .join("")}
        </div>
      ))}
    </div>
  );
}
