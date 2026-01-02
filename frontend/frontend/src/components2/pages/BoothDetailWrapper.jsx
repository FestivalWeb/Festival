import React from "react";
import { useLocation, useParams } from "react-router-dom";
import BoothDetail from "./BoothDetail";
import { boothResData } from "../data/boothResData";

// 메인화면에서 체험부스 카드누르면 상세페이지로 넘어가도록 할 때 정보 넘겨받아서 BoothDetail페이지 보여줌
const BoothDetailWrapper = () => {
  const location = useLocation();
  const { id } = useParams();

   const boothFromState = location.state?.booth;
  const booth = location.state?.booth ?? BoothResData.find(b => b.id === Number(id));

  if (!booth) return <p>부스를 찾을 수 없습니다.</p>;

  return <BoothDetail booth={booth} />;
};

export default BoothDetailWrapper;
