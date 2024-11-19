import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";
import { Autocomplete} from '@mui/material';
import { Alert, LinearProgress, MenuItem, useTheme } from "@mui/material";
import {
  ClientType,
  ProjectType,
  UpdateProjectDataType,
} from "../../types/types";
import {
  useAddNewProject,
  useUpdateProject,
} from "../../states/query/Project_queries/projectQueries";
import { queryClient } from "../..";
import { CiEdit } from "react-icons/ci";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { IoChevronBackSharp } from "react-icons/io5";
import { useSelector } from "react-redux";
import { RootState } from "../../states/redux/store";
import Select from "react-select";
import { InputActionMeta } from "react-select";
import axios from "axios"; 

function AddProjectPage({
  adminId,
  clientId,
  forAddProject,
  projectToEdit,
  clientAddProject,
}: {
  clientId: string | undefined;
  adminId: string | null;
  forAddProject: boolean;
  projectId?: string | undefined;
  clientAddProject?: boolean;
  projectToEdit?: ProjectType;
}) {
  const [toEdit, setToEdit] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState(false);
  const [selectClient, setSelectClient] = useState<ClientType>();

  const {
    loading: clientsLoading,
    data: clients,
    error: clientsError,
  } = useSelector((state: RootState) => state.allClientsState);

  const clientsArr: ClientType[] = clients.map((client) => ({
    _id: client._id,
    clientName: client.clientName,
    email: client.email,
    pancardNo: client.pancardNo,
    address: {
      street: client.address.street,
      city: client.address.city,
      state: client.address.state,
      country: client.address.country,
      postalCode: client.address.postalCode,
    },
    gistin: client.gistin,
    user: client.user,
    sameState: client.sameState,
  }));

  const handleToAddClick = () => {
    setToEdit(false);
  };
  const handleToEditClick = () => {
    setToEdit(true);
  };

  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const materialTheme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const [workPeriodType, setWorkPeriodType] = useState("hours");
  const [currencyType, setCurrencyType] = useState("rupees");
  const [loading, setLoading] = useState(false);
  const [incompleteError, setIncompleteError] = useState("");
  const [formError, setFormError] = useState("");
  const [conversionRate, setConversionRate] = useState(1);
  const [loadingRate, setLoadingRate] = useState(false);
  const [rateError, setRateError] = useState("");
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
  const fetchExchangeRate = async () => {
    setLoadingRate(true);
    setRateError("");
    try {
      const response = await axios.get(
        `https://api.exchangerate-api.com/v4/latest/USD` // Replace with your API endpoint
      );

      const rates = response.data.rates;
      if (currencyType === "dollars") {
        setConversionRate(rates.INR); // INR equivalent of 1 USD
      } else if (currencyType === "pounds") {
        setConversionRate(rates.INR / rates.GBP); // INR equivalent of 1 GBP
      }
    } catch (error) {
      setRateError("Failed to fetch exchange rates. Try again.");
      console.error("Exchange rate fetch error:", error);
    } finally {
      setLoadingRate(false);
    }
  };

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCurrencyType(value);
    if (value === "rupees") {
      setConversionRate(1); // Default for INR
    }
  };
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
    if (forAddProject && toEdit) {
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
    if (!forAddProject && !toEdit && projectToEdit) {
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
    handleClickOpen();
  };
  const handleEditProjectClick = () => {
    handleToEditClick();
    handleClickOpen();
  };

  return (
    <>
      <div>
        {/* <Dialog open={open} onClose={handleClose}> */}
        <div className="flex gap-3 items-center mb-4 ">
        <button
          onClick={() => navigate(-1)} // Use navigate(-1) to go back
          className="text-[16px] flex items-center gap-[10px] text-[#fff] bg-[#d9a990] rounded-[20px] px-[10px] py-[10px] hover:bg-[#4a6180]"
          
        >
            <IoChevronBackSharp />
          </button>
          <DialogTitle style={{ padding: "0" }}>
            {forAddProject ? "Add Project" : "Edit Project"}
          </DialogTitle>
          
        </div>
        {incompleteError.length > 0 ? (
          <Alert severity="error"> {incompleteError}</Alert>
        ) : null}
        {formError.length > 0 ? (
          <Alert severity="error"> {formError}</Alert>
        ) : null}
        {loading ? <LinearProgress /> : null}
        <DialogContent style={{ padding: "0" }}>
          <form onSubmit={handleAddSubmit}>
            <div>
              {!clientAddProject ? (
                <div>
                <label className="text-xs py-1 opacity-60">Select Client</label>
                <Autocomplete
                  options={clientsArr}
                  getOptionLabel={(option) => option.clientName}
                  value={selectClient?.clientName ? selectClient : null}
                  onChange={(event, newValue) => {
                    if (newValue) {
                      setSelectClient(newValue);
                    }
                  }}
                  renderInput={(params) => (
                    <TextField 
                      {...params} 
                      variant="outlined" 
                      size="small" 
                      placeholder="Select Client" 
                    />
                  )}
                />
              </div>
              ) : (
                <div>
                  <label className="text-xs py-1 opacity-60">Selected Client</label>
                  <Autocomplete
                    options={clientsArr}
                    getOptionLabel={(option) => option.clientName}
                    value={clientsArr.find((client) => client._id === clientId) || null}
                    disabled
                    renderInput={(params) => (
                      <TextField 
                        {...params} 
                        variant="outlined" 
                        size="small" 
                        placeholder="Selected Client" 
                      />
                    )}
                  />
                </div>
              )}
            </div>
            <TextField
              margin="dense"
              id="projectName"
              label="Project Name"
              type="text"
              fullWidth
              variant="outlined"
              name="projectName"
              value={projectData.projectName}
              onChange={handleChange}
              required
            />
            <div className="flex gap-2">
              <TextField
                select
                margin="dense"
                id="currencyType"
                label="Rate/Currency type"
                fullWidth
                variant="outlined"
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
                variant="outlined"
                name="workingPeriodType"
                value={projectData.workingPeriodType || ""}
                onChange={handleChange}
              >
                <MenuItem value="hours">Hours</MenuItem>
                <MenuItem value="days">Months</MenuItem>
                <MenuItem value="fixed">Fixed</MenuItem>
              </TextField>
            </div>
            <TextField
              margin="dense"
              id="rate"
              label={
                workPeriodType === "fixed"
                  ? "Enter Fixed Amount"
                  : `Rate (${currencyType}/${
                      workPeriodType === "days" ? "months" : "hours"
                    })`
              }
              type="number"
              fullWidth
              variant="outlined"
              name="rate"
              value={projectData.rate === 0 ? "" : projectData.rate}
              onChange={handleChange}
            />
            {/* {workPeriodType === "days" ? (
              <TextField
                margin="dense"
                id="projectPeriod"
                label={`Total project period in ${workPeriodType}`}
                type="number"
                fullWidth
                variant="outlined"
                name="projectPeriod"
                value={projectData.projectPeriod}
                onChange={handleChange}
              />
            ) : null} */}
            {/* {workPeriodType === "hours" ? (
              <>
                <label className=" text-[14px] text-gray-500">
                  {`Actual working in ${workPeriodType}`}
                </label>

                <TextField
                  margin="dense"
                  id="periodFrom"
                  type="time" // Set the type to "time" for HH:MM input
                  fullWidth
                  variant="outlined"
                  name="workingPeriod"
                  value={projectData.workingPeriod}
                  onChange={handleChange}
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                  InputProps={{
                    inputProps: {
                      step: 300, // Set the step to 5 minutes (300 seconds)
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
                variant="outlined"
                name="workingPeriod"
                value={projectData.workingPeriod}
                onChange={handleChange}
              />
            )} */}

            {currencyType !== "rupees" ? (
              <>
                 <div>
          
        </div>

        {/* Display Conversion Rate for Dollar and Pound */}
        {currencyType !== "rupees" && (
              <div className="relative mt-3">
                <TextField
                  label="Conversion Rate"
                  type="number"
                  value={conversionRate}
                  onChange={(e) => setConversionRate(Number(e.target.value))}
                  fullWidth
                />

                <Button
                  onClick={fetchExchangeRate}
                  disabled={loadingRate}
                  style={{
                    marginTop: "10px",
                    backgroundColor: "#d9a990",
                    color: "#fff",
                    position:"absolute",
                    right: "10px",
                    top: "0px",
                    cursor: "pointer",
                  }}
                >
                  {loadingRate ? "Fetching Rate..." : "Get Current Rate"}
                </Button>
              </div>
            )}
              </>
            ) : null}
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          {!toEdit ? (
            <Button
              onClick={(e) => handleAddSubmit(e)}
              style={{
                backgroundColor: isHovered ? "#4a6180" : "#d9a990",
                borderRadius: "20px",
                padding: "5px 15px",
                color: "#fff ",
                marginTop: "10px",
              }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              Add Project
            </Button>
          ) : (
            <Button
              onClick={(e) => handleEditSubmit(e)}
              style={{
                backgroundColor: isHovered ? "#4a6180" : "#d9a990",
                borderRadius: "20px",
                padding: "5px 15px",
                color: "#fff ",
                marginTop: "10px",
              }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              Edit Project
            </Button>
          )}
        </DialogActions>
        {/* </Dialog> */}
      </div>
    </>
  );
}

export default AddProjectPage;
