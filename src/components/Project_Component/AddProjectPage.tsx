import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";
import { Autocomplete } from "@mui/material";
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
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../states/redux/store";
import Select from "react-select";
import { InputActionMeta } from "react-select";
import axios from "axios";
import CompoLoadingProjects from "./CompoLoadingProjects";
import { getAllClientsByAdminIdAction } from "../../states/redux/ClientStates/allClientSlice";
import { log } from "node:console";
import {
  addProjectForInvoiceAction,
  removeAllProjectsFromInvoiceAction,
} from "../../states/redux/InvoiceProjectState/addProjectForInvoiceSlice";
import { updateInvoiceObjectStateAction } from "../../states/redux/InvoiceProjectState/invoiceObjectState";
import { FileData } from "../../types/types";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { addProject } from "../../api/project_requests";
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Card, CardMedia
} from "@mui/material";
import { Typography, List, ListItem, ListItemText, IconButton, Box, Paper } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { UploadedFile } from "../../types/types";
interface ImageConverterProps {
  selectedProjectData: ProjectType;
}


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
    loading: adminLoding,
    data: adminData,
    error: adminError,
  } = useSelector((state: RootState) => state.adminState);

  const {
    loading: clientsLoading,
    data: clients,
    error: clientsError,
  } = useSelector((state: RootState) => state.allClientsState);

  const dispatch = useDispatch<AppDispatch>();

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
    contactNo: client.contactNo,
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
  const [textColor, setTextColor] = React.useState("black");
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
    _id: "",
    projectName: "",
    rate: 0,
    workingPeriodType: "hours",
    currencyType: "rupees",
    conversionRate: 1,
    paymentStatus: false,
    adminId: "",
    clientId: clientId || "",
    advanceAmount: 0,
    paymentCycle: "",
    billingCycle: "",
    technology: "",
    paidLeave: 0,
    timeSheet: "",
    candidateName: "",
    startDate: "",
    endDate: "",
    files: [],
    uploadedFiles: []
  });

  const {
    loading: selectedProjectLoading,
    data: selectedProjectData,
    error: selectedProjectError,
  } = useSelector((state: RootState) => state.selectedProjectState);

  React.useEffect(() => {
    if (selectedProjectLoading === "succeeded" && selectedProjectData) {
      setProjectData({
        _id: selectedProjectData._id || "",
        adminId: selectedProjectData.adminId,
        clientId: selectedProjectData.clientId,
        projectName: selectedProjectData.projectName,
        rate: selectedProjectData.rate,
        workingPeriodType: selectedProjectData.workingPeriodType,
        currencyType: selectedProjectData.currencyType,
        conversionRate: selectedProjectData.conversionRate,
        paymentStatus: selectedProjectData.paymentStatus,
        advanceAmount: selectedProjectData.advanceAmount,
        paymentCycle: selectedProjectData.paymentCycle,
        billingCycle: selectedProjectData.billingCycle,
        technology: selectedProjectData.technology,
        paidLeave: selectedProjectData.paidLeave,
        timeSheet: selectedProjectData.timeSheet,
        candidateName: selectedProjectData.candidateName,
        startDate: selectedProjectData.startDate,
        endDate: selectedProjectData.endDate,
        files: selectedProjectData.files,
        uploadedFiles: selectedProjectData.uploadedFiles,
      });
    }
  }, [selectedProjectLoading, selectedProjectData, selectedProjectError]);

  interface FileData {
    name: string;
    file: File; // The actual file object
    url: string; // Temporary URL for preview
  }

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
        setProjectData((prevData) => ({
          ...prevData,
          currencyType: "dollars",
          conversionRate: rates.INR,
        }));
      } else if (currencyType === "pounds") {
        setConversionRate(rates.INR / rates.GBP); // INR equivalent of 1 GBP
        setProjectData((prevData) => ({
          ...prevData,
          currencyType: "pounds",
          conversionRate: rates.INR / rates.GBP,
        }));
      }
    } catch (error) {
      setRateError("Failed to fetch exchange rates. Try again.");
      console.error("Exchange rate fetch error:", error);
    } finally {
      setLoadingRate(false);
    }
  };

  const navigate = useNavigate();

  React.useEffect(() => {
    if (adminId && adminLoding === "idle") {
      let timer = setTimeout(() => {
        dispatch(getAllClientsByAdminIdAction(adminId));
        return () => {
          clearTimeout(timer);
        };
      }, 0);
    }
  }, [dispatch, adminId, adminLoding]);

  React.useEffect(() => {
    if (clientId && clientAddProject) {
      setProjectData({
        ...projectData,
        clientId: clientId,
      });
    }
  }, [clientId]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void {
    let { name, value, type } = e.target;
    setFormError("");
    setIncompleteError("");

    if (
      type === "file" &&
      e.target instanceof HTMLInputElement &&
      e.target.files
    ) {
      const files = e.target.files;
      const updatedFiles = Array.from(files).map((file) => ({
        name: file.name,
        file: file, // Keep the original File object
        url: URL.createObjectURL(file), // Temporary URL for preview
      }));

      setProjectData((prevData) => ({
        ...prevData,
        files: [...(prevData.files || []), ...updatedFiles], // Append new file objects
      }));
      return;
    }
    if (workPeriodType === "months" && parseInt(value) < 0) {
      value = "0";
    }
    if (name === "advanceAmount") {
      let numVal = +value;
      setProjectData((prevData) => ({
        ...prevData,
        // advanceAmount: parseFloat(value) || 0,
        [name]: numVal,
      }));
      return;
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
        conversionRate: conversionRate,
      }));
      setCurrencyType(value);
    } else if (name === "currencyType" && value === "pounds") {
      setProjectData((prevData) => ({
        ...prevData,
        currencyType: "pounds",
        conversionRate: conversionRate,
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
    if (name === "timeSheet") {
      setProjectData((prevData) => ({
        ...prevData,
        timeSheet: value,
      }));
      return;
    }

    if (name === "billingCycle") {
      setProjectData((prevData) => ({
        ...prevData,
        billingCycle: value,
      }));
      return;
    }
    // Handle other fields
    setProjectData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  function areAllRequiredFieldsFilled(obj: any) {
    setFormError("");
    if (obj.projectName === "") {
      setFormError("Project name compulsary*");
      return false;
    }
    if (obj.conversionRate === "") {
      setProjectData({ ...obj, conversionRate: 1 });
    }
    if (obj.clientId.length <= 0 || obj.adminId.length <= 0) {
      setFormError("please select client !!");
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

      const formData = new FormData();

      for (const key in projectData) {
        const value = projectData[key as keyof ProjectType];

        if (key === "files" && Array.isArray(projectData.files)) {
          projectData.files.forEach((fileData) => {
            formData.append("files", fileData.file);
          });
        } else if (value !== null && value !== undefined) {
          formData.append(key, value.toString());
        }
      }
      // Send form data with the mutation
      addProjectMutation.mutate(formData, {
        onSuccess: () => {
          queryClient.invalidateQueries(["projects", clientId]);
          queryClient.refetchQueries(["projects", clientId]);
          setLoading(false);
          handleClose();
          enqueueSnackbar("Project added successfully.", {
            variant: "success",
          });
          navigate(-1);
        },
        onError: (error) => {
          setLoading(false);
          setIncompleteError("Error adding project, try again.");
          enqueueSnackbar("Error in adding project. Try again!", {
            variant: "error",
          });
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

      const formData = new FormData();
      for (const key in projectData) {
        const value = projectData[key as keyof UpdateProjectDataType];

        if (key === "files" && Array.isArray(projectData.files)) {
          projectData.files.forEach((fileData) => {
            formData.append("files", fileData.file);
          });
        } else if (value !== null && value !== undefined) {
          formData.append(key, value.toString());
        }
      }

      UpdateProjectMutationHandler.mutate(
        {
          projectId: projectData._id!,
          updatedProjectData: formData,
        },
        {
          onSuccess: () => {
            queryClient.refetchQueries(["projects", clientId]);
            setLoading(false);
            enqueueSnackbar("Project edited successfully.", {
              variant: "success",
            });
            handleClose();
            setTimeout(() => navigate(-1), 600);
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
        _id: "",
        projectName: "",
        rate: 0,
        workingPeriodType: "hours",
        currencyType: "rupees",
        conversionRate: 1,
        paymentStatus: false,
        adminId: adminId ? adminId : "",
        clientId: clientId ? clientId : "",
        advanceAmount: 0,
        paymentCycle: "",
        billingCycle: "",
        technology: "",
        paidLeave: 0,
        timeSheet: "",
        candidateName: "",
        startDate: "",
        endDate: "",
      });
    }
    if (!forAddProject && !toEdit && projectToEdit && projectToEdit._id) {
      let newProjectToEdit = { ...projectToEdit };
      delete newProjectToEdit.amount;
      setProjectData((prevData) => ({
        ...prevData,
        _id: projectToEdit._id,
      }));
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

  const [startDateError, setStartDateError] = useState(false);
  const [endDateError, setEndDateError] = useState(false);

  const handleDateChange = (field: string, value: dayjs.Dayjs | null) => {
    if (!value) {
      setProjectData((prevData) => ({ ...prevData, [field]: null }));
      if (field === "startDate") {
        setStartDateError(false);
      }
      if (field === "endDate") {
        setEndDateError(false);
      }
    } else {
      setProjectData((prevData) => ({
        ...prevData,
        [field]: value.toISOString(),
      }));

      // Validate the date range
      if (field === "startDate") {
        if (projectData.endDate && value.isAfter(dayjs(projectData.endDate))) {
          setStartDateError(true);
        } else {
          setStartDateError(false);
        }
      }

      if (field === "endDate") {
        if (
          projectData.startDate &&
          value.isBefore(dayjs(projectData.startDate))
        ) {
          setEndDateError(true);
        } else {
          setEndDateError(false);
        }
      }
    }
  };


  return (
    <>
      <div>
        {/* <Dialog open={open} onClose={handleClose}> */}
        <div className="flex gap-3 items-center mb-4 ">
          <button
            onClick={() =>
              setTimeout(() => {
                navigate(-1);
              }, 600)
            }
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
                <Autocomplete
                  options={clientsArr}
                  getOptionLabel={(option) => option.clientName || ""}
                  value={
                    clientsArr.find(
                      (client) => client._id === projectData.clientId
                    ) || null
                  }
                  onChange={(event, newValue) => {
                    if (newValue && newValue._id) {
                      setFormError("");
                      setSelectClient(newValue);
                      setProjectData({
                        ...projectData,
                        clientId: newValue._id,
                      });
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      margin="dense"
                      id="clientSelect"
                      label="Select Client"
                      type="text"
                      fullWidth
                      variant="outlined"
                      required
                    />
                  )}
                />
              ) : (
                <div>
                  <label className="text-xs py-1 opacity-60">
                    Selected Client
                  </label>
                  <Autocomplete
                    options={clientsArr}
                    getOptionLabel={(option) => option.clientName}
                    value={
                      clientsArr.find((client) => client._id === clientId) ||
                      null
                    }
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
                <MenuItem value="months">Months</MenuItem>
                <MenuItem value="fixed">Fixed</MenuItem>
              </TextField>
            </div>
            <TextField
              margin="dense"
              id="rate"
              label={
                projectData.workingPeriodType === "fixed"
                  ? "Enter Fixed Amount"
                  : `Rate (${projectData.currencyType}/${projectData.workingPeriodType})`
              }
              type="text"
              fullWidth
              variant="outlined"
              name="rate"
              value={projectData.rate === 0 ? "" : projectData.rate}
              onChange={handleChange}
            />

            {projectData.workingPeriodType === "fixed" && (
              <TextField
                margin="dense"
                id="workingPeriodType"
                label="Advance Amount"
                type="text"
                fullWidth
                variant="outlined"
                name="advanceAmount"
                value={projectData.advanceAmount || ""}
                onChange={handleChange}
              />
            )}

            {currencyType !== "rupees" ? (
              <>
                <div></div>

                {/* Display Conversion Rate for Dollar and Pound */}
                {currencyType !== "rupees" && (
                  <div className="relative mt-3">
                    <TextField
                      label="Conversion Rate"
                      type="number"
                      value={conversionRate}
                      name="conversionRate"
                      onChange={(e) => {
                        setConversionRate(Number(e.target.value));
                        handleChange(e);
                      }}
                      fullWidth
                    />

                    <Button
                      onClick={fetchExchangeRate}
                      disabled={loadingRate}
                      style={{
                        marginTop: "10px",
                        backgroundColor: "#d9a990",
                        color: "#fff",
                        position: "absolute",
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

            <TextField
              margin="dense"
              id="paymentCycle"
              label="Payment Cycle"
              type="text"
              fullWidth
              variant="outlined"
              name="paymentCycle"
              value={projectData.paymentCycle}
              onChange={handleChange}
            />

            <TextField
              select
              margin="dense"
              id="billingCycle"
              label="Billing Cycle"
              fullWidth
              variant="outlined"
              name="billingCycle"
              value={projectData.billingCycle || ""}
              onChange={handleChange}
            >
              <MenuItem value="workingday">Working day</MenuItem>
              <MenuItem value="calender">Calender</MenuItem>
              <MenuItem value="fixed">Fixed</MenuItem>
            </TextField>

            <TextField
              margin="dense"
              id="technology"
              label="Technology"
              type="text"
              fullWidth
              variant="outlined"
              name="technology"
              value={projectData.technology}
              onChange={handleChange}
              
            />

            <FormControl component="fieldset" margin="dense" fullWidth>
              <FormLabel component="legend">Time Sheet</FormLabel>
              <RadioGroup
                row
                name="timeSheet"
                value={projectData.timeSheet}
                onChange={handleChange}
              >
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>
            <div>
              <label htmlFor="fileUpload">Upload File:</label>
              <TextField
                type="file"
                id="fileUpload"
                name="files"
                onChange={handleChange}
                inputProps={{
                  accept: "image/*,.pdf,.docx",
                  multiple: true,
                }}
                fullWidth
              />
              {!forAddProject && (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 2,
                    padding: 2,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "16px", // Spacing between items
                      justifyContent: "start",
                      alignItems: "center",
                    }}
                  >
                    {selectedProjectData.uploadedFiles?.map((file, index) => {
                      if (file.imageUrl?.match(/image\/.*/)) {
                        // Preview Images
                        return (
                          <Card
                            key={index}
                            sx={{
                              width: 150, // Card width
                              height: 200, // Card height
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "space-between",
                              padding: "8px",
                              boxShadow: 2,
                              borderRadius: "8px",
                              transition: "transform 0.3s",
                              "&:hover": {
                                transform: "scale(1.05)", // Slight zoom on hover
                              },
                            }}
                          >
                            <CardMedia
                              component="img"
                              src={file.imageUrl}
                              alt={file.filename}
                              sx={{
                                maxHeight: "120px",
                                objectFit: "contain", // Maintain aspect ratio
                                marginBottom: "8px",
                              }}
                            />
                            <Typography
                              variant="body2"
                              sx={{
                                textAlign: "center",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                              title={file.filename} // Tooltip for long filenames
                            >
                               <a href={file.url} target="_blank" rel="noopener noreferrer"  >
                                {file.filename}
                              </a>


                            </Typography>
                          </Card>
                        );
                      } else {
                        // For unsupported formats like .docx
                        return (
                          <Card
                            key={index}
                            sx={{
                              width: 150,
                              height: 100,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              padding: "8px",
                              boxShadow: 2,
                              borderRadius: "8px",
                              backgroundColor: "#f8d7da",
                              color: "#721c24",
                              border: "1px solid #f5c6cb",
                            }}
                          >
                            <Typography
                              variant="body2"
                              textAlign="center"
                              title={file.filename}
                            >
                              Preview not available for <strong>{file.filename}</strong>
                            </Typography>
                          </Card>
                        );
                      }
                    })}
                  </Box>
                </Box>
              )}
            </div>





            <TextField
              margin="dense"
              id="candidateName"
              label="Candidate / Resource Name"
              type="text"
              fullWidth
              variant="outlined"
              name="candidateName"
              value={projectData.candidateName}
              onChange={handleChange}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              {" "}
              {/* Use Dayjs Adapter */}
              <div
                style={{ display: "flex", gap: "16px", alignItems: "center" }}
              >
                {/* Start Date Picker */}
                <DatePicker
                  label="Start Date"
                  value={
                    projectData.startDate ? dayjs(projectData.startDate) : null
                  }
                  onChange={(newValue) =>
                    handleDateChange("startDate", newValue)
                  }
                  slotProps={{
                    textField: {
                      variant: "outlined",
                      fullWidth: true,
                      margin: "normal",
                      error: startDateError, // Use boolean error flag
                      helperText: startDateError
                        ? "Start date should be less than end date"
                        : "",
                    },
                  }}
                />

                {/* End Date Picker */}
                <DatePicker
                  label="End Date"
                  value={
                    projectData.endDate ? dayjs(projectData.endDate) : null
                  }
                  onChange={(newValue) => handleDateChange("endDate", newValue)}
                  slotProps={{
                    textField: {
                      variant: "outlined",
                      fullWidth: true,
                      margin: "normal",
                      error: endDateError, // Use boolean error flag
                      helperText: endDateError
                        ? "End date should be greater than start date"
                        : "",
                    },
                  }}
                />
              </div>
            </LocalizationProvider>
          </form>
        </DialogContent>
        <DialogActions>
          {/* <Button onClick={handleClose}>Cancel</Button> */}
          {forAddProject && !toEdit ? (
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
