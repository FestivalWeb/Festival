import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';

// 1. 컴포넌트 Import
// (본인의 실제 파일 경로와 일치하는지 꼭 확인하세요!)
import HomePage from './components/home/HomePage'; 

import AdminPage from './components/admin/AdminPage';
import AdminDashboard from './components/admin/Dashboard/AdminDashboard';
import AccountMgmt from './components/admin/AccountMgmt/AccountMgmt';
import BoardMgmt from './components/admin/BoardMgmt/BoardMgmt';
import PopupMgmt from './components/admin/PopupMgmt/PopupMgmt';
import LogDetail from './components/admin/LogDetail/LogDetail';

// 2. 홈페이지 전용 레이아웃 컴포넌트 (index.css의 .home-layout-wrapper 적용)
const HomeLayout = () => {
  return (
    <div className="home-layout-wrapper">
      <Outlet />
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* =========================================
            Group A: 일반 사용자 (딸기축제 홈페이지)
            - 분홍색 배경, 가운데 정렬 스타일 적용
           ========================================= */}
        <Route element={<HomeLayout />}>
          {/* 메인 페이지 */}
          <Route path="/" element={<HomePage />} />
          
          {/* 필요하면 여기에 축제소개, 오시는길 등 추가 가능 */}
          {/* <Route path="/intro" element={<IntroPage />} /> */}
        </Route>


        {/* =========================================
            Group B: 관리자 페이지 (Admin)
            - 검은색 배경, 전체 화면, 사이드바 적용
           ========================================= */}
        <Route path="/admin" element={<AdminPage />}>
          {/* /admin 접속 시 기본으로 대시보드 */}
          <Route index element={<AdminDashboard />} />

          {/* 하위 메뉴들 */}
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="account" element={<AccountMgmt />} />
          <Route path="board" element={<BoardMgmt />} />
          <Route path="popup" element={<PopupMgmt />} />
          <Route path="log" element={<LogDetail />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;