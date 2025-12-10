import React from "react";

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "#f8d7dd", // 사진과 비슷한 연분홍
        marginTop: 0,
        padding: "20px 0",
        width: "100%",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          width: "90%",
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        {/* SNS 영역 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            marginBottom: "30px",
            fontSize: "18px",
          }}
        >
          {/* 인스타그램 */}
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <a href="https://instagram.com/nonsan.korea" target="_blank">
              <img
                src="/icons/Instagram.jpg"
                alt="instagram"
                style={{ width: "28px", marginLeft: "20px", cursor: "pointer" }}
              />
            </a>
      
            {/* 일반 텍스트 */}
            <span style={{ width: "120px", fontWeight: "600", marginLeft: "10px" }}>
              인스타그램
            </span>

            {/* 오른쪽 URL은 링크 ❌, 텍스트만 유지 */}
            <span style={{ marginLeft: "458px", color: "#000" }}>
              instagram.com/nonsan.korea
            </span>
          </div>


          {/* 유튜브 */}
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            {/* 로고 클릭 → 이동 */}
            <a href="https://www.youtube.com/@Nonsan" target="_blank">
              <img
                src="/icons/youtube.png"
                alt="youtube"
                style={{ width: "28px", marginLeft: "20px", cursor: "pointer" }}
              />
            </a>

            {/* 일반 텍스트 */}
            <span style={{ width: "120px", fontWeight: "600", marginLeft: "10px" }}>
              유튜브
            </span>

            {/* 오른쪽 URL은 링크 ❌, 텍스트만 유지 */}
            <span style={{ marginLeft: "460px", color: "#000" }}>
              www.youtube.com/@Nonsan
            </span>
          </div>

          {/* 이메일 */}
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <img
              src="/icons/email.png"
              alt="email"
              style={{ width: "28px", marginLeft: "20px" }}
            />
            <span style={{ width: "120px", fontWeight: "600", marginLeft: "10px" }}>이메일</span>
            {/* 링크 제거하고 일반 텍스트만 표시 */}
            <span
              style={{
                color: "#000",
                textDecoration: "none",
                marginLeft: "460px"
              }}
            >
              nonsan@nonsan.com
            </span>
          </div>
        </div>

        {/* 초록색 텍스트 3개 */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "20px",
            color: "#0e8a45",
            fontWeight: "600",
            fontSize: "15px",
          }}
        >
          <span>개인정보 처리방침</span>
          <span>저작권 보호</span>
          <span>문의 안내</span>
        </div>

        {/* 하단 주소 */}
        <div
          style={{
            textAlign: "center",
            fontSize: "12px",
            color: "#555",
            lineHeight: "1.6",
            marginLeft: "50px"
          }}
        >
          <div>2024년 충청남도 논산시 시민로 270</div>
          <div>TEL. 042-789-28728 &nbsp;&nbsp; FAX. 042-782-3797</div>
          <div>COPYRIGHT ⓒ NONSAN ALL RIGHTS RESERVED.</div>
        </div>
      </div>
    </footer>
  );
}
