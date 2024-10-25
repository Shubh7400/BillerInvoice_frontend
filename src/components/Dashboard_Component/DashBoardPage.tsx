import React from "react";
import styles from "./dashboard.module.css";
import clients from "../assets/client.png";
import plane from "../assets/plane.gif";
import { Link } from "react-router-dom";

function DashBoardPage() {
  return (
    <div>
      <div>
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
      </div>
    </div>
  );
}

export default DashBoardPage;
