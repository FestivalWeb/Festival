// src/components/FestivalIntro.jsx
import "./FestivalIntro.css";

function FestivalIntro() {
  return (
    <div className="intro-page">
      <div className="intro-container">
        {/* 상단 제목 + 언어 선택 */}
        <header className="intro-header">
          <h2 className="intro-title">논산 딸기축제</h2>
          <div className="intro-lang-buttons">
            <button className="lang-btn lang-active">한국어</button>
            <button className="lang-btn">English</button>
            <button className="lang-btn">日本語</button>
            <button className="lang-btn">中文</button>
          </div>
        </header>

        {/* 소개 글 영역 (나중에 번역 API가 여기 텍스트를 바꿀 예정) */}
        <section className="intro-text-area">
          <p id="festival-intro-text">
            이 영역에 축제 소개 기본 문장이 들어갑니다.  
            나중에 번역 API를 연동해서 한국어/영어/일본어/중국어로
            이 문장을 교체해 줄 예정입니다.
          </p>
        </section>

        {/* 하단 카드 영역 (포스터/사진 리스트) */}
        <section className="intro-card-grid">
          <article className="intro-card">
            <div className="intro-card-image">이미지 1</div>
            <p className="intro-card-caption">개막식 & 오프닝 퍼레이드</p>
          </article>

          <article className="intro-card">
            <div className="intro-card-image">이미지 2</div>
            <p className="intro-card-caption">딸기 수확 체험 프로그램</p>
          </article>

          <article className="intro-card">
            <div className="intro-card-image">이미지 3</div>
            <p className="intro-card-caption">야간 공연 & 푸드트럭</p>
          </article>

          <article className="intro-card">
            <div className="intro-card-image">이미지 4</div>
            <p className="intro-card-caption">포토존 & 가족 체험</p>
          </article>
        </section>

        {/* 우측 하단 "다음 보기" 같은 링크 자리 */}
        <div className="intro-more-link">
          <button className="intro-more-button">다음 소개 보기 &gt;</button>
        </div>
      </div>
    </div>
  );
}

export default FestivalIntro;
