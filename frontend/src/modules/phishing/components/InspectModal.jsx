// ── src/modules/phishing/components/InspectModal.jsx ─────────────────────
// Shows domain / sender / link analysis when the player clicks Inspect.
// Teaches the player WHAT to look for without giving away the answer.

export default function InspectModal({ level, onClose }) {
  if (!level) return null;

  // Extract the domain from sender email
  const senderMatch  = level.senderDisplay.match(/<(.+)>/);
  const senderEmail  = senderMatch ? senderMatch[1] : level.senderDisplay;
  const senderDomain = senderEmail.split("@")[1] || "";

  // Extract domain from link
  let linkDomain = null;
  if (level.link) {
    try {
      linkDomain = new URL(level.link).hostname;
    } catch {
      linkDomain = level.link;
    }
  }

  // Heuristic: flag suspicious patterns
  const domainFlags = analyseDomain(senderDomain);
  const linkFlags   = level.link ? analyseLink(level.link, linkDomain) : [];

  return (
    <div className="inspect-modal-backdrop" onClick={onClose}>
      <div className="inspect-modal" onClick={(e) => e.stopPropagation()}>

        <div className="inspect-modal__header">
          <span className="inspect-modal__title">🔍 EMAIL ANALYSIS</span>
          <button className="inspect-modal__close" onClick={onClose}>✕ CLOSE</button>
        </div>

        <div className="inspect-modal__body">

          {/* Sender domain analysis */}
          <div className="inspect-modal__row">
            <div className="inspect-modal__label">SENDER EMAIL</div>
            <div className="inspect-modal__value inspect-modal__value--danger">
              {senderEmail}
            </div>
            <div className="inspect-modal__label" style={{ marginTop: "6px" }}>SENDER DOMAIN</div>
            <div className={`inspect-modal__value ${domainFlags.length ? "inspect-modal__value--danger" : "inspect-modal__value--ok"}`}>
              {senderDomain}
              <br />
              {domainFlags.map((f, i) => (
                <span key={i} className="inspect-modal__tag inspect-modal__tag--danger" style={{ marginRight: "4px" }}>
                  {f}
                </span>
              ))}
            </div>
          </div>

          {/* Link analysis */}
          {level.link && (
            <div className="inspect-modal__row">
              <div className="inspect-modal__label">ACTUAL LINK URL</div>
              <div className="inspect-modal__value inspect-modal__value--danger">
                {level.link}
              </div>
              <div className="inspect-modal__label" style={{ marginTop: "6px" }}>LINK DOMAIN</div>
              <div className="inspect-modal__value inspect-modal__value--danger">
                {linkDomain}
                <br />
                {linkFlags.map((f, i) => (
                  <span key={i} className="inspect-modal__tag inspect-modal__tag--danger" style={{ marginRight: "4px" }}>
                    {f}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Attachment warning */}
          {level.attachment && (
            <div className="inspect-modal__row">
              <div className="inspect-modal__label">ATTACHMENT</div>
              <div className="inspect-modal__value inspect-modal__value--danger">
                {level.attachment}
                <br />
                <span className="inspect-modal__tag inspect-modal__tag--danger">DOUBLE EXTENSION</span>
                <span className="inspect-modal__tag inspect-modal__tag--danger" style={{ marginLeft: "4px" }}>EXECUTABLE</span>
              </div>
            </div>
          )}

          {/* Hint */}
          <div style={{
            fontFamily: "var(--pixel)", fontSize: "4.5px",
            color: "rgba(255,215,0,.7)", padding: "8px 10px",
            background: "rgba(255,215,0,.05)", border: "1px solid rgba(255,215,0,.2)",
            lineHeight: "1.9",
          }}>
            💡 TIP: Real company emails always come from the official domain.
            Check the full domain carefully — attackers use lookalike domains (paypa1 vs paypal).
          </div>

        </div>
      </div>
    </div>
  );
}

// ── Domain analysis helpers ───────────────────────────────────────────────
function analyseDomain(domain) {
  const flags = [];
  if (!domain) return flags;
  const lower = domain.toLowerCase();

  // Lookalike digits (0→o, 1→l, 3→e, etc.)
  if (/[0-9]/.test(lower))           flags.push("DIGIT IN DOMAIN");
  if (lower.includes("-"))            flags.push("HYPHEN IN DOMAIN");
  if (lower.split(".").length > 2)   flags.push("SUBDOMAIN PRESENT");
  if (lower.endsWith(".ru") || lower.endsWith(".cn") || lower.endsWith(".tk"))
                                      flags.push("SUSPICIOUS TLD");
  if (!lower.includes(".com") && !lower.includes(".org") && !lower.includes(".net"))
                                      flags.push("UNCOMMON TLD");

  return flags;
}

function analyseLink(link, domain) {
  const flags = [];
  if (!link || !domain) return flags;
  const lower = domain.toLowerCase();

  if (/[0-9]/.test(lower))           flags.push("DIGIT IN DOMAIN");
  if (lower.split(".").length > 2)   flags.push("SUBDOMAIN");
  if (!link.startsWith("https://"))  flags.push("NO HTTPS");
  if (lower.endsWith(".ru") || lower.endsWith(".tk"))
                                      flags.push("SUSPICIOUS TLD");
  if (lower.includes("-"))            flags.push("HYPHEN — common in fake domains");

  return flags;
}
