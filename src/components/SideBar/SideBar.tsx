import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../states/context/AuthContext/AuthContext";
import ActionConfirmer from "./ActionConfirmer";

const Sidebar = () => {
  const { isAuth, logoutAdmin } = useContext(AuthContext);
  const handleLogout = (anyString: string) => {
    logoutAdmin();
  };
  return (
    <aside className="w-[20vw] bg-gray-100 h-full p-4">
      <ul className="space-y-4">
        <li>
          <Link to="/" className="text-gray-700 hover:text-blue-500">
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/clients" className="text-gray-700 hover:text-blue-500">
            Clients
          </Link>
        </li>
        <li>
          <Link to="/projects" className="text-gray-700 hover:text-blue-500">
            Projects
          </Link>
        </li>
        <li>
          <Link to="/invoices" className="text-gray-700 hover:text-blue-500">
            Invoices
          </Link>
        </li>
        <li>
          <Link to="/profile" className="text-gray-700 hover:text-blue-500">
            Profile
          </Link>
        </li>
        <li>
          <div className="text-gray-700 hover:text-blue-500 cursor-pointer">
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
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
