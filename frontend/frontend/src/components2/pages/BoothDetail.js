import React, { useState } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import { FaRegCalendarAlt } from "react-icons/fa";
// npm install react-icons 로 icon 설치 후 캘린더아이콘 사용 가능함.

const BoothDetail = ({ booth }) => {
  // 활성 날짜 (21, 22, 23일)
  const activeDates = ["2025-11-21", "2025-11-22", "2025-11-23"];

  const [selectedDate, setSelectedDate] = useState(activeDates[0]);
  const [people, setPeople] = useState(1);
  const [reservations, setReservations] = useState({
    "2025-11-21": 0,
    "2025-11-22": 0,
    "2025-11-23": 0,
  });

  const [showCalendar, setShowCalendar] = useState(false);

  // 날짜 포맷 함수
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // 날짜 클릭
  const handleDateClick = (date) => {
    const formatted = formatDate(date);
    if (activeDates.includes(formatted)) {
      setSelectedDate(formatted);
      setShowCalendar(false);
    }
  };

  // 활성화되지 않은 날짜 비활성화
  const tileDisabled = ({ date, view }) => {
    if (view === "month") {
      const formatted = formatDate(date);
      return !activeDates.includes(formatted);
    }
    return false;
  };

  // 예약
  const handleReservation = () => {
    if (window.confirm(`${people}명 예약하시겠습니까?`)) {
      setReservations((prev) => ({
        ...prev,
        [selectedDate]: prev[selectedDate] + parseInt(people),
      }));
      alert("예약 완료!");
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "50px auto", padding: "20px" }}>
      <img
        src={booth.image}
        alt={booth.title}
        style={{ width: "100%", borderRadius: "10px" }}
      />
      <h2>{booth.title}</h2>
      <p>{booth.description}</p>

      <div style={{ marginTop: "20px" }}>
        <h3>예약하기</h3>

        {/* 달력 아이콘 */}
        <div style={{ marginBottom: "10px" }}>
          <FaRegCalendarAlt
            size={28}
            onClick={() => setShowCalendar(!showCalendar)}
            style={{ cursor: "pointer", color: "#007BFF" }}
          />
        </div>

        {/* 달력 */}
        {showCalendar && (
          <Calendar
            onClickDay={handleDateClick}
            tileDisabled={tileDisabled}
            minDetail="month"
          />
        )}

        {/* 선택한 날짜 표시 */}
        <p style={{ marginTop: "10px", fontWeight: "bold" }}>
          선택한 날짜: {selectedDate} (예약: {reservations[selectedDate]}명)
        </p>

        {/* 인원 수 입력 */}
        <label>
          인원 수:
          <input
            type="number"
            min="1"
            value={people}
            onChange={(e) => setPeople(e.target.value)}
            style={{ marginLeft: "10px" }}
          />
        </label>

        {/* 예약 버튼 */}
        <button
          onClick={handleReservation}
          style={{
            display: "block",
            marginTop: "20px",
            padding: "10px 20px",
            borderRadius: "5px",
            backgroundColor: "#007BFF",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          예약하기
        </button>
      </div>
    </div>
  );
};

export default BoothDetail;
