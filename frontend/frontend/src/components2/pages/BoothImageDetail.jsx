import React from "react";
import { useParams } from "react-router-dom";
import { boothData } from "../data/boothData";
import "../styles/gallery.css";

export default function BoothImageDetail() {
  const { id } = useParams();
  const booth = boothData.find((item) => item.id === Number(id));

  if (!booth) {
    return <div>존재하지 않는 체험부스입니다.</div>;
  }

  return (
    <div className="booth2-detail">
      <h2>{booth.title}</h2>

      {/* detailImg가 배열인 경우 여러 이미지를 출력 */}
      <div className="booth2-images">
        {Array.isArray(booth.detailImg) ? (
          booth.detailImg.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`${booth.title} 상세 이미지 ${index + 1}`}
              className="booth2-detail-img"
            />
          ))
        ) : (
          <img
            src={booth.img}  // detailImg가 배열이 아니면 기본 이미지 사용
            alt={booth.title}
            className="booth2-detail-img"
          />
        )}
      </div>

      <p>{booth.description}</p>

      {booth.detailText && <p>{booth.detailText}</p>}
    </div>
  );
}
