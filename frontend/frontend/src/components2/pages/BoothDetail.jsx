import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import api from "../../api/api";
import "../styles/booth.css";

const SERVER_URL = "http://localhost:8080";

const BoothDetail = () => {
  const { state } = useLocation();
  const { id } = useParams();

  const [booth, setBooth] = useState(state?.booth || null);
  const [loading, setLoading] = useState(!booth);
  
  // [유지] 현재 보고 있는 이미지 번호
  const [currentIndex, setCurrentIndex] = useState(0);

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

  const [activeDates, setActiveDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [people, setPeople] = useState(1);

  useEffect(() => {
    if (booth && booth.eventDate) {
      setActiveDates([booth.eventDate]);
      setSelectedDate(booth.eventDate);
    }
  }, [booth]);

  if (loading) return <div style={{padding:'100px', textAlign:'center'}}>로딩 중...</div>;
  if (!booth) return <div style={{padding:'100px', textAlign:'center'}}>부스 정보를 찾을 수 없습니다.</div>;

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

  const handleReservation = () => {
    if (window.confirm(`${selectedDate}에 ${people}명 예약하시겠습니까?`)) {
      alert("예약 완료 (구현 중)");
    }
  };

  const hasImages = booth.images && booth.images.length > 0;
  const currentImageUrl = hasImages 
    ? `${SERVER_URL}${booth.images[currentIndex].storageUri}`
    : "https://via.placeholder.com/500?text=No+Image";

  return (
    <div className="detail-container">
      <div className="detail-top">
        
        {/* ▼▼▼ [수정] 이미지 영역 전체 ▼▼▼ */}
        <div className="detail-image-section" style={{ width: '100%' }}>
          
          {/* 1. 메인 큰 이미지 (사진 안 짤리게 contain 적용) */}
          <div style={{ 
              width: '100%', height: '400px', 
              backgroundColor: '#fff', // 배경 흰색으로
              borderRadius: '10px', overflow: 'hidden', 
              border: '1px solid #eee',
              display: 'flex', justifyContent: 'center', alignItems: 'center' // 중앙 정렬
            }}>
            <img 
              src={currentImageUrl} 
              alt="부스 메인 이미지" 
              // [핵심] objectFit: 'contain'으로 변경 -> 사진 안 짤림
              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} 
            />
          </div>

          {/* 2. 하단 썸네일 리스트 (버튼 대신 이거 클릭해서 이동) */}
          {hasImages && booth.images.length > 1 && (
            <div style={{ 
              display: 'flex', gap: '10px', marginTop: '15px', 
              overflowX: 'auto', paddingBottom: '10px' // 가로 스크롤 가능하게
            }}>
              {booth.images.map((img, idx) => (
                <img 
                  key={idx}
                  src={`${SERVER_URL}${img.storageUri}`} 
                  alt={`썸네일-${idx}`}
                  // 클릭하면 해당 이미지로 메인 사진 변경
                  onClick={() => setCurrentIndex(idx)}
                  style={{ 
                    width: '80px', height: '80px', 
                    objectFit: 'cover', // 썸네일은 꽉 차게
                    borderRadius: '5px', 
                    cursor: 'pointer',
                    // 현재 선택된 사진은 테두리로 표시
                    border: idx === currentIndex ? '3px solid #007bff' : '1px solid #ddd',
                    opacity: idx === currentIndex ? 1 : 0.7 // 선택 안 된 건 약간 흐리게
                  }}
                />
              ))}
            </div>
          )}
        </div>
        {/* ▲▲▲ [끝] 이미지 영역 ▲▲▲ */}

        <div className="detail-info-box">
          <h2 className="detail-title">{booth.title}</h2>
          <p className="detail-desc">{booth.context}</p>
        </div>
      </div>

      <div className="detail-bottom">
        {/* ... (예약하기 부분은 기존과 동일) ... */}
        <h3 className="reserve-title">예약하기</h3>
        <div className="detail-row" style={{ alignItems: "center", gap: "10px" }}>
          <span className="emoji-icon" style={{ cursor: "pointer" }} onClick={() => setShowCalendar(!showCalendar)}>📅</span>
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
        <div className="detail-row"><span className="emoji-icon">💰</span><span>금액: {booth.price.toLocaleString()}원</span></div>
        <div className="detail-row"><span className="emoji-icon">📍</span><span>위치: {booth.location}</span></div>
        <button className="reserve-btn" onClick={handleReservation}>예약하기</button>
      </div>
    </div>
  );
};

export default BoothDetail;