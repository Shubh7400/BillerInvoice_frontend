import { useSelector } from "react-redux";
import {  RootState } from "../../states/redux/store";
import { ClientType } from "../../types/types";
import { useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ProjectTable from "./ProjectTable";

const ProjectPage = ({
  projectTableforClient,
}: {
  projectTableforClient: boolean;
}) => {
  const clients = useSelector((state: RootState) => state.allClientsState);
  const selectedClient = useSelector(
    (state: RootState) => state.selectedClientState
  );
  const clientObj: ClientType = selectedClient.data;

  const navigate = useNavigate();
  const materialTheme = useTheme();

  return (
    <div>
      <div className="  w-[80vw]  flex flex-col justify-end items-start ">
        <ProjectTable projectTableforClient={projectTableforClient} />
      </div>
    </div>
  );
};

export default ProjectPage;
