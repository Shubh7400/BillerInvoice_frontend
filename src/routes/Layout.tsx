import React, { useContext } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Sidebar from "../components/SideBar/SideBar";
import { AuthContext } from "../states/context/AuthContext/AuthContext";
import bg_image from "../components/assets/home_bg.png";
import Styles from "./Layout.module.css";

const Layout = () => {
  const { isAuth } = useContext(AuthContext);

  return (
    <div
      className="flex h-screen "
      style={{
        backgroundImage:`url(${bg_image})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        overflow: "hidden",
      }}
    >
      <Sidebar />
      <div className="flex flex-col ">
        <Navbar />
        <div className={`${Styles.table_scroll} flex-grow p-6 rounded-[30px] bg-[#fff] `}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
