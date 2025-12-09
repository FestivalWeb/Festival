import React, { useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/booth.css";
import { boothResData } from "../data/boothResData";

// 체험부스 예약 탭 상세페이지
const BoothDetail = () => {
   const { state } = useLocation();
  const { id } = useParams();

  const booth = state?.booth ?? boothResData.find((item) => item.id === Number(id));

  if (!booth) return <p>부스 정보를 찾을 수 없습니다.</p>;

  // 부스의 예약 가능한 날짜로 설정
  const activeDates = booth.availableDates;

  const [selectedDate, setSelectedDate] = useState(activeDates[0]);
  const [people, setPeople] = useState(1);
  const [reservations, setReservations] = useState(
    activeDates.reduce((acc, date) => {
      acc[date] = 0;
      return acc;
    }, {})
  );

  const [showCalendar, setShowCalendar] = useState(false);

  const formatDate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const handleDateClick = (date) => {
    const formatted = formatDate(date);
    if (activeDates.includes(formatted)) {
      setSelectedDate(formatted);
      setShowCalendar(false);
    }
  };

  const tileDisabled = ({ date, view }) => {
    if (view === "month") {
      const formatted = formatDate(date);
      return !activeDates.includes(formatted);
    }
    return false;
  };

  const handleReservation = () => {
    if (window.confirm(`${people}명 예약하시겠습니까?`)) {
      setReservations((prev) => ({
        ...prev,
        [selectedDate]: prev[selectedDate] + parseInt(people)
      }));
      alert("예약 완료!");
    }
  };

  return (
    <div className="detail-container">
      <div className="detail-top">
        {/* 왼쪽: 사진 */}
        <div className="detail-image-wrapper">
          <img src={booth.image} alt={booth.title} className="detail-main-image" />
        </div>

        {/* 오른쪽: 상세 설명 */}
        <div className="detail-info-box">
          <h2 className="detail-title">{booth.title}</h2>
          <p className="detail-desc">{booth.res_description}</p>
        </div>
      </div>

      {/* 아래쪽 예약 정보 */}
      <div className="detail-bottom">
        <h3 className="reserve-title">예약하기</h3>

        <div className="detail-row" style={{ alignItems: "center", gap: "10px" }}>
          {/* 달력 아이콘: 앞쪽 */}
          <span
            className="emoji-icon"
            style={{ cursor: "pointer" }}
            onClick={() => setShowCalendar(!showCalendar)}
          >
            📅
          </span>

          {/* 선택 날짜 */}
          <span>선택 날짜: {selectedDate} (현재 예약 {reservations[selectedDate]}명)</span>
        </div>

        {/* 달력: showCalendar가 true일 때만 */}
        {showCalendar && (
          <div style={{ marginTop: "10px" }}>
            <Calendar
              onClickDay={handleDateClick}
              tileDisabled={tileDisabled}
              minDetail="month"
              value={new Date(2025, 2, 1)} // 2025년 3월 1일을 기본값으로 설정
              defaultView="month"
            />
          </div>
        )}
        <div className="detail-row">
          <span className="emoji-icon">👥</span>
          <span>인원 수</span>
          <input type="number" min="1" value={people} onChange={(e) => setPeople(e.target.value)} className="people-input" />
        </div>

        <div className="detail-row">
          <span className="emoji-icon">💰</span>
          <span>금액: {booth.price}원</span>
        </div>

        <div className="detail-row">
          <span className="emoji-icon">📍</span>
          <span>위치: {booth.location}</span>
        </div>

        <div className="detail-row">
          <span className="emoji-icon">⏰</span>
          <span>시간: {booth.time}</span>
        </div>

        <button className="reserve-btn" onClick={handleReservation}>예약하기</button>
      </div>

    </div>
  );
};
export default BoothDetail; 
