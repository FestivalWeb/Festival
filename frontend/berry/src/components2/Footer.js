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
        // marginTop: "40px",
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
            <img
              src="/icons/instagram.jpg"
              alt="instagram"
              style={{ width: "28px" }}
            />
            <span style={{ width: "120px", fontWeight: "600" }}>인스타그램</span>
            <a
              href="https://instagram.com/nonsan.korea"
              target="_blank"
              style={{ color: "#000", textDecoration: "none" }}
            >
              instagram.com/nonsan.korea
            </a>
          </div>

          {/* 유튜브 */}
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <img
              src="/icons/youtube.png"
              alt="youtube"
              style={{ width: "28px" }}
            />
            <span style={{ width: "120px", fontWeight: "600" }}>유튜브</span>
            <a
              href="https://www.youtube.com/@Nonsan"
              target="_blank"
              style={{ color: "#000", textDecoration: "none" }}
            >
              youtube.com/@Nonsan
            </a>
          </div>

          {/* 이메일 */}
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <img
              src="/icons/email.png"
              alt="email"
              style={{ width: "28px" }}
            />
            <span style={{ width: "120px", fontWeight: "600" }}>이메일</span>
            <a
              href="mailto:nonsan@nonsan.com"
              style={{ color: "#000", textDecoration: "none" }}
            >
              nonsan@nonsan.com
            </a>
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
