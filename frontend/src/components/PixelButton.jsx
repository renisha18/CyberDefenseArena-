// Reusable pixel-styled button
// type: 'primary' | 'secondary' | 'danger' | 'gold' | 'report' | 'cta' | 'back'

export default function PixelButton({
  text,
  onClick,
  type = "primary",
  icon = null,
  style = {},
  disabled = false,
}) {
  return (
    <button
      className={`pixel-btn pixel-btn--${type}`}
      onClick={onClick}
      disabled={disabled}
      style={style}
    >
      {icon && <span style={{ fontSize: "12px" }}>{icon}</span>}
      {text}
    </button>
  );
}
