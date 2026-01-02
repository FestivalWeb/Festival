import React, { useState, useEffect } from "react";
import "./DirectionsSection.css";
import KakaoMap from "../common/KakaoMap";

function DirectionsSection() {
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  const FESTIVAL_ADDRESS = "충남 논산시 관촉동 339-1";
  const FESTIVAL_NAME = "논산딸기축제";

  // 요일 계산
  const getDayOfWeek = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString); 
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    return days[date.getDay()];
  };

  // 날짜 표시
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const parts = dateString.split("-");
    return `${parts[1]}.${parts[2]}`;
  };

  const getWeatherIcon = (iconCode) => {
    if (!iconCode) return "☀️";
    const code = iconCode.substring(0, 2);
    switch (code) {
      case '01': return "☀️";
      case '02': return "⛅";
      case '03': case '04': return "☁️";
      case '09': case '10': return "🌧️";
      case '11': return "⛈️";
      case '13': return "❄️";
      case '50': return "🌫️";
      default: return "☀️";
    }
  };

  useEffect(() => {
    fetch("/api/weather")
      .then(async (res) => {
        if (!res.ok) throw new Error("통신 오류");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setForecast(data);
        } else if (data && typeof data === 'object') {
          setForecast([data]);
        } else {
          setForecast([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setErrorMsg("날씨 정보 없음");
        setLoading(false);
      });
  }, []);

  return (
    <section className="directions-page" id="directions-section">
      <div className="directions-container">
        <div className="directions-header">
           <span className="directions-badge">LOCATION</span>
           <h2 className="directions-title">오시는 길</h2>
           <p className="directions-subtext">논산딸기축제 행사장 위치와 교통편을 안내해 드립니다.</p>
        </div>

        <div className="directions-top">
          {/* 지도 영역 */}
          <div className="map-column">
            <div className="directions-map">
              <KakaoMap address={FESTIVAL_ADDRESS} placeName={FESTIVAL_NAME} />
            </div>
            <div className="map-button-wrap">
              <a href={`https://map.kakao.com/link/to/${FESTIVAL_NAME},36.1872,127.0987`} target="_blank" rel="noreferrer" className="kakaomap-btn">
                🚀 빠른 길찾기 (Kakao Map)
              </a>
            </div>
          </div>

          {/* 날씨 영역 */}
          <div className="directions-info-card">
            <h3 className="directions-info-title">축제 예보 (오늘)</h3>
            
            {loading ? (
              <div className="weather-msg">로딩중...</div>
            ) : errorMsg ? (
              <div className="weather-msg error">{errorMsg}</div>
            ) : forecast.length > 0 ? (
              // ▼▼▼ [수정] 리스트(map) 제거하고 forecast[0] 하나만 렌더링 ▼▼▼
              <div style={{ display: 'flex', justifyContent: 'center', height: '100%', alignItems: 'center' }}>
                {(() => {
                  const day = forecast[0]; // 첫 번째 데이터만 가져옴
                  return (
                    <div className="forecast-day-item" style={{ width: '100%', maxWidth: '280px', border: 'none', boxShadow: 'none', backgroundColor: 'transparent' }}>
                      
                      {/* 날짜와 요일 표시 */}
                      <div className="f-date" style={{ fontSize: '1.2rem', marginBottom: '10px' }}>
                        <span className="f-day-num">{formatDate(day.date)}</span> 
                        <span className="f-week"> ({getDayOfWeek(day.date)})</span>
                      </div>
                      
                      {/* 아이콘 크기 키움 */}
                      <div className="f-emoji-icon" style={{ fontSize: '64px', margin: '15px 0' }}>
                        {getWeatherIcon(day.icon)}
                      </div>
                      
                      {/* 온도 크기 키움 */}
                      <div className="f-temp" style={{ fontSize: '2rem' }}>
                        {Math.round(day.temp)}°
                      </div>
                      
                      <div className="f-minmax" style={{ fontSize: '1rem', marginTop: '8px' }}>
                        <span className="min">{Math.round(day.minTemp)}°</span>
                        <span className="divider">/</span>
                        <span className="max">{Math.round(day.maxTemp)}°</span>
                      </div>
                      
                      <div className="f-desc" style={{ marginTop: '10px', fontSize: '1rem' }}>
                        {day.description}
                      </div>
                    </div>
                  );
                })()}
              </div>
              // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲
            ) : (
              <div className="weather-msg">정보 없음</div>
            )}
          </div>
        </div>

        {/* 하단: 교통 안내 */}
        <div className="directions-bottom">
          <div className="directions-card">
            <h3 className="directions-card-title">🚍 대중교통 안내</h3>
            <ul className="directions-card-list">
              <li>
                <strong>기차</strong> : 논산역 하차 → 셔틀버스 또는 시내버스 이용
              </li>
              <li>
                <strong>버스</strong> : 논산종합버스터미널 하차 → 행사장 순환 버스
                탑승
              </li>
              <li>
                <strong>시내버스</strong> : ○○번, △△번 탑승 후{" "}
                <span>관광단지 입구</span> 정류장에서 하차
              </li>
            </ul>
          </div>

          <div className="directions-card">
            <h3 className="directions-card-title">🚗 자가용 &amp; 주차안내</h3>
            <ul className="directions-card-list">
              <li>
                <strong>내비게이션</strong> :{" "}
                <span>&quot;논산딸기축제 주차장&quot;</span> 검색
              </li>
              <li>
                <strong>주차장</strong> : 제1, 제2 임시 주차장 운영 (도보 5~10분)
              </li>
              <li>
                <strong>셔틀버스</strong> : 주차장 ↔ 행사장 간 무료 셔틀 운행
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DirectionsSection;