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
    <div className="booth-detail">
      <h2>{booth.title}</h2>

      <img
        src={booth.detailImg ? booth.detailImg : booth.img}
        alt={booth.title}
        className="booth-detail-img"
      />

      <p>{booth.description}</p>

      {booth.detailText && <p>{booth.detailText}</p>}
    </div>
  );
}
