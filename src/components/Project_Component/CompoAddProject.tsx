import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";
import { Alert, LinearProgress, MenuItem, useTheme } from "@mui/material";
import { ProjectType, UpdateProjectDataType } from "../../types/types";
import {
  useAddNewProject,
  useUpdateProject,
} from "../../states/query/Project_queries/projectQueries";
import {
  Grid,
  Typography,
  Select,
  FormControl,
  styled,
  SelectChangeEvent,
} from "@mui/material";
import { queryClient } from "../..";
import { CiEdit } from "react-icons/ci";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import Styles from "./ProjectTable.module.css";

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
  const handleBackButtonClick = () => {
    navigate(-1);
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
                // handleAddProjectClick();
                navigate(
                  !projectTableforClient
                    ? "/add-project"
                    : "/client/add-project"
                );
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
