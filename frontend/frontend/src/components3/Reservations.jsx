import React from 'react';

const Reservations = ({ reservations = [], onViewDetail }) => {
  return (
    <div className="reservations-list">
      <h3>예약 목록</h3>
      {reservations.length === 0 ? (
        <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
          예약 내역이 없습니다.
        </div>
      ) : (
        <div className="reservation-cards">
          {reservations.map((r, idx) => (
            <div className="reservation-card" key={r.reservationId || idx}>
              <div className="reservation-index">{idx + 1}</div>
              <div className="reservation-body">
                {/* [중요] 여기도 이미지가 나오도록 img 태그 사용 */}
                <img 
                  src={r.boothImg || "/images/booth1.jpg"} 
                  alt="부스" 
                  className="reservation-thumb"
                  style={{ objectFit: 'cover', width: '72px', height: '56px', borderRadius: '8px', marginRight:'12px' }}
                />
                <div className="reservation-meta">
                  <div className="reservation-title">{r.boothTitle}</div>
                  <div className="reservation-desc">
                    날짜: {r.reserveDate} | 인원: {r.count}명 | 장소: {r.boothLocation}
                  </div>
                </div>
              </div>
              <div className="reservation-actions">
                <button className="btn-outline" onClick={() => onViewDetail(r)}>확인하기</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reservations;