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

function App() {
  return (
    <Router>
      <Header />

      <Routes>
        {/* 첫 화면과 축제 소개 */}
        <Route path="/" element={<MainHero1 />} />
        <Route path="/intro" element={<FestivalIntro />} />

        {/* Layout 안에 들어가는 페이지 */}
        <Route
          path="/notice"
          element={
            <Layout>
              <NoticePage />
            </Layout>
          }
        />
        <Route
          path="/notice/:id"
          element={
            <Layout>
              <NoticeDetail />
            </Layout>
          }
        />
        <Route
          path="/post"
          element={
            <Layout>
              <PostPage />
            </Layout>
          }
        />
        <Route
          path="/post/:id"
          element={
            <Layout>
              <PostDetail />
            </Layout>
          }
        />
        <Route
          path="/booth"
          element={
            <Layout>
              <BoothPage />
            </Layout>
          }
        />
        <Route
          path="/booth/:id"
          element={<BoothDetailWrapper />}
        />
        <Route
          path="/gallery"
          element={
            <Layout>
              <GalleryPage />
            </Layout>
          }
        />
        <Route
          path="/gallery/:menu" // /gallery/booth, /gallery/notice-images, /gallery/post-images
          element={
            <Layout sidebarType="galleryDetail">
              <GalleryDetail />
            </Layout>
          }
        />

        {/* NoticeImages, PostImages 상세 이미지 페이지 */}
        <Route
          path="/notice-images"
          element={
            <Layout sidebarType="galleryDetail">
              <NoticeImages />
            </Layout>
          }
        />
        <Route
          path="/post-images"
          element={
            <Layout sidebarType="galleryDetail">
              <PostImages />
            </Layout>
          }
        />
        <Route
          path="/booth-images"
          element={
            <Layout sidebarType="galleryDetail">
              <BoothImage />
            </Layout>
          }
        />

        <Route
          path="/booth-images/:id"
          element={
            <Layout sidebarType="galleryDetail">
              <BoothImageDetail />
            </Layout>
          }
        />
      </Routes>
      <Footer />
    </Router>
  );
}

// useLocation으로 state 전달받기

const BoothDetailWrapper = () => {
  const location = useLocation();
  const { booth } = location.state || {};
  if (!booth) return <p>부스를 찾을 수 없습니다.</p>;

  return (
    <Layout sidebarType="boothDetail"> {/* sidebarType으로 사이드바 지정 */}
      <BoothDetail booth={booth} />
    </Layout>
  );
};

export default App;
