import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { boothData } from "../data/boothData";
import "../styles/gallery.css";
import Pagination from "../board/Pagination";

export default function BoothImage() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; // 한 페이지당 부스 수

  const totalPages = Math.ceil(boothData.length / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = boothData.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div>
      <div className="booth2-grid">
        {currentItems.map((booth) => (
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

      <Pagination
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
}
