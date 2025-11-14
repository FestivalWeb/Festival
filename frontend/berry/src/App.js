import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import NoticePage from "./components/pages/NoticePage";
import NoticeDetail from "./components/pages/NoticeDetail";
import HomePage from "./components/pages/HomePage";
import GalleryPage from "./components/pages/GalleryPage";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/notice" element={<NoticePage />} />
        <Route path="/notice/:id" element={<NoticeDetail />} />
        {/* 나머지 페이지 추가 */}
      </Routes>
       <Footer />
    </Router>
  );
}

export default App;
