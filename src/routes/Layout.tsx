import React, { useContext } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Sidebar from "../components/SideBar/SideBar";
import { AuthContext } from "../states/context/AuthContext/AuthContext";

const Layout = () => {
  const { isAuth } = useContext(AuthContext);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col ">
        <Navbar />
        <div className="flex-grow p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
