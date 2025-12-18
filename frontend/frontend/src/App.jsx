import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Outlet, useLocation } from "react-router-dom";

import Layout from "./components2/layout/Layout";
import Header from "./components2/Header";
import { AuthProvider } from './context/AuthContext';
import Footer from "./components2/Footer";

import HomePage from "./components/home/HomePage.jsx";
import MainHero1 from "./components/home/MainHero1";
import FestivalIntro from "./components/home/FestivalIntro";
import FestivalIntroDetail from "./components/home/FestivalIntroDetail.jsx";
import AdminPage from "./components/admin/AdminPage.jsx";
import AdminDashboard from "./components/admin/Dashboard/AdminDashboard";
import AccountMgmt from "./components/admin/AccountMgmt/AccountMgmt";
import BoardMgmt from "./components/admin/BoardMgmt/BoardMgmt";
import PopupMgmt from "./components/admin/PopupMgmt/PopupMgmt";
import LogDetail from "./components/admin/LogDetail/LogDetail";

import NoticePage from "./components2/pages/NoticePage";
import NoticeDetail from "./components2/pages/NoticeDetail";
import PostPage from "./components2/pages/PostPage";
import PostDetail from "./components2/pages/PostDetail";
import BoothPage from "./components2/pages/BoothPage";
import BoothDetail from "./components2/pages/BoothDetail";
import GalleryPage from "./components2/pages/GalleryPage";
import GalleryDetail from "./components2/pages/GalleryDetail";
import NoticeImages from "./components2/pages/NoticeImage";
import PostImages from "./components2/pages/PostImage";
import BoothImage from "./components2/pages/BoothImage";
import BoothImageDetail from "./components2/pages/BoothImageDetail";
import WritePostPage from "./components2/pages/WritePostPage";

import Login from "./components3/Login";
import Signup from "./components3/Signup";
import MyPage from "./components3/MyPage";
import FindId from "./components3/FindId";
import ForgotPassword from "./components3/ForgotPassword";

// ------------------------
// 레이아웃 정의
// ------------------------
const HomeLayout = () => (
  <>
    <Header />
    <Outlet />
    <Footer />
  </>
);


// 메인페이지의 Header의 경우 스크롤기능 때문에 다른 페이지에 따로 적용할 수 없어 AppContent() 조건 함수로 표현
function AppContent() {
  const location = useLocation();


  // 메인 페이지에서 공용 Header를 사용하도록 변경함 (메인 전용 헤더를 제거했음).
  // 관리자/로그인 등 일부 경로에서만 헤더를 숨깁니다.
  const hideHeader =
    location.pathname.startsWith("/admin") ||
    location.pathname === "/intro/detail" ||
    location.pathname.startsWith("/login") ||
    location.pathname.startsWith("/signup") ||
    location.pathname.startsWith("/findId") ||
    location.pathname.startsWith("/forgotPassword");

  return (
    <>
      {!hideHeader && <Header />}

      <Routes>
        <Route element={<HomeLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/intro/detail" element={<FestivalIntroDetail />} />
        </Route>
        {/* =================================
            관리자 그룹
           ================================= */}
        <Route path="/admin" element={<AdminPage />}>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="account" element={<AccountMgmt />} />
          <Route path="board" element={<BoardMgmt />} />
          <Route path="popup" element={<PopupMgmt />} />
          <Route path="log" element={<LogDetail />} />
        </Route>

        {/* 로그인 관련 */}
        {/* 상운님, 기존의 onNavigate방식에서 react-router-dom방식으로 변경하면서 코드 바뀌었습니다. */}
        {/* 컴포넌트(ex)login.jsx)부분의 onNavigate방식을 goto로 바꾸셔야 라우팅이 될 것 같습니다. - 수빈 */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/findId" element={<FindId />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route
          path="/mypage"
          element={<div style={{ paddingTop: 80 }}><MyPage /></div>}
        />

        {/* 게시판 */}

        <Route path="/notice" element={<Layout><NoticePage /></Layout>} />
        <Route path="/notice/:id" element={<Layout><NoticeDetail /></Layout>} />
        <Route path="/post" element={<Layout><PostPage /></Layout>} />
        <Route path="/post/:id" element={<Layout><PostDetail /></Layout>} />
        <Route path="/booth" element={<Layout><BoothPage /></Layout>} />
        <Route path="/booth/:id" element={<Layout><BoothDetailWrapper /></Layout>} />
        <Route path="/gallery" element={<Layout><GalleryPage /></Layout>} />
        <Route path="/gallery/:menu" element={<Layout sidebarType="galleryDetail"><GalleryDetail /></Layout>} />
        <Route path="/notice-images" element={<Layout sidebarType="galleryDetail"><NoticeImages /></Layout>} />
        <Route path="/post-images" element={<Layout sidebarType="galleryDetail"><PostImages /></Layout>} />
        <Route path="/booth-images" element={<Layout sidebarType="galleryDetail"><BoothImage /></Layout>} />
        <Route path="/booth-images/:id" element={<Layout sidebarType="galleryDetail"><BoothImageDetail /></Layout>} />
        <Route path="/write" element={<Layout><WritePostPage /></Layout>} />
      </Routes>
    </>
  );
}

const BoothDetailWrapper = () => {
  const location = useLocation();
  const { booth } = location.state || {};
  if (!booth) return <p>부스를 찾을 수 없습니다.</p>;

  return <BoothDetail booth={booth} />;
};


function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;