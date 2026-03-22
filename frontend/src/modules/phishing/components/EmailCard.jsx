// ── src/modules/phishing/components/EmailCard.jsx ────────────────────────
// Renders the fake email as a pixel-styled email client.
// Deliberately looks like a real email to simulate the attack.

export default function EmailCard({ level, glitch }) {
  if (!level) return null;

  const { senderDisplay, subject, body, link, attachment } = level;

  // Highlight the suspicious domain in the sender address
  const highlightedSender = senderDisplay;

  return (
    <div className={`email-card ${glitch ? "glitch" : ""}`}>

      {/* Browser chrome bar */}
      <div className="email-card__chrome">
        <div className="email-card__chrome-dot" style={{ background: "#ff2d55" }} />
        <div className="email-card__chrome-dot" style={{ background: "#ffd700" }} />
        <div className="email-card__chrome-dot" style={{ background: "#39ff14" }} />
        <div className="email-card__chrome-bar">
          ◈ COMPANY MAIL — INBOX
        </div>
      </div>

      {/* Email metadata */}
      <div className="email-card__header">
        <div className="email-card__row">
          <span className="email-card__row-label">FROM:</span>
          <span className="email-card__row-value email-card__row-value--alert">
            {highlightedSender}
          </span>
        </div>
        <div className="email-card__row">
          <span className="email-card__row-label">TO:</span>
          <span className="email-card__row-value">you@company.com</span>
        </div>
        <div className="email-card__row">
          <span className="email-card__row-label">DATE:</span>
          <span className="email-card__row-value">
            {new Date().toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", month: "short", year: "numeric" })}
          </span>
        </div>

        <div className="email-card__subject">{subject}</div>
      </div>

      {/* Email body */}
      <div className="email-card__body">
        {body}

        {/* Embedded link */}
        {link && (
          <div style={{ marginTop: "12px" }}>
            <span style={{
              fontFamily: "var(--pixel)", fontSize: "5px",
              color: "rgba(0,245,255,.5)", display: "block", marginBottom: "4px",
            }}>
              EMBEDDED LINK:
            </span>
            <span className="email-card__link">
              {link}
            </span>
            <span style={{
              fontFamily: "var(--pixel)", fontSize: "4px",
              color: "#ff8c00", marginLeft: "8px",
            }}>
              ⚠ hover to inspect
            </span>
          </div>
        )}
      </div>

      {/* Attachment */}
      {attachment && (
        <div className="email-card__attachment">
          <span style={{ fontSize: "20px" }}>📎</span>
          <div>
            <div className="email-card__attachment-name">{attachment}</div>
            <div className="email-card__attachment-warning">⚠ UNVERIFIED ATTACHMENT</div>
          </div>
        </div>
      )}
    </div>
  );
}
