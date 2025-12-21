import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import api from "../../api/api";
import "../styles/booth.css";

const BoothDetail = () => {
  const { state } = useLocation();
  const { id } = useParams();

  const [booth, setBooth] = useState(state?.booth || null);
  const [loading, setLoading] = useState(!booth);

  // 데이터가 없으면(새로고침 등) 서버에서 가져오기
  useEffect(() => {
    if (!booth) {
      api.get(`/api/booths/${id}`)
        .then(res => {
          setBooth(res.data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [id, booth]);

  // 달력 로직 (DB에는 날짜가 하나뿐이므로 배열로 변환)
  const [activeDates, setActiveDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [people, setPeople] = useState(1);
  const [reservations, setReservations] = useState({});

  useEffect(() => {
    if (booth && booth.eventDate) {
      setActiveDates([booth.eventDate]); // 단일 날짜를 배열로 처리
      setSelectedDate(booth.eventDate);
    }
  }, [booth]);

  if (loading) return <div style={{padding:'100px', textAlign:'center'}}>로딩 중...</div>;
  if (!booth) return <div style={{padding:'100px', textAlign:'center'}}>부스 정보를 찾을 수 없습니다.</div>;

  const getImageUrl = () => {
    if (booth.images && booth.images.length > 0) return `${SERVER_URL}${booth.images[0].storageUri}`;
    return "https://via.placeholder.com/500?text=No+Image";
  };

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
        alert("운영 날짜가 아닙니다.");
    }
  };

  // 예약 버튼 (프론트엔드 전용 알림)
  const handleReservation = () => {
    if (window.confirm(`${selectedDate}에 ${people}명 예약하시겠습니까?`)) {
      alert("예약이 완료되었습니다! (실제 저장은 아직 구현되지 않음)");
    }
  };

  return (
    <div className="detail-container">
      <div className="detail-top">
        <div className="detail-image-wrapper">
          <img src={getImageUrl()} alt={booth.title} className="detail-main-image" />
        </div>
        <div className="detail-info-box">
          <h2 className="detail-title">{booth.title}</h2>
          <p className="detail-desc">{booth.context}</p>
        </div>
      </div>

      <div className="detail-bottom">
        <h3 className="reserve-title">예약하기</h3>
        
        <div className="detail-row" style={{ alignItems: "center", gap: "10px" }}>
          <span className="emoji-icon" style={{ cursor: "pointer" }} onClick={() => setShowCalendar(!showCalendar)}>
            📅
          </span>
          <span>선택 날짜: {selectedDate}</span>
        </div>

        {showCalendar && (
          <div style={{ marginTop: "10px" }}>
            <Calendar
              onClickDay={handleDateClick}
              value={selectedDate ? new Date(selectedDate) : new Date()}
              tileDisabled={({ date }) => !activeDates.includes(formatDate(date))}
            />
          </div>
        )}

        <div className="detail-row">
          <span className="emoji-icon">👥</span>
          <span>인원 수</span>
          <input type="number" min="1" max={booth.maxPerson} value={people} onChange={(e) => setPeople(e.target.value)} className="people-input" />
        </div>

        <div className="detail-row">
            <span className="emoji-icon">💰</span>
            <span>금액: {booth.price.toLocaleString()}원</span>
        </div>
        
        <div className="detail-row">
            <span className="emoji-icon">📍</span>
            <span>위치: {booth.location}</span>
        </div>

        <button className="reserve-btn" onClick={handleReservation}>예약하기</button>
      </div>
    </div>
  );
};
export default BoothDetail;