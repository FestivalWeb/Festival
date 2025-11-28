import React from 'react';

const Reservations = ({ reservations = [], onViewDetail = () => {} }) => {
  return (
    <div className="reservations-list">
      <h3>예약 목록</h3>
      <div className="reservation-cards">
        {reservations.map((r, idx) => (
          <div className="reservation-card" key={r.id}>
            <div className="reservation-index">{idx + 1}</div>
            <div className="reservation-body">
              <div className="reservation-thumb" />
              <div className="reservation-meta">
                <div className="reservation-title">{r.title}</div>
                <div className="reservation-desc">{r.desc}</div>
              </div>
            </div>
            <div className="reservation-actions">
              <button className="btn-outline" onClick={() => onViewDetail(r)}>확인하기</button>
            </div>
          </div>
        ))}
      </div>

      <div className="pager">&nbsp;|&nbsp; &lt; 1 &gt; &nbsp;|&nbsp;</div>
    </div>
  );
};

export default Reservations;
