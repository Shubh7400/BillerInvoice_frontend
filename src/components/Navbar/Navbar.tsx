import React, { useContext } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { BsSun, BsMoon } from "react-icons/bs";
import { AiOutlineLogout } from "react-icons/ai";
import { AuthContext } from "../../states/context/AuthContext/AuthContext";
import { ThemeContext } from "../../states/context/ThemeContext/ThemeContext";
import { CgProfile } from "react-icons/cg";
const Navbar = () => {
  const navigate = useNavigate();
  const { visibility, updateVisibility } = useContext(ThemeContext);
  return (
    <>
      <nav className="h-18 w-[85vw] mb-0 text-colorDarkFont dark:text-colorLightFont     flex justify-end p-4  items-center text-xl sticky top-0 ">
        {/* <div
          className="mx-8 font-poppins-bold text-2xl text-thirdColor hover:text-thirdColorHover cursor-pointer tracking-widest "
          onClick={() => navigate("/")}
        >
          Biller
        </div> */}
        <Link to="/profile" className="text-gray-700 text-[35px] flex items-center gap-[10px] hover:text-blue-500">
          <CgProfile />
          </Link>
        {/* <div className="flex justify-between items-center ">
          <div
            className="mx-8 cursor-pointer "
            onClick={() => updateVisibility()}
          >
            {!visibility ? <BsSun /> : <BsMoon />}
          </div>
        </div> */}
      </nav>
    </>
  );
};

export default Navbar;
