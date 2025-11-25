import React from "react";
import { useNavigate } from "react-router-dom";
import { boothData } from "../data/boothData";
import "../styles/gallery.css";
import Pagination from "../board/Pagination";


export default function BoothImage() {
  const navigate = useNavigate();

  return (
    <div>
    <div className="booth2-grid">
      {boothData.slice(0, 3).map((booth) => (
        <div
          key={booth.id}
          className="booth2-card"
          onClick={() => navigate(`/booth-images/${booth.id}`)}
          style={{ cursor: "pointer" }}
        >
          <h3>{booth.title}</h3>
          <img src={booth.img} alt={booth.title} />
          <p>{booth.description}</p>
        </div>
      ))}
    </div>

    <Pagination />
    </div>
  );
}
