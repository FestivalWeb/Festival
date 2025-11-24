// src/App.jsx
import { useState, useEffect } from "react";
import MainHero1 from "./components/MainHero1";
import FestivalIntro from "./components/FestivalIntro";
import Login from "./components3/Login";
import Signup from "./components3/Signup";
import MyPage from "./components3/MyPage";
import Header from "./components/Header";

function App() {
  const [page, setPage] = useState("home");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = sessionStorage.getItem('user');
    setIsLoggedIn(!!user);
  }, [page]);

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <>
      {(page === "mypage" || page === "intro") && (
        <Header 
          onNavigate={setPage} 
          isLoggedIn={isLoggedIn}
          onLogout={handleLogout}
        />
      )}
      {page === "home" && <MainHero1 onNavigate={setPage} isLoggedIn={isLoggedIn} />}
      {page === "intro" && <FestivalIntro onNavigate={setPage} isLoggedIn={isLoggedIn} />}
      {page === "login" && <Login onNavigate={setPage} onLoginSuccess={() => setIsLoggedIn(true)} />}
      {page === "signup" && <Signup onNavigate={setPage} />}
      {page === "mypage" && <MyPage onNavigate={setPage} onLogout={handleLogout} />}
    </>
  );
}

export default App;
