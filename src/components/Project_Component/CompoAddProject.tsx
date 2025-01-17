import * as React from "react";
import { useDispatch } from "react-redux";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import {  useTheme } from "@mui/material";
import { ProjectType} from "../../types/types";
import {
  Typography
 
} from "@mui/material";
import { CiEdit } from "react-icons/ci";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import Styles from "./ProjectTable.module.css";
import { makeStateNeutralOfSelectedClient } from "../../states/redux/ClientStates/selectedClientSlice";

interface CompoAddProjectProps {
  clientId: string | undefined;
  adminId: string | null;
  forAddProject: boolean;
  projectId?: string | undefined;
  projectToEdit?: ProjectType;
  handleProjectEdit: (projectToEdit: ProjectType) => void;
  searchProjectName?: string;
  projectTableforClient?: boolean;
  setSearchProjectName?: (data: string) => void;
}

export default function CompoAddProject({
  adminId,
  clientId,
  forAddProject,
  projectToEdit,
  handleProjectEdit, 
  searchProjectName,
  projectTableforClient,
  setSearchProjectName,
}: CompoAddProjectProps) {
  // -----------------------------------------------------
  const [toEdit, setToEdit] = useState<boolean>(false);

  // ------------------------------------------------------
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  // --------------------------------------------------------
  const materialTheme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const [workPeriodType, setWorkPeriodType] = useState("hours");
  const [currencyType, setCurrencyType] = useState("rupees");
  const [loading, setLoading] = useState(false);
  const [incompleteError, setIncompleteError] = useState("");
  const [formError, setFormError] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleBackButtonClick = () => {
    navigate(-1);
  };
 
  const handleAddProjectClick = () => {
    if (!projectTableforClient) {
      dispatch(makeStateNeutralOfSelectedClient());
    }
    navigate(
      !projectTableforClient
        ? "/add-project"
        : "/client/add-project"
    );
  };
  return (
    <>
      {forAddProject ? (
        <div className="flex justify-between w-[80vw] mb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={handleBackButtonClick}
              className="text-white text-[20px] bg-[#E4A98A] w-[35px] h-[35px] flex justify-center items-center rounded-[50px]"
            >
              <IoIosArrowBack />
            </button>
            <Typography variant="h5" component="h2" className="text-center">
              {!projectTableforClient ? "PROJECT LIST" : "Client Details"}
            </Typography>
          </div>
          <div className={Styles.search_input}>
            <TextField
              label="Search by Project name"
              type="text"
              variant="outlined"
              value={searchProjectName || ""}
              onChange={(e) =>
                setSearchProjectName && setSearchProjectName(e.target.value)
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "50px",
                },
              }}
            />
            <Button
              disabled={!adminId}
              variant="contained"
              sx={{
                backgroundColor: "#d9a990",
                borderRadius: "20px",
                ":hover": {
                  backgroundColor: "#4a6180",
                },
              }}
              onClick={() => {
                handleAddProjectClick();
              }}
            >
              Add Project
            </Button>
          </div>
        </div>
      ) : (
        <div className="">
          <Button
            disabled={!adminId}
            variant="outlined"
            sx={{
              color: materialTheme.palette.primary.main,
              borderColor: materialTheme.palette.primary.main,
              ":hover": {
                borderColor: materialTheme.palette.secondary.main,
                backgroundColor: materialTheme.palette.secondary.main,
                color: "white",
              },
              cursor: "pointer",
            }}
            onClick={() => {
              if (projectToEdit) {
                handleProjectEdit(projectToEdit);
              }
            }}
          >
            <CiEdit size={25} />
          </Button>
        </div>
      )}
    </>
  );
}
