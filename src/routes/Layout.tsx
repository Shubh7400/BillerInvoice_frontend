import React, { useContext } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Sidebar from "../components/SideBar/SideBar";
import { AuthContext } from "../states/context/AuthContext/AuthContext";

const Layout = () => {
  const { isAuth } = useContext(AuthContext);

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
        <div className="flex flex-grow">
      {isAuth ? (
          <Sidebar />
          ) : null}
          <div className="flex-grow p-6">
            <Outlet />
          </div>
        </div>
    </div>
  );
};

export default Layout;
