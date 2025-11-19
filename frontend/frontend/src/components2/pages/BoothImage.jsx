import React from "react";
import { useNavigate } from "react-router-dom";
import { boothData } from "../data/boothData";
import "../styles/gallery.css";

export default function BoothImage() {
  const navigate = useNavigate();

  return (
    <div className="booth-grid">
      {boothData.slice(0, 3).map((booth) => (
        <div
          key={booth.id}
          className="booth-card"
          onClick={() => navigate(`/booth-images/${booth.id}`)}
          style={{ cursor: "pointer" }}
        >
          <h3>{booth.title}</h3>
          <img src={booth.img} alt={booth.title} />
          <p>{booth.description}</p>
        </div>
      ))}
    </div>
  );
}
