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
  const { user } = useAuth(); // (필요 없다면 지워도 됨, 아래에서 localStorage 씀)

  const [booth, setBooth] = useState(state?.booth || null);
  const [people, setPeople] = useState(1); // [중요] 변수명이 people 입니다.
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

  // [수정] 남은 자리 계산 및 최대 선택 인원 제한
  const remainingSeats = booth.maxPerson - (booth.currentPerson || 0);
  const maxSelectable = remainingSeats > 0 ? Math.min(5, remainingSeats) : 0;

  const handleReservation = async () => {
    const loginUserId = localStorage.getItem("userId"); 

    if (!loginUserId) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    if (people > maxSelectable) {
        alert(`예약 가능한 최대 인원은 ${maxSelectable}명입니다.`);
        return;
    }

    if (window.confirm(`${selectedDate}에 ${people}명 예약하시겠습니까?`)) {
      try {
        const response = await fetch("/api/reservations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            boothId: booth.id,
            userId: loginUserId,
            reserveDate: selectedDate,
            count: Number(people)
          })
        });

        if (response.ok) {
          alert("예약 완료!");
          navigate("/booth"); 
        } else {
          const msg = await response.text(); 
          alert("예약 실패: " + msg);
        }
      } catch (err) {
        console.error(err);
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
            📌 참가자: {booth.currentPerson || 0} / {booth.maxPerson}명
            {remainingSeats <= 0 && <span style={{color:'red', marginLeft:'10px'}}>(마감)</span>}
          </p>
          <p className="detail-desc">{booth.context}</p>
        </div>
      </div>

      <div className="detail-bottom">
        <h3 className="reserve-title">예약하기</h3>
        <div className="detail-row">
          <span className="emoji-icon" onClick={() => setShowCalendar(!showCalendar)} style={{cursor:'pointer'}}>📅</span>
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
          
          {/* ▼▼▼ [수정된 부분] 변수명을 people로 맞췄습니다! ▼▼▼ */}
          <input
            type="number"
            min="1"
            max={maxSelectable} // HTML 상에서도 최대값 제한
            step="1"
            value={people} // count -> people 로 수정
            onChange={(e) => {
                // onChangeCount -> 직접 함수 작성
                let val = Number(e.target.value);
                if (val > maxSelectable) val = maxSelectable; // 남은 자리보다 많이 입력하면 강제 조정
                if (val < 1 && e.target.value !== '') val = 1; // 1보다 작으면 1로 (비어있을 때 제외)
                setPeople(val);
            }}
            onKeyDown={(e) => {
              // 소수점, 마이너스, 지수 입력 차단
              if (e.key === '.' || e.key === '-' || e.key === 'e') {
                e.preventDefault();
              }
            }}
            placeholder="인원 수"
            className="detail-input" // 클래스 이름 예시
            style={{ width: '60px', marginLeft: '10px', padding: '5px' }} // 스타일 살짝 추가
          />
          {/* ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲ */}

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
          <span>시간: {booth.time || "10:00 - 18:00"}</span>
        </div>
        
        <button 
            className="reserve-btn" 
            onClick={handleReservation}
            disabled={remainingSeats <= 0}
            style={{ backgroundColor: remainingSeats <= 0 ? "#ccc" : "" }}
        >
            {remainingSeats <= 0 ? "예약 마감" : "예약하기"}
        </button>
      </div>
    </div>
  );
};

export default BoothDetail;