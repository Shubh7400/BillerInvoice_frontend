import React, { useEffect, useState } from "react";
import styles from "./dashboard.module.css";
import clients from "../assets/client.png";
import plane from "../assets/plane.gif";
import projects from "../assets/project-task.png";
import invoice from "../assets/invoicebg.png";
import { Link } from "react-router-dom";
import { Outlet, useNavigate } from "react-router-dom";
import cubexoLogo from "../../utils/images/cubexoLogo.webp";
import MyMapComponent from "./location";

const Sidebar = () => {
  const navigate = useNavigate();
};

function DashBoardPage() {
  const [data, setData] = useState({
    totalClients: 320,
    totalProjects: 4451,
    invoicesGenerated:420,
    companyName: "Cubexo",
  });

  useEffect(() => {
    // Fetch data from API
    const fetchData = async () => {
      try {
        const response = await fetch("https://api.example.com/dashboard"); // Replace with your API endpoint
        const result = await response.json();
        setData({
          totalClients: result.totalClients,
          totalProjects: result.totalProjects,
          invoicesGenerated: result.invoicesGenerated,
          companyName: result.companyName,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <div className="flex gap-[30px]">
        <div className={`${styles.animated}`}>
          <div className={`${styles.count_total}`}>
            <h2>Total Clients</h2>
            <h1>{data.totalClients}</h1>
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
            <h2>Total Projects</h2>
            <h1>{data.totalProjects}</h1>
          </div>
          <div className={`${styles.project}`}>
            <img src={projects} alt="Projects" />
          </div>
          <div className={`${styles.tagline}`}>
            <p>All Projects, One Dashboard for</p>
            <p>Streamlined Success</p>
          </div>
        </div>
      </div>

      <div className="flex gap-[40px]">
        <div className={`${styles.invoice}`}>
          <img src={invoice} alt="Invoice" />
          <div className={`${styles.invoice_details}`}>
            <h1>{data.invoicesGenerated}</h1>
            <h2>Generated Invoice</h2>
          </div>
        </div>

        <div className={`${styles.profile}`}>
          <img
            src={cubexoLogo}
            alt="Company Logo"
            className={styles.companyLogo}
          />
          <p>{data.companyName}</p>
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
