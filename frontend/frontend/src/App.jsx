import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Layout from "./components2/layout/Layout";
import MainHero1 from "./components/home/MainHero1";
import FestivalIntro from "./components/home/FestivalIntro";
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
import HomePage from "./components/home/HomePage.jsx";
import FestivalIntroDetail from "./components/home/FestivalIntroDetail.jsx";
import AdminPage from "./components/admin/AdminPage.jsx";

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

// 메인페이지의 Header의 경우 스크롤기능 때문에 다른 페이지에 따로 적용할 수 없어 AppContent() 조건 함수로 표현
function AppContent() {
  const location = useLocation();

  // 메인 페이지, admin, introdetail에서는 Header 숨김, mainhero1에 이미 자체 Header 코드가 있어서 header가 두번 렌더링됨.
  const hideHeader = location.pathname === "/" ||
    location.pathname.startsWith("/admin") ||
    location.pathname === "/intro/detail";
  return (
    <>
      {!hideHeader && <Header />}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/intro/detail" element={<FestivalIntroDetail />} />
        <Route path="/admin" element={<AdminPage />} />

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