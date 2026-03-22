import React    from "react";
import ReactDOM from "react-dom/client";
import App      from "./App";

// Shows the real error if any import crashes during dev
class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(e) { return { error: e }; }
  render() {
    if (this.state.error) {
      return (
        <div style={{ background:"#0a0e1a", color:"#ff2d55", padding:"40px",
          fontFamily:"monospace", fontSize:"14px", minHeight:"100vh" }}>
          <div style={{ color:"#ffd700", fontSize:"18px", marginBottom:"16px" }}>
            ⚠ MODULE LOAD ERROR
          </div>
          <pre>{this.state.error.message}</pre>
          <pre style={{ color:"#a8c8e0", marginTop:"12px", fontSize:"11px" }}>
            {this.state.error.stack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);