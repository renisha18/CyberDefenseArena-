import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./pages/homepage";
import Main from "./pages/Main";
import CyberDefenseArena from "./pages/challenge";

function App() {
  return (
      <Routes>
        <Route path="/" element={<Homepage/>} />
        <Route path="/main" element={<Main />} />
        <Route path="/challenge" element={<CyberDefenseArena />} />
      </Routes>
  );
}

export default App;