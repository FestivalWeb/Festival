import React, { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/booth.css";
import api from "../../api/api"; // api 모듈 사용

const BoothDetail = () => {
  const { state } = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();

  const [booth, setBooth] = useState(state?.booth || null);
  const [people, setPeople] = useState(1);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState("2025-03-27");

  useEffect(() => {
    api.get(`/api/booths/${id}`)
    .then((res) => {
       const data = res.data; 
       setBooth(data);
       if (data.eventDate) setSelectedDate(data.eventDate.toString());
    })
    .catch((err) => console.error(err));
  }, [id]);

  // [핵심 추가] 이미지 URL 생성 함수 (메인 페이지와 동일 로직)
  const getImageUrl = (boothData) => {
    if (!boothData) return "/images/booth1.jpg";

    // 1순위: booth.img (대표 이미지)
    if (boothData.img) {
      if (boothData.img.startsWith("http")) {
        return boothData.img;
      }
      return `http://localhost:8080${boothData.img}`;
    }

    // 2순위: booth.images (첨부 파일 목록)
    if (boothData.images && boothData.images.length > 0) {
      const uri = boothData.images[0].storageUri || boothData.images[0].url;
      return `http://localhost:8080${uri}`;
    }

    // 3순위: 기본 이미지
    return "/images/booth1.jpg";
  };

  if (!booth) return <p style={{padding:"20px"}}>로딩 중...</p>;

  // --- 날짜 계산 로직 ---
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

  // 남은 자리 계산 및 최대 선택 인원 제한
  const remainingSeats = booth.maxPerson - (booth.currentPerson || 0);
  const maxSelectable = remainingSeats > 0 ? Math.min(5, remainingSeats) : 0;

  const handleReservation = async () => {
    let loginUserId = localStorage.getItem("userId"); 

    // 로그인 체크
    if (!loginUserId || loginUserId === "null" || loginUserId === "undefined") {
        localStorage.removeItem("userId"); 
        if(window.confirm("로그인이 필요한 서비스입니다.\n로그인 페이지로 이동하시겠습니까?")) {
            navigate("/login");
        }
        return; 
    }

    if (people > maxSelectable) {
        alert(`예약 가능한 최대 인원은 ${maxSelectable}명입니다.`);
        return;
    }

    if (window.confirm(`${selectedDate}에 ${people}명 예약하시겠습니까?`)) {
      try {
        const response = await api.post("/api/reservations", {
            boothId: booth.id,
            userId: loginUserId,
            reserveDate: selectedDate,
            count: Number(people)
        });

        if (response.status === 200) { 
            alert("예약 완료!");
            navigate("/booth");
        }
      } catch (err) {
          const msg = err.response?.data || "예약 실패";
          alert("오류: " + msg);
      }
    }
  };

  return (
    <div className="detail-container">
      <div className="detail-top">
        <div className="detail-image-wrapper">
          {/* [수정] getImageUrl 함수 사용 및 엑박 방지 */}
          <img 
            src={getImageUrl(booth)} 
            alt={booth.title} 
            className="detail-main-image" 
            onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/images/booth1.jpg";
            }}
          />
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
          
          <input
            type="number"
            min="1"
            max={maxSelectable}
            step="1"
            value={people}
            onChange={(e) => {
                let val = Number(e.target.value);
                if (val > maxSelectable) val = maxSelectable; 
                if (val < 1 && e.target.value !== '') val = 1; 
                setPeople(val);
            }}
            onKeyDown={(e) => {
              if (e.key === '.' || e.key === '-' || e.key === 'e') {
                e.preventDefault();
              }
            }}
            placeholder="인원 수"
            className="detail-input"
            style={{ width: '60px', marginLeft: '10px', padding: '5px' }}
          />

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