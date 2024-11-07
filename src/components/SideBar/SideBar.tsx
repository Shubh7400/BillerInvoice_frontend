import React, { useContext } from "react";
import styles from "./sidebar.module.css";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "../../states/context/AuthContext/AuthContext";
import ActionConfirmer from "./ActionConfirmer";
import logo from "../assets/cubexo_logo.png";
import { LuLayoutDashboard } from "react-icons/lu";
import { FaRegUser } from "react-icons/fa";
import { GoProjectSymlink } from "react-icons/go";
import { TbFileInvoice } from "react-icons/tb";
import { CgProfile } from "react-icons/cg";

const Sidebar = () => {
  const { isAuth, logoutAdmin } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = (anyString: string) => {
    logoutAdmin();
  };

  return (
    <aside className="w-[15vw] h-full p-4">
      <div>
        <img
          src={logo}
          alt=""
          onClick={() => navigate("/")}
          className="cursor-pointer m-auto"
        />
      </div>
      <ul className={`${styles.menulist} space-y-4`}>
        <li>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "bg-custom-gradient text-[#fff] rounded-[50px] py-2 flex items-center gap-[10px]"
                : "text-[16px] flex items-center gap-[10px]"
            }
          >
            <LuLayoutDashboard /> Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/clients"
            className={({ isActive }) =>
              isActive
                ? "bg-custom-gradient text-white rounded-[50px]  flex items-center gap-[10px]"
                : "text-[16px] flex items-center gap-[10px]"
            }
            
          >
            <FaRegUser /> Clients
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/projects"
            className={({ isActive }) =>
              isActive
                ? "bg-custom-gradient text-white rounded-[50px]  flex items-center gap-[10px]"
                : "text-[16px] flex items-center gap-[10px]"
            }
          >
            <GoProjectSymlink /> Projects
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/invoices"
            className={({ isActive }) =>
              isActive
                ? "bg-custom-gradient text-white rounded-[50px]  flex items-center gap-[10px]"
                : "text-[16px] flex items-center gap-[10px]"
            }
          >
            <TbFileInvoice /> Invoices
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              isActive
                ? "bg-custom-gradient text-white rounded-[50px]  flex items-center gap-[10px]"
                : "text-[16px] flex items-center gap-[10px]"
            }
          >
            <CgProfile /> Profile
          </NavLink>
        </li>
      </ul>
      <div className="w-100">
        <div className="text-gray-700 hover:text-blue-500 cursor-pointer absolute bottom-0">
          {isAuth ? (
            <div className="cursor-pointer">
              <ActionConfirmer
                actionTag="Logout"
                actionFunction={handleLogout}
                parameter={undefined}
              />
            </div>
          ) : null}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
