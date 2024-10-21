import React, { useContext, useState, useEffect } from "react";
import { WindowWidthContext } from "../../states/context/WindowWidthContext/WindowWidthContext";
import { ThemeContext } from "../../states/context/ThemeContext/ThemeContext";
import SelectClient from "../../components/Home_Components/ClientSection/SelectClient";
import ProjectTable from "../../components/Home_Components/ProjectSection/ProjectTable";
import BillAmount from "../../components/Home_Components/InvoiceSection/BillAmount";
const Home = () => {
  return (
    <main className=" bg-slate-200 dark:bg-slate-700 min-h-[150vh] text-colorDarkFont dark:text-colorLightFont overflow-x-hidden ">
      <SelectClient />
      <ProjectTable />
      <BillAmount />
    </main>
  );
};

export default Home;
