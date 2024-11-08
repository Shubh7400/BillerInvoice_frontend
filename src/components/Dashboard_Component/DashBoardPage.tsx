import React, { useEffect, useState } from "react";
import styles from "./dashboard.module.css";
import clients from "../assets/client.png";
import plane from "../assets/plane.gif";
import projects from "../assets/project-task.png";
import invoice from "../assets/invoicebg.png";
import { Link } from "react-router-dom";
import { Outlet, useNavigate } from "react-router-dom";
import cubexoLogo from "../assets/cubexo_logo.png";
import MyMapComponent from "./location";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../states/redux/store";
import { getDashBoardData } from "../../states/redux/DashboardStates/dashboardSlice";
import { MdOutlineArrowForwardIos } from "react-icons/md";

const Sidebar = () => {
  const navigate = useNavigate();
};

function DashBoardPage() {
  const dispatch = useDispatch<AppDispatch>();
  const [dashBoardData, setData] = useState({
    companyName: "Cubexo",
  });

  const { loading, data, error } = useSelector(
    (state: RootState) => state.dashboardState
  );
console.log("Dashboard",data);
  useEffect(() => {
    dispatch(getDashBoardData());
  }, [dispatch]);
  

  return (
    <div>
      <div className="flex gap-[30px]">
        <div className={`${styles.animated}`}>
          <div className={`${styles.count_total}`}>
            <div className="w-[75%] text-end">
            <h2>Total Clients</h2>
            <h1>{data.totalClients}</h1>
            </div>
          </div>
          <div>
            <img src={clients} alt="Clients" />
            <div className={`${styles.plane}`}>
              <img src={plane} alt="Plane" />
            </div>
          </div>
          <Link
            to="/clients"
            className="text-[16px] flex items-center gap-[10px]"
          >
            <div className={styles.viewBotton}>View All Clients</div>
          </Link>
          <div className={`${styles.tagline}`}>
            <p>Tracking Every Client,</p>
            <p>Every Time</p>
          </div>
        </div>

        <div className={`${styles.total_projects}`}>
          <div className={`${styles.project_section}`}>
            <div className="w-[70%] text-end">
              <h2>Total Projects</h2>
              <h1>{data.totalProjects}</h1>
            </div>
          </div>
          <div className={`${styles.project}`}>
            <img src={projects} alt="Projects" />
          </div>
          <div className={`${styles.tagline}`}>
            <p>All Projects, One Dashboard for</p>
            <p>Streamlined Success</p>
          </div>
          <Link
            to="/Projects"
            className="text-[16px] flex items-center gap-[10px]"
          >
            <div className={styles.viewproject}>View All Project</div>
          </Link>
        </div>
      </div>

      <div className="flex gap-[40px]">
        <div className={`${styles.invoice}`}>
          <img src={invoice} alt="Invoice" />
          <div className={`${styles.invoice_details}`}>
            <h1>{data.totalInvoices}</h1> 
           
            
              <div className="text-[16px] flex items-center justify-between gap-[10px]"  >
              <h2>Generated Invoice</h2>
              <Link
                to="/invoices"
                className="border border-black rounded-[50px] py-2 px-2  hover:bg-white hover:shadow-[1px 1px 1px #000]"
              >
              <div className="">
                <MdOutlineArrowForwardIos />
              </div>
             
             </Link>
              </div>
          </div>
        </div>

        <div className={`${styles.profile}`}>
          <img
            src={cubexoLogo}
            alt="Company Logo"
            className={styles.companyLogo}
          />
          <p>{dashBoardData.companyName}</p>
          <div>
            <Link
              to="/profile"
              className="text-[16px] text-center mt-2 flex items-center m-auto gap-[10px]"
            >
              <div className="rounded-[50px] bg-white py-2 px-4 w-[100%]">
                See Profile
              </div>
            </Link>
          </div>
        </div>

        <div>
          <MyMapComponent />
        </div>
      </div>
    </div>
  );
}

export default DashBoardPage;
