// src/components/DirectionsSection.jsx
import React, { useState, useEffect } from "react";
import "./DirectionsSection.css";

function DirectionsSection() {
  // 🔥 날씨 상태
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weatherError, setWeatherError] = useState(null);

  useEffect(() => {
    // ✅ 여기 엔드포인트를 실제 백엔드에서 만든 주소로 바꿔줘!
    const WEATHER_API_URL = "/api/weather"; // 예시: "/api/weather/today"

    const fetchWeather = async () => {
      try {
        setWeatherLoading(true);
        const res = await fetch(WEATHER_API_URL);
        if (!res.ok) {
          throw new Error("날씨 정보를 불러오지 못했습니다.");
        }
        const data = await res.json();

        // ✅ 백엔드 응답 형태에 맞게 이 부분 필드 이름만 맞춰주면 됨
        // 예시는 { temp, minTemp, maxTemp, description, rainProb, updatedAt }
        setWeather(data);
      } catch (err) {
        setWeatherError(err.message);
      } finally {
        setWeatherLoading(false);
      }
    };

    fetchWeather();
  }, []);

  return (
    <section className="directions-page">
      <div className="directions-container">
        <h2 className="directions-title">오시는 길</h2>
        <p className="directions-subtext">
          논산딸기축제가 열리는 행사장 위치와 교통편을 안내해 드립니다.
        </p>

        {/* 상단: 지도 + 날씨 정보 */}
        <div className="directions-top">
          <div className="directions-map">
            <span className="directions-map-placeholder">
              지도 영역 (추후 API 연동)
            </span>
          </div>

          {/* 🔥 여기: 행사장 정보 → 오늘의 날씨 카드 */}
          <div className="directions-info-card directions-weather-card">
            <h3 className="directions-info-title">오늘의 날씨</h3>

            {weatherLoading && (
              <p className="weather-text">날씨 정보를 불러오는 중입니다...</p>
            )}

            {weatherError && (
              <p className="weather-text weather-error">
                날씨 정보를 불러오지 못했어요.
              </p>
            )}

            {!weatherLoading && !weatherError && weather && (
              <div className="weather-content">
                <div className="weather-main-row">
                  {/* 백엔드 필드 이름에 맞춰서 수정! */}
                  <span className="weather-temp">{weather.temp}°C</span>
                  <span className="weather-desc">{weather.description}</span>
                </div>

                <ul className="weather-detail-list">
                  <li>최저 {weather.minTemp}°C</li>
                  <li>최고 {weather.maxTemp}°C</li>
                  {weather.rainProb != null && (
                    <li>강수확률 {weather.rainProb}%</li>
                  )}
                </ul>

                {weather.updatedAt && (
                  <p className="weather-updated">
                    기준 시각: {weather.updatedAt}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 하단: 교통 안내 */}
        <div className="directions-bottom">
          <div className="directions-card">
            <h3 className="directions-card-title">대중교통 안내</h3>
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
            <h3 className="directions-card-title">자가용 &amp; 주차안내</h3>
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
