import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Layout from "./components2/layout/Layout";
import MainHero1 from "./components/MainHero1";
import FestivalIntro from "./components/FestivalIntro";
import NoticePage from "./components2/pages/NoticePage";
import NoticeDetail from "./components2/pages/NoticeDetail";
import PostPage from "./components2/pages/PostPage";
import PostDetail from "./components2/pages/PostDetail";
import BoothPage from "./components2/pages/BoothPage";
import NoticeImages from "./components2/pages/NoticeImage";
import PostImages from "./components2/pages/PostImage";
import GalleryPage from "./components2/pages/GalleryPage";
import GalleryDetail from "./components2/pages/GalleryDetail";
import BoothImage from "./components2/pages/BoothImage";
import Header from "./components2/Header";
import Footer from "./components2/Footer";
import BoothDetail from "./components2/pages/BoothDetail";
import Sidebar from "./components2/layout/Sidebar";
import BoothImageDetail from "./components2/pages/BoothImageDetail";

// function App() {
//   return (
//     <Router>
//       <Header />

//       <Routes>
//         {/* 첫 화면과 축제 소개 */}
//         <Route path="/" element={<MainHero1 />} />
//         <Route path="/intro" element={<FestivalIntro />} />


function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation();

  // 메인 페이지에서는 Header 숨김 / mainhero1과 header가 두번 렌더링됨.
  const hideHeader = location.pathname === "/";

  return (
    <>
      {!hideHeader && <Header />}

      <Routes>
        <Route path="/" element={<MainHero1 />} />
        <Route path="/intro" element={<FestivalIntro />} />

        <Route path="/notice" element={<Layout><NoticePage /></Layout>} />
        <Route path="/notice/:id" element={<Layout><NoticeDetail /></Layout>} />

        <Route path="/post" element={<Layout><PostPage /></Layout>} />
        <Route path="/post/:id" element={<Layout><PostDetail /></Layout>} />

        <Route path="/booth" element={<Layout><BoothPage /></Layout>} />
        <Route path="/booth/:id" element={<BoothDetailWrapper />} />

        <Route path="/gallery" element={<Layout><GalleryPage /></Layout>} />
        <Route path="/gallery/:menu" element={<Layout sidebarType="galleryDetail"><GalleryDetail /></Layout>} />

        <Route path="/notice-images" element={<Layout sidebarType="galleryDetail"><NoticeImages /></Layout>} />
        <Route path="/post-images" element={<Layout sidebarType="galleryDetail"><PostImages /></Layout>} />
        <Route path="/booth-images" element={<Layout sidebarType="galleryDetail"><BoothImage /></Layout>} />
        <Route path="/booth-images/:id" element={<Layout sidebarType="galleryDetail"><BoothImageDetail /></Layout>} />
      </Routes>

      <Footer />
    </>
  );
}

const BoothDetailWrapper = () => {
  const location = useLocation();
  const { booth } = location.state || {};
  if (!booth) return <p>부스를 찾을 수 없습니다.</p>;

  return (
    <Layout sidebarType="boothDetail">
      <BoothDetail booth={booth} />
    </Layout>
  );
};

export default App;