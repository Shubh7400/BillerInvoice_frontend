import React, { useContext } from "react";
import styles from "./sidebar.module.css";
import { Link } from "react-router-dom";
import { Outlet, useNavigate } from "react-router-dom";
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
    <aside className="w-[15vw]  h-full p-4">
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
          <Link to="/" className=" text-[16px] flex items-center gap-[10px]">
            <LuLayoutDashboard /> Dashboard
          </Link>
        </li>
        <li>
          <Link
            to="/clients"
            className=" text-[16px] flex items-center gap-[10px] "
          >
            <FaRegUser /> Clients
          </Link>
        </li>
        <li>
          <Link
            to="/projects"
            className=" text-[16px] flex items-center gap-[10px]"
          >
            <GoProjectSymlink /> Projects
          </Link>
        </li>
        <li>
          <Link
            to="/invoices"
            className=" text-[16px] flex items-center gap-[10px] "
          >
            <TbFileInvoice /> Invoices
          </Link>
        </li>
        <li>
          <Link
            to="/profile"
            className=" text-[16px] flex items-center gap-[10px] "
          >
            <CgProfile /> Profile
          </Link>
        </li>
      </ul>
      <div className=" w-100">
        <div className="text-gray-700 hover:text-blue-500 cursor-pointer absolute bottom-[0]">
          {isAuth ? (
            <div className="cursor-pointer">
              {
                <ActionConfirmer
                  actionTag="Logout"
                  actionFunction={handleLogout}
                  parameter={undefined}
                />
              }
            </div>
          ) : null}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
