import React, { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/booth.css";
import { useAuth } from "../../context/AuthContext";

const BoothDetail = () => {
  const { state } = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [booth, setBooth] = useState(state?.booth || null);
  const [people, setPeople] = useState(1);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState("2025-03-27");

  useEffect(() => {
    fetch(`/api/booths/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setBooth(data);
        if (data.eventDate) setSelectedDate(data.eventDate.toString());
      })
      .catch((err) => console.error(err));
  }, [id]);

  if (!booth) return <p style={{padding:"20px"}}>로딩 중...</p>;

  // 날짜 계산 로직
  const getAvailableDates = (startDateStr) => {
    const dates = [];
    const start = new Date(startDateStr || "2025-03-27");
    for (let i = 0; i < 4; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      dates.push(`${y}-${m}-${day}`);
    }
    return dates;
  };
  const activeDates = getAvailableDates(booth.eventDate);

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
    } else {
      alert("예약 가능한 날짜가 아닙니다.");
    }
  };

  const tileDisabled = ({ date, view }) => {
    if (view === "month") return !activeDates.includes(formatDate(date));
    return false;
  };

  const handleReservation = async () => {
    if (!user) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    if (window.confirm(`${selectedDate}에 ${people}명 예약하시겠습니까?`)) {
      try {
        const response = await fetch("/api/reservations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            boothId: booth.id,
            userId: user.id,
            reserveDate: selectedDate,
            count: Number(people)
          })
        });

        if (response.ok) {
          alert("예약 완료!");
          navigate("/booth"); // [수정] 예약 성공 시 목록 페이지로 이동
        } else {
          const msg = await response.text();
          alert("예약 실패: " + msg);
        }
      } catch (err) {
        alert("서버 오류");
      }
    }
  };

  return (
    <div className="detail-container">
      <div className="detail-top">
        <div className="detail-image-wrapper">
          <img src={booth.img || "/images/booth1.jpg"} alt={booth.title} className="detail-main-image" />
        </div>
        <div className="detail-info-box">
          <h2 className="detail-title">{booth.title}</h2>
          <p className="detail-desc" style={{ color: "#e91e63", fontWeight: "bold" }}>
            {/* [수정] 백엔드에서 받은 currentPerson 표시 */}
            📌 참가자: {booth.currentPerson || 0} / {booth.maxPerson}명
          </p>
          <p className="detail-desc">{booth.context}</p>
        </div>
      </div>

      <div className="detail-bottom">
        <h3 className="reserve-title">예약하기</h3>
        <div className="detail-row">
          <span className="emoji-icon" onClick={() => setShowCalendar(!showCalendar)}>📅</span>
          <span>선택 날짜: {selectedDate}</span>
        </div>
        {showCalendar && (
          <div style={{ marginTop: "10px" }}>
            <Calendar
              onClickDay={handleDateClick}
              tileDisabled={tileDisabled}
              value={new Date(selectedDate)}
              formatDay={(locale, date) => date.getDate()}
            />
          </div>
        )}
        <div className="detail-row">
          <span className="emoji-icon">👥</span>
          <span>인원 수</span>
          <input type="number" min="1" max="5" value={people} onChange={(e) => setPeople(e.target.value)} className="people-input" />
        </div>
        <div className="detail-row">
          <span className="emoji-icon">💰</span>
          <span>금액: {(booth.price * people).toLocaleString()}원</span>
        </div>
        <div className="detail-row">
          <span className="emoji-icon">📍</span>
          <span>위치: {booth.location}</span>
        </div>
        <div className="detail-row">
          <span className="emoji-icon">⏰</span>
          {/* [수정] 백엔드에서 받은 time 표시 */}
          <span>시간: {booth.time || "10:00 - 18:00"}</span>
        </div>
        <button className="reserve-btn" onClick={handleReservation}>예약하기</button>
      </div>
    </div>
  );
};

export default BoothDetail;