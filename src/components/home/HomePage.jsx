// src/components/HomePage.jsx
import React, { useRef } from "react";
import MainHero1 from "./MainHero1.jsx";
import FestivalIntro from "./FestivalIntro.jsx";
import NoticeSection from "./NoticeSection.jsx";
import GallerySection from "./GallerySection.jsx";
import ExperienceBoothSection from "./ExperienceBoothSection.jsx";
import DirectionsSection from "./DirectionsSection.jsx";

function HomePage() {
  const introRef = useRef(null);
  const noticeRef = useRef(null);
  const galleryRef = useRef(null);
  const boothRef = useRef(null);
  const directionsRef = useRef(null);

  const handleScrollToIntro = () => {
    introRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleScrollToNotice = () => {
    noticeRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleScrollToGallery = () => {
    galleryRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleScrollToBooth = () => {
    boothRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleScrollToDirections = () => {
    directionsRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div>
      {/* 메인 히어로 + 상단 메뉴 */}
      <MainHero1
        onScrollToIntro={handleScrollToIntro}
        onScrollToNotice={handleScrollToNotice}
        onScrollToGallery={handleScrollToGallery}
        onScrollToBooth={handleScrollToBooth}
        onScrollToDirections={handleScrollToDirections}
      />

      {/* 축제 소개 섹션 */}
      <div ref={introRef}>
        <FestivalIntro />
      </div>

      {/* 공지사항 섹션 */}
      <div ref={noticeRef}>
        <NoticeSection />
      </div>

      {/* 갤러리 섹션 */}
      <div ref={galleryRef}>
        <GallerySection />
      </div>

      {/* 체험 부스 섹션 */}
      <div ref={boothRef}>
        <ExperienceBoothSection />
      </div>

      {/* 오시는 길 섹션 */}
      <div ref={directionsRef}>
        <DirectionsSection />
      </div>
    </div>
  );
}

export default HomePage;
