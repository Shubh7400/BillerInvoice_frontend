import React, { useContext, useState, useEffect } from "react";
import { WindowWidthContext } from "../../states/context/WindowWidthContext/WindowWidthContext";
import { ThemeContext } from "../../states/context/ThemeContext/ThemeContext";
import SelectClient from "../../components/Client_Component/ClientPageHeader";
import ProjectTable from "../../components/Project_Component/ProjectTable";
import BillAmount from "../../components/Invoice_Component/BillAmount";
const Home = () => {
  return (
    <main className=" bg-slate-200 dark:bg-slate-700 min-h-[150vh] text-colorDarkFont dark:text-colorLightFont overflow-x-hidden ">
      <SelectClient />
      <ProjectTable projectTableforClient={false} />
      <BillAmount />
    </main>
  );
};

export default Home;
