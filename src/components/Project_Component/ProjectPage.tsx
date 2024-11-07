import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../states/redux/store";
import { ClientType } from "../../types/types";
import { Button, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ProjectTable from "../Home_Components/ProjectSection/ProjectTable";
import error from "../assets/select_client.png"

const ProjectPage = () => {
  const clients = useSelector((state: RootState) => state.allClientsState);
  const selectedClient = useSelector(
    (state: RootState) => state.selectedClientState
  );
  const clientObj: ClientType = selectedClient.data;

  const navigate = useNavigate();
  const materialTheme = useTheme();

  const clientsArr: ClientType[] = clients.data;
  return (
    <div>
      <div className="  w-[80vw]  flex flex-col justify-end items-start ">
        <ProjectTable />
      </div>
    </div>
  );
};

export default ProjectPage;
