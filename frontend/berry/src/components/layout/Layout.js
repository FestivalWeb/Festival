import React from "react";
import Header from "../Header";
import Footer from "../Footer";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <>
      <Header />

      <div className="layout-container">
        <Sidebar />

        <div className="layout-content">
          <Outlet />
        </div>
      </div>

      <Footer />
    </>
  );
}
