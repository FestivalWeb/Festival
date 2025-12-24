import React from "react";
import { BrowserRouter as Router, Routes, Route, Outlet, useLocation } from "react-router-dom";

import Layout from "./components2/layout/Layout";
import Header from "./components2/Header";
import { AuthProvider } from './context/AuthContext';
import Footer from "./components2/Footer";

// 페이지 컴포넌트들
import HomePage from "./components/home/HomePage.jsx";
import FestivalIntroDetail from "./components/home/FestivalIntroDetail.jsx";
import AdminPage from "./components/admin/AdminPage.jsx";
import AdminDashboard from "./components/admin/Dashboard/AdminDashboard";
import AccountMgmt from "./components/admin/AccountMgmt/AccountMgmt";
import BoardMgmt from "./components/admin/BoardMgmt/BoardMgmt";
import PopupMgmt from "./components/admin/PopupMgmt/PopupMgmt";
import LogDetail from "./components/admin/LogDetail/LogDetail";

// [팀원 코드 추가] 관리자 로그인/회원가입 컴포넌트 Import
import AdminLogin from "./components/admin/AdminAuth/AdminLogin"; 
import AdminSignup from "./components/admin/AdminAuth/AdminSignup";

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

// [팀원 코드 추가] 동적 게시판 페이지 Import
import BoardPage from "./pages/BoardPage";

// 로그인 관련
import Login from "./components3/Login";
import Signup from "./components3/Signup";
import MyPage from "./components3/MyPage";
import FindId from "./components3/FindId";
import ForgotPassword from "./components3/ForgotPassword";
import KakaoCallback from "./components3/KakaoCallback";

// 통합 검색 페이지 & 챗봇
import IntegratedSearchPage from "./components2/pages/IntegratedSearchPage";
import ChatBot from "./components/common/ChatBot";

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

function AppContent() {
  const location = useLocation();

  // 헤더를 숨길 경로들
  const hideHeader =
    location.pathname.startsWith("/admin") ||
    location.pathname === "/intro/detail" ||
    location.pathname.startsWith("/login") ||
    location.pathname.startsWith("/signup") ||
    location.pathname.startsWith("/findId") ||
    location.pathname.startsWith("/forgotPassword") ||
    location.pathname.startsWith("/oauth");

  return (
    <>
      {!hideHeader && <Header />}

      <Routes>
        {/* 메인 홈 & 축제 상세 */}
        <Route element={<HomeLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/intro/detail" element={<FestivalIntroDetail />} />
        </Route>

        {/* =================================
            관리자 그룹 (팀원 코드 통합)
           ================================= */}
        {/* [팀원 코드 추가] 관리자 로그인/회원가입 라우트 분리 */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/signup" element={<AdminSignup />} />

        <Route path="/admin" element={<AdminPage />}>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="account" element={<AccountMgmt />} />
          <Route path="board" element={<BoardMgmt />} />
          <Route path="popup" element={<PopupMgmt />} />
          <Route path="log" element={<LogDetail />} />
        </Route>

        {/* 로그인 관련 */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/findId" element={<FindId />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/mypage" element={<div style={{ paddingTop: 80 }}><MyPage /></div>} />
        <Route path="/oauth/kakao/callback" element={<KakaoCallback />} />

        {/* 통합 검색 결과 페이지 */}
        <Route path="/search" element={<Layout><IntegratedSearchPage /></Layout>} />

        {/* [팀원 코드 추가] 동적 게시판 라우팅 (핵심!) */}
        <Route path="/board/:boardId" element={<Layout><BoardPage /></Layout>} />

        {/* 게시판 및 기능 페이지 */}
        <Route path="/notice" element={<Layout><NoticePage /></Layout>} />
        <Route path="/notice/:id" element={<Layout><NoticeDetail /></Layout>} />
        
        <Route path="/post" element={<Layout><PostPage /></Layout>} />
        <Route path="/post/:id" element={<Layout><PostDetail /></Layout>} />
        
        <Route path="/post/write" element={<Layout><WritePostPage /></Layout>} />
        
        <Route path="/booth" element={<Layout><BoothPage /></Layout>} />
        <Route path="/booth/:id" element={<Layout><BoothDetailWrapper /></Layout>} />
        
        <Route path="/gallery" element={<Layout><GalleryPage /></Layout>} />
        <Route path="/gallery/:menu" element={<Layout sidebarType="galleryDetail"><GalleryDetail /></Layout>} />
        
        <Route path="/notice-images" element={<Layout sidebarType="galleryDetail"><NoticeImages /></Layout>} />
        <Route path="/post-images" element={<Layout sidebarType="galleryDetail"><PostImages /></Layout>} />
        <Route path="/booth-images" element={<Layout sidebarType="galleryDetail"><BoothImage /></Layout>} />
        <Route path="/booth-images/:id" element={<Layout sidebarType="galleryDetail"><BoothImageDetail /></Layout>} />

      </Routes>

      {/* 챗봇 컴포넌트 (모든 페이지 위에 뜸) */}
      <ChatBot />
    </>
  );
}

// [내 코드 유지] 팀원 코드는 여기서 조건문이 부실함
const BoothDetailWrapper = () => {
  const location = useLocation();
  const { booth } = location.state || {};
  
  // state가 없으면(새로고침 등) null을 넘겨서 BoothDetail 내부에서 fetch 하도록 함
  if (!booth && !location.pathname.split('/').pop()) return <p>부스를 찾을 수 없습니다.</p>;

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