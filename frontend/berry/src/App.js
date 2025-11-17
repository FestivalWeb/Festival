import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import NoticePage from "./components/pages/NoticePage";
import NoticeDetail from "./components/pages/NoticeDetail";
import GalleryPage from "./components/pages/GalleryPage";
import Layout from "./components/layout/Layout";
import PostPage from "./components/pages/PostPage";
import PostDetail from "./components/pages/PostDetail";
import BoothPage from "./components/pages/BoothPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* 여기 Layout을 하나의 큰 틀로 사용 */}
        <Route element={<Layout />}>
          <Route path="/" element={<NoticePage />} />
          <Route path="/notice" element={<NoticePage />} />
          <Route path="/notice/:id" element={<NoticeDetail />} />
          <Route path="/post" element={<PostPage />} />
          <Route path="/post/:id" element={<PostDetail />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/booth" element={<BoothPage />} />
          {/* 나머지 페이지 추가 */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
