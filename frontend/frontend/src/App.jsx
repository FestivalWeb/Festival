// src/App.jsx
import { useState } from "react";
import MainHero1 from "./components/MainHero1";
import FestivalIntro from "./components/FestivalIntro";

function App() {
  // page: "home" 또는 "intro"
  const [page, setPage] = useState("home");

  return (
    <>
      {page === "home" && <MainHero1 onNavigate={setPage} />}
      {page === "intro" && <FestivalIntro onNavigate={setPage} />}
    </>
  );
}

export default App;
