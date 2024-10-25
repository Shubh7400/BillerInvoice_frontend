import React from "react";
import styles from "./dashboard.module.css";
import clients from "../assets/client.png";
import plane from "../assets/plane.gif";
import projects from "../assets/project-task.png";
import invoice from "../assets/invoice.png";
import { Link } from "react-router-dom";

function DashBoardPage() {
  return (
    <div>
      <div className="flex gap-[30px]">
        <div className={`${styles.animated}`}>
          <div className={`${styles.count_total}`}>
            <h2>Total Clients</h2>
            <h1>385</h1>
          </div>
          <div>
            <img src={clients} alt="" />
            <div className={`${styles.plane}`}>
              <img src={plane} alt="" />
            </div>
          </div>
          <div className={`${styles.viewBotton}`}>
            <Link to="/">View All Clients</Link>
          </div>
          <div className={`${styles.tagline}`}>
            <p>Tracking Every Client,</p>
            <p> Every Time</p>
          </div>
        </div>

        <div className={`${styles.total_projects}`}>
          <div className={`${styles.project_section}`}>
            <h2>Total Projects</h2>
            <h1>6721</h1>
          </div>
          <div className={`${styles.project}`}>
            <img src={projects} alt="" />
          </div>
          <div className={`${styles.tagline}`}>
            <p>All Projects, One Dashboard for</p>
            <p>Streamlined Success</p>
          </div>
        </div>
      </div>

      <div className=" flex gap-[40px]">
        <div className={`${styles.invoice}`}>
          <img src={invoice} alt="" />
          <div className={`${styles.invoice_details}`}>
            <h1>197</h1>
            <h2>Genrated Invoice</h2>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashBoardPage;
