import React, { useEffect, useRef } from 'react';

const KakaoMap = ({ address, placeName }) => {
  const mapContainer = useRef(null);

  useEffect(() => {
    const { kakao } = window;
    if (!kakao || !kakao.maps) return;

    const mapOption = {
      center: new kakao.maps.LatLng(36.1872, 127.0987),
      level: 3,
    };
    const map = new kakao.maps.Map(mapContainer.current, mapOption);

    const geocoder = new kakao.maps.services.Geocoder();

    geocoder.addressSearch(address, function(result, status) {
      if (status === kakao.maps.services.Status.OK) {
        const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
        const lat = result[0].y;
        const lng = result[0].x;

        const marker = new kakao.maps.Marker({
          map: map,
          position: coords
        });

        // ▼▼▼ [수정] 길찾기 버튼이 있는 말풍선으로 변경 ▼▼▼
        const content = `
          <div style="padding:10px;min-width:150px;text-align:center;border-radius:4px;">
            <div style="font-weight:bold; margin-bottom:5px;">${placeName}</div>
            <a href="https://map.kakao.com/link/to/${placeName},${lat},${lng}" 
               style="color:blue; text-decoration:none; font-size:13px; font-weight:bold;" 
               target="_blank">
               🚗 길찾기 (카카오맵)
            </a>
          </div>
        `;

        const infowindow = new kakao.maps.InfoWindow({
            content: content
        });
        infowindow.open(map, marker);
        // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

        map.setCenter(coords);
      }
    });
  }, [address, placeName]);

  return (
    <div 
      ref={mapContainer} 
      style={{ width: '100%', height: '100%', borderRadius: '12px' }} 
    />
  );
};

export default KakaoMap;