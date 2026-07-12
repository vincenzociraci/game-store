import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";

export default function App() {
  return (
    <div style={{ fontFamily: "sans-serif" }}>
      <Navbar />
      <div style={{ padding: "1.5rem" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* Le altre pagine arrivano nei prossimi passi */}
        </Routes>
      </div>
    </div>
  );
}