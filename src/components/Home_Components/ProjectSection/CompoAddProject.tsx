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
import { ProjectType, UpdateProjectDataType } from "../../../types/types";
import {
  useAddNewProject,
  useUpdateProject,
} from "../../../states/query/Project_queries/projectQueries";
import { Grid, Typography, Select, FormControl, styled, SelectChangeEvent } from '@mui/material';
import { queryClient } from "../../..";
import { CiEdit } from "react-icons/ci";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import Styles from "./ProjectTable.module.css"

interface CompoAddProjectProps {
  clientId: string | undefined;
  adminId: string | null;
  forAddProject: boolean;
  projectId?: string | undefined;
  projectToEdit?: ProjectType;
  searchProjectName?: string;
  setSearchProjectName?: (data: string) => void;
}

export default function CompoAddProject({
  adminId,
  clientId,
  forAddProject,
  projectToEdit,
  searchProjectName,
  setSearchProjectName,

}: CompoAddProjectProps) {
  // -----------------------------------------------------
  const [toEdit, setToEdit] = useState<boolean>(false);
  const handleToAddClick = () => {
    setToEdit(false);
  };
  const handleToEditClick = () => {
    setToEdit(true);
  };

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
  const [projectData, setProjectData] = useState<ProjectType>({
    projectName: "",
    projectManager: "",
    rate: 0,
    projectPeriod: 0,
    workingPeriod: "00:00",
    workingPeriodType: "hours",
    currencyType: "rupees",
    conversionRate: 1,
    paymentStatus: false,
    adminId: "",
    clientId: "",
  });
  // const [searchProjectName, setSearchProjectName] = useState("");

  const navigate = useNavigate();

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void {
    let { name, value } = e.target;
    setFormError("");
    setIncompleteError("");
    if (
      name === "workingPeriod" &&
      workPeriodType === "days" &&
      parseInt(value) < 0
    ) {
      value = "0";
    }
    if (name === "rate" || name === "conversionRate") {
      let numVal = +value;
      if (numVal < 0) numVal = 1;
      setProjectData((prevData) => ({
        ...prevData,
        [name]: numVal,
      }));
      return;
    }
    if (name === "currencyType" && value === "rupees") {
      setProjectData((prevData) => ({
        ...prevData,
        currencyType: "rupees",
        conversionRate: 1,
      }));
      setCurrencyType(value);
    } else if (name === "currencyType" && value === "dollars") {
      setProjectData((prevData) => ({
        ...prevData,
        currencyType: "dollars",
        conversionRate: 83.25,
      }));
      setCurrencyType(value);
    } else if (name === "currencyType" && value === "pounds") {
      setProjectData((prevData) => ({
        ...prevData,
        currencyType: "pounds",
        conversionRate: 101.35,
      }));
      setCurrencyType(value);
    } else {
      setProjectData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
    if (name === "workingPeriodType") {
      setWorkPeriodType(value);
    }
  }

  function areAllRequiredFieldsFilled(obj: any) {
    if (obj.projectName === "") {
      setFormError("Project name compulsary*");
      return false;
    }
    if (obj.conversionRate === "") {
      setProjectData({ ...obj, conversionRate: 1 });
    }
    if (obj.clientId.length <= 0 || obj.adminId.length <= 0) {
      setFormError("ClientId and AdminId compulsary. Refresh and try again !!");
      return false;
    }
    return true;
  }

  const addProjectMutation = useAddNewProject();

  const handleAddSubmit = (
    e:
      | React.FormEvent<HTMLFormElement>
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    if (areAllRequiredFieldsFilled(projectData)) {
      setLoading(true);
      addProjectMutation.mutate(projectData, {
        onSuccess: () => {
          queryClient.invalidateQueries(["projects", clientId]);
          queryClient.refetchQueries(["projects", clientId]);
          setLoading(false);
          handleClose();
        },
        onError(error) {
          setLoading(false);
          setIncompleteError("Add request error, add again.");
        },
      });
    } else {
      setIncompleteError("Incomplete fields");
    }
  };

  const UpdateProjectMutationHandler = useUpdateProject(
    projectData._id,
    projectData.clientId
  );

  const handleEditSubmit = (
    e:
      | React.FormEvent<HTMLFormElement>
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (areAllRequiredFieldsFilled(projectData)) {
      setLoading(true);
      UpdateProjectMutationHandler.mutate(
        {
          projectId: projectData._id!,
          updatedProjectData: projectData as UpdateProjectDataType,
        },
        {
          onSuccess: () => {
            queryClient.refetchQueries(["projects", clientId]);
            setLoading(false);
            enqueueSnackbar("Project edited successfully.", {
              variant: "success",
            });

            handleClose();
          },
          onError(error) {
            setLoading(false);
            enqueueSnackbar("Error in updating project. Try again! ", {
              variant: "error",
            });
            setIncompleteError("Add request error, add again.");
          },
        }
      );
    } else {
      setIncompleteError("Incomplete fields");
    }
  };

  React.useEffect(() => {
    if (forAddProject && !toEdit) {
      setProjectData({
        projectName: "",
        projectManager: "",
        rate: 0,
        projectPeriod: 0,
        workingPeriod: "00:00",
        workingPeriodType: "hours",
        currencyType: "rupees",
        conversionRate: 1,
        paymentStatus: false,
        adminId: adminId ? adminId : "",
        clientId: clientId ? clientId : "",
      });
    }
    if (!forAddProject && toEdit && projectToEdit) {
      let newProjectToEdit = { ...projectToEdit };
      delete newProjectToEdit.amount;
      setProjectData(newProjectToEdit);
    }
  }, [toEdit, forAddProject, projectToEdit, clientId, adminId]);

  React.useEffect(() => {
    if (clientId) {
      setProjectData({ ...projectData, clientId });
    }
    if (adminId) {
      setProjectData({ ...projectData, adminId });
    }
  }, [clientId, adminId]);

  const handleAddProjectClick = () => {
    handleToAddClick();
    // handleClickOpen();
  };
  const handleEditProjectClick = () => {
    handleToEditClick();
    // handleClickOpen();
  };
  const handleBackButtonClick = () => {
    navigate(-1);
  };

  return (
    <>
      {forAddProject ? (
        <div className="flex justify-between w-[80vw]  pr-2  mb-4">
          <div className='flex items-center gap-2'>
          <button
              onClick={handleBackButtonClick}
              className="text-white text-[20px] bg-[#E4A98A] w-[35px] h-[35px] flex justify-center items-center rounded-[50px]"
            >
              <IoIosArrowBack />
          </button>
          <Typography variant="h5" component="h2" className='text-center'>
            PROJECT LIST
          </Typography>
          
        </div>
        <div className={Styles.search_input}>
          <TextField
            
            label="Search by Project name"
            type="text"
            variant="outlined"
            value={searchProjectName || ""}
            onChange={(e) => setSearchProjectName && setSearchProjectName(e.target.value)}

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
              handleAddProjectClick()
              navigate("/add-project")
            }
            }
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
              handleEditProjectClick();
              navigate("/edit-project")
            }
            }
          >
            <CiEdit size={25} />
          </Button>
        </div >
      )
      }
      <div>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>
            {forAddProject ? "Add Project" : "Edit Project"}
          </DialogTitle>
          ;
          {incompleteError.length > 0 ? (
            <Alert severity="error"> {incompleteError}</Alert>
          ) : null}
          {formError.length > 0 ? (
            <Alert severity="error"> {formError}</Alert>
          ) : null}
          {loading ? <LinearProgress /> : null}
          <DialogContent>
            <form onSubmit={handleAddSubmit}>
              <TextField
                autoFocus
                margin="dense"
                id="projectName"
                label="Project Name"
                type="text"
                fullWidth
                variant="standard"
                name="projectName"
                value={projectData.projectName}
                onChange={handleChange}
                required
              />

              <TextField
                margin="dense"
                id="projectManager"
                label="Project Manager"
                type="text"
                fullWidth
                variant="standard"
                name="projectManager"
                value={projectData.projectManager}
                onChange={handleChange}
              />
              <div className="flex ">
                <TextField
                  select
                  margin="dense"
                  id="currencyType"
                  label="Rate/Currency type"
                  fullWidth
                  variant="standard"
                  name="currencyType"
                  value={projectData.currencyType || ""}
                  onChange={handleChange}
                >
                  <MenuItem value="rupees">&#x20B9; (rupee)</MenuItem>
                  <MenuItem value="dollars">$ (dollar)</MenuItem>
                  <MenuItem value="pounds">&#163; (pounds)</MenuItem>
                </TextField>

                <TextField
                  select
                  margin="dense"
                  id="workingPeriodType"
                  label="Rate/Work based on"
                  fullWidth
                  variant="standard"
                  name="workingPeriodType"
                  value={projectData.workingPeriodType || ""}
                  onChange={handleChange}
                >
                  <MenuItem value="hours">Hours</MenuItem>
                  <MenuItem value="days">Months</MenuItem>
                </TextField>
              </div>
              <TextField
                margin="dense"
                id="rate"
                label={`Rate (${currencyType}/${workPeriodType === "days" ? "months" : "hours"
                  })`}
                type="number"
                fullWidth
                variant="standard"
                name="rate"
                value={projectData.rate === 0 ? "" : projectData.rate}
                onChange={handleChange}
              />
              {workPeriodType === "days" ? (
                <TextField
                  margin="dense"
                  id="projectPeriod"
                  label={`Total project period in ${workPeriodType}`}
                  type="number"
                  fullWidth
                  variant="standard"
                  name="projectPeriod"
                  value={projectData.projectPeriod}
                  onChange={handleChange}
                />
              ) : null}
              {workPeriodType === "hours" ? (
                <>
                  <label className=" text-[12px] text-sky-700">
                    {`Actual working in ${workPeriodType}`}
                  </label>

                  <TextField
                    margin="dense"
                    id="periodFrom"
                    type="time" // Set the type to "time" for HH:MM input
                    fullWidth
                    variant="standard"
                    name="workingPeriod"
                    value={projectData.workingPeriod}
                    onChange={handleChange}
                    required
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      inputProps: {
                        step: 300, 
                      },
                    }}
                  />
                </>
              ) : (
                <TextField
                  margin="dense"
                  id="workingPeriod"
                  label={`Actual working in ${workPeriodType}`}
                  type="number"
                  fullWidth
                  variant="standard"
                  name="workingPeriod"
                  value={projectData.workingPeriod}
                  onChange={handleChange}
                />
              )}
              <label className=" text-[12px] text-sky-700">
                Conversion rate*
              </label>
              <TextField
                margin="dense"
                id="conversionRate"
                type="number"
                fullWidth
                variant="standard"
                name="conversionRate"
                value={
                  projectData.conversionRate <= 0
                    ? ""
                    : projectData.conversionRate
                }
                onChange={handleChange}
                required
              />
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            {!toEdit ? (
              <Button onClick={(e) => handleAddSubmit(e)}>Add Project</Button>
            ) : (
              <Button onClick={(e) => handleEditSubmit(e)}>Edit Project</Button>
            )}
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
}
