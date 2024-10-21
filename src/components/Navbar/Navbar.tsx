import React, { useContext } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { BsSun, BsMoon } from "react-icons/bs";
import { AiOutlineLogout } from "react-icons/ai";
import { AuthContext } from "../../states/context/AuthContext/AuthContext";
import { ThemeContext } from "../../states/context/ThemeContext/ThemeContext";
import ActionConfirmer from "./ActionConfirmer";
const Navbar = () => {
  const navigate = useNavigate();
  const { visibility, updateVisibility } = useContext(ThemeContext);
  const { isAuth, logoutAdmin } = useContext(AuthContext);
  const handleLogout = (anyString: string) => {
    logoutAdmin();
  };
  return (
    <>
      <nav className="h-18 w-auto mb-0 text-colorDarkFont dark:text-colorLightFont bg-slate-50 dark:bg-slate-800 shadow-lg   dark:shadow-slate-950   flex justify-between p-4  items-center text-xl sticky top-0 z-50 ">
        <div
          className="mx-8 font-poppins-bold text-2xl text-thirdColor hover:text-thirdColorHover cursor-pointer tracking-widest "
          onClick={() => navigate("/")}
        >
          Biller
        </div>
        <div className="flex justify-between items-center ">
          <div
            className="mx-8 cursor-pointer "
            onClick={() => updateVisibility()}
          >
            {!visibility ? <BsSun /> : <BsMoon />}
          </div>
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
      </nav>
      <Outlet />
    </>
  );
};

export default Navbar;
