import React, { useEffect, useState } from "react";
import axios from "axios";
import { ClientType, ProjectType } from "../../types/types";
import { AppDispatch, RootState } from "../../states/redux/store";
import { useDispatch, useSelector } from "react-redux";
import ClientInfoSection from "../Client_Component/ClientInfoSection";
import { Button, TextField, useTheme } from "@mui/material";
import Styles from "./invoive.module.css";
import { removeProjectFromInvoiceAction } from "../../states/redux/InvoiceProjectState/addProjectForInvoiceSlice";
import BillAmount from "./BillAmount";
import { RxCross1 } from "react-icons/rx";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import Typography from "@mui/material/Typography";
import error from "../assets/project_error.png";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { AuthContext } from "../../states/context/AuthContext/AuthContext";
import { getAdminByIdAction } from "../../states/redux/AdminStates/adminSlice";
import { makeStateNeutralOfSelectedClient } from "../../states/redux/ClientStates/selectedClientSlice";

import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import MenuItem from "@mui/material/MenuItem";
import dayjs, { Dayjs } from "dayjs";
import { updateInvoiceObjectStateAction } from "../../states/redux/InvoiceProjectState/invoiceObjectState";
import { updateProjectForInvoiceAction } from "../../states/redux/InvoiceProjectState/addProjectForInvoiceSlice";
// import AddIcon from '@mui/icons-material/Add';
import ReplayIcon from "@mui/icons-material/Replay";

import { useSnackbar } from "notistack";
let windowWidth: number | undefined = window.innerWidth;
function InvoiceClientPage() {
  const { isAuth, adminId } = React.useContext(AuthContext);
  const materialTheme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const selectedClientState = useSelector(
    (state: RootState) => state.selectedClientState
  );
  const clientObj: ClientType = selectedClientState.data;
  const { projectsForInvoice } = useSelector(
    (state: RootState) => state.projectsForInvoiceState
  );

  const handleRemoveProject = (project: ProjectType) => {
    if (project && project._id) {
      dispatch(removeProjectFromInvoiceAction(project._id));
    }
  };

  const navigate = useNavigate();
  const [editableProjects, setEditableProjects] = useState(projectsForInvoice);

  const [loadingRate, setLoadingRate] = useState(false);
  const [rateError, setRateError] = useState("");
  const [currencyType, setCurrencyType] = useState("dollars"); 

  const [invoiceDate, setInvoiceDate] = React.useState(dayjs());
  const [dueDate, setDueDate] = React.useState(dayjs());
  const [textColor, setTextColor] = React.useState("black");
  const [allowDownload, setAllowDownload] = React.useState(true);
  const { enqueueSnackbar } = useSnackbar();

  // Fetch the exchange rate from the API
  const fetchExchangeRate = async (projectId: string) => {
    setLoadingRate(true);
    setRateError("");

    try {
      const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/USD`);
      const rates = response.data.rates;

      let newRate = 1;
      if (currencyType === "dollars") {
        newRate = rates.INR;
      } else if (currencyType === "pounds") {
        newRate = rates.INR / rates.GBP;
      }

      // Find the project to update
      const updatedProjects = editableProjects.map((project) =>
        project._id === projectId ? { ...project, conversionRate: newRate } : project
      );

      const updatedProject = updatedProjects.find((project) => project._id === projectId);

      if (updatedProject) {
        // Update the editableProjects state
        setEditableProjects(updatedProjects);

        // Dispatch the updated project to Redux
        dispatch(updateProjectForInvoiceAction(updatedProject));
      }
    } catch (error) {
      setRateError("Failed to fetch exchange rates. Try again.");
      console.error("Error fetching exchange rates:", error);
    } finally {
      setLoadingRate(false);
    }
  };



  const handleInputChange = (id: string, field: string, value: any) => {
    const newValue = value === "" ? "" : value;
    setEditableProjects((prevProjects) =>
      prevProjects.map((project) => {
        if (project._id === id) {
          const updatedProject = { ...project, [field]: newValue };

          // Calculate the rate per day if rate per month is provided
          if (field === "rate" && project.workingPeriodType === "days") {
            if (invoiceDate) {
              // Get the previous month from the invoice date
              const prevMonth = invoiceDate.subtract(1, "month");
              const daysInPrevMonth = prevMonth.daysInMonth(); // Day.js method to get days in month
              updatedProject.ratePerDay = parseFloat(value) / daysInPrevMonth;
            }
          }
          console.log("rate per day : ",updatedProject.ratePerDay);
          // Perform amount calculation if rate and workingPeriodType are present
          
          if (updatedProject.rate && updatedProject.workingPeriodType ) {
            if (updatedProject.workingPeriodType === "hours" && updatedProject.workingTime) {
              updatedProject.amount = updatedProject.rate * (updatedProject.workingTime || 1) * updatedProject.conversionRate;
            } else if (updatedProject.workingPeriodType === "days" && updatedProject.ratePerDay && updatedProject.workingDays) {
              updatedProject.amount = updatedProject.ratePerDay * (updatedProject.workingDays || 1) * updatedProject.conversionRate;
            } else {
              updatedProject.amount = updatedProject.rate * updatedProject.conversionRate;
            }
          }
          dispatch(updateProjectForInvoiceAction(updatedProject));
          return updatedProject;
        }
        return project;
      }
      )
    );
  };
const [workingFixed,setWorkingFixed] = useState(false);
  useEffect(() => {
    const updatedProjects = projectsForInvoice.map((project) => {
      const updatedProject = { ...project };

      if(project.workingPeriodType === "fixed"){
        setWorkingFixed(true);
      }
      // Calculate ratePerDay on component mount
      if (project.workingPeriodType === "days" && project.rate) {
        if (invoiceDate) {
          const prevMonth = invoiceDate.subtract(1, "month");
          const daysInPrevMonth = prevMonth.daysInMonth();
          updatedProject.ratePerDay = project.rate / daysInPrevMonth;
        }
      }
    
      let amount = 0;
     
      if (project.rate && project.workingPeriodType) {
        if (project.workingPeriodType === "hours") {
          amount = project.rate * (project.workingTime || 1) * project.conversionRate;
        } else if (project.workingPeriodType === "days" && project.ratePerDay && project.workingDays) {
          amount = project.ratePerDay  * (project.workingDays || 1) * project.conversionRate;
        } else if (project.workingPeriodType === "fixed") {
          amount = project.rate * project.conversionRate;
        }
      }

      // return { ...project, amount };
      return updatedProject;
    });

    setEditableProjects(updatedProjects);
  }, [projectsForInvoice,invoiceDate,workingFixed]);

  React.useEffect(() => {
    if (isAuth && adminId) {
      dispatch(getAdminByIdAction(adminId));
    }
  }, [isAuth, adminId, dispatch]);

  const invoiceObject = useSelector(
    (state: RootState) => state.invoiceObjectState
  );
  const handleBackButton = () => {
    navigate(-1);
  }

  const handleInvoiceDateChange = (newDate: dayjs.Dayjs | null) => {
    if (!newDate) {
      enqueueSnackbar("Invalid date select again", {
        variant: "error",
      });
      dispatch(updateInvoiceObjectStateAction({ billDate: "" }));
      return;
    }

    if (newDate) {
      setInvoiceDate(newDate);
      const iso8601InvoiceDate = newDate.toISOString();
      dispatch(
        updateInvoiceObjectStateAction({ billDate: iso8601InvoiceDate })
      );
    }
  };
  const handleDueDateChange = (newDate: dayjs.Dayjs | null) => {
    if (!newDate) {
      dispatch(updateInvoiceObjectStateAction({ dueDate: "" }));
      setAllowDownload(false);
      return;
    }
    if (newDate.isBefore(invoiceDate)) {
      enqueueSnackbar("Due date cannot be before invoice date.", {
        variant: "error",
      });
      setAllowDownload(false);
      dispatch(updateInvoiceObjectStateAction({ dueDate: "" }));
      return;
    } else {
      setDueDate(newDate);
      setAllowDownload(true);
      const iso8601DueDate = newDate.toISOString();
      dispatch(updateInvoiceObjectStateAction({ dueDate: iso8601DueDate }));
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={handleBackButton}
            className="text-white text-[20px] bg-[#E4A98A] w-[35px] h-[35px] flex justify-center items-center rounded-[50px]"
          >
            <IoIosArrowBack />
          </button>
          <Typography variant="h5" component="h2" className="text-center">
            CLIENT INFORMATION
          </Typography>
        </div>
        <div>
          <div className="text-black mr-5">
            <strong>Invoice Number: </strong>

            <TextField
              variant="outlined"
              size="small"
              // value={invoiceNumber}
              // onChange={handleInvoiceNumberChange}
              value={invoiceObject.invoiceNo}
              onChange={(e) =>
                dispatch(
                  updateInvoiceObjectStateAction({ invoiceNo: e.target.value })
                )
              } // Update Redux store with the new value
            // onChange={(e) =>}
            />
          </div>
        </div>
      </div>
      <div className="flex justify-between items-start gap-2">
        {clientObj && selectedClientState.loading !== "idle" ? (
          <ClientInfoSection />
        ) : null}
        <div className="w-full flex justify-end">
          {windowWidth && windowWidth > 768 ? (
            <>
              <div className="flex flex-col items-end">
                <DemoItem>
                  <label style={{ color: textColor }}>Invoice date</label>
                  <DesktopDatePicker
                    defaultValue={invoiceDate}
                    onChange={(newDate) => handleInvoiceDateChange(newDate)}
                    format="DD/MM/YYYY"
                    // label="Invoice date"
                    sx={{
                      backgroundColor: "#cecece", width: '250px',  // Explicitly set a wider width
                      '& .MuiOutlinedInput-root': {
                        width: '100%'
                      }
                    }}
                  />
                </DemoItem>
                <DemoItem>
                  <label style={{ color: textColor }}>Due date</label>
                  <DesktopDatePicker
                    defaultValue={dueDate}
                    onChange={(newDate) => handleDueDateChange(newDate)}
                    format="DD/MM/YYYY"
                    sx={{
                      backgroundColor: "#cecece", width: '250px',  // Explicitly set a wider width
                      '& .MuiOutlinedInput-root': {
                        width: '100%'
                      }
                    }}
                  />
                </DemoItem>
              </div>
            </>

          ) : (
            <>
              <div className="flex flex-col items-end">
                <DemoItem>
                  <label style={{ color: textColor }}>Invoice date</label>
                  <MobileDatePicker
                    defaultValue={invoiceDate}
                    onChange={(newDate) => handleInvoiceDateChange(newDate)}
                    format="DD/MM/YYYY"
                    sx={{
                      width: '250px',  // Explicitly set a wider width
                      '& .MuiOutlinedInput-root': {
                        width: '100%'
                      }
                    }}
                  />
                </DemoItem>
                <DemoItem>
                  <label style={{ color: textColor }}>Due date</label>
                  <MobileDatePicker
                    defaultValue={dueDate}
                    onChange={(newDate) => handleDueDateChange(newDate)}
                    format="DD/MM/YYYY"
                    sx={{
                      width: '250px',  // Explicitly set a wider width
                      '& .MuiOutlinedInput-root': {
                        width: '100%'
                      }
                    }}
                  />
                </DemoItem>
              </div>

            </>
          )}
        </div>
      </div>
      {projectsForInvoice.length > 0 ? (
        <div className="rounded-[20px]">
          <TableContainer component={Paper} className={`${Styles.table_scroll}`}>
            <Table>
              <TableHead className={Styles.animated}>
                <TableRow>
                  <TableCell>Project Name</TableCell>
                  <TableCell>Rate</TableCell>
                  {editableProjects.map((project: ProjectType) => (
                    <>
                      {project.workingPeriodType === "days" && <TableCell>Rate/day</TableCell>}
                      <TableCell>
                        {project.workingPeriodType === "fixed"
                          ? "Working Fixed"
                          : project.workingPeriodType === "hours"
                            ? "Working Time"
                            : "Working Days"}
                      </TableCell>
                    </>
                  ))}

                  <TableCell className="w-[175px]">Conversion Rate</TableCell>
                  <TableCell className="w-[110px]">Subtotal</TableCell>
                  <TableCell className="w-[110px]">Remove</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {editableProjects.map((project: ProjectType) => (
                  <TableRow key={project._id} className={`${Styles.project_row}`}>
                    <TableCell className="text-[19px] overflow-hidden whitespace-nowrap text-ellipsis">
                      {project.projectName}
                    </TableCell>
                    <TableCell className="text-[13px] w-[150px]">
                      <TextField
                        variant="outlined"
                        size="small"
                        value={project.rate || ""} // Fallback to empty string if rate is undefined
                        onChange={(e) =>
                          handleInputChange(
                            project._id ?? "",
                            "rate",
                            e.target.value
                          )
                        } // Fallback to empty string if _id is undefined
                        InputProps={{
                          endAdornment: (
                            <span>
                              {project.currencyType === "rupees" ? project.workingPeriodType === "fixed"
                                ? "₹/fixed" : `₹/${project.workingPeriodType === "hours" ? "hours" : "months"}`
                                : project.currencyType === "dollars" ? project.workingPeriodType === "fixed"
                                  ? "$/fixed" :
                                  `$/${project.workingPeriodType === "hours" ? "hours" : "months"}`
                                  : project.currencyType === "pounds" ? project.workingPeriodType === "fixed"
                                    ? "£/fixed" :
                                    `£/${project.workingPeriodType === "hours" ? "hours" : "months"}`
                                    : ""}
                            </span>
                          ),
                        }}
                      />
                    </TableCell>
                    {project.workingPeriodType === "days" &&
                      <TableCell>
                        <TextField
                          variant="outlined"
                          size="small"
                          value={project.ratePerDay || ""}
                        />
                      </TableCell>}
                    <TableCell className="text-[13px] w-[150px]">
                      {project.workingPeriodType === 'hours' ? (
                        <TextField
                          variant="outlined"
                          size="small"
                          // value={project.workingPeriodType || ""}
                          value={project.workingTime || 1}
                          onChange={(e) =>
                            handleInputChange(
                              project._id ?? "",
                              "workingTime",
                              e.target.value
                            )
                          }
                        />) :

                        (<TextField
                          variant="outlined"
                          size="small"
                          value={project.workingDays || 1}
                          onChange={(e) =>
                            handleInputChange(
                              project._id ?? "",
                              "workingDays",
                              // parseFloat(e.target.value)
                              e.target.value
                            )
                          }
                        />)}

                    </TableCell>
                    <TableCell className="text-[13px] w-[150px]">
                      <TextField
                        variant="outlined"
                        size="small"
                        value={project.conversionRate}
                        onChange={(e) =>
                          handleInputChange(
                            project._id ?? "",
                            "conversionRate",
                            e.target.value
                          )
                        }
                        InputProps={{
                          startAdornment: (
                            <span>
                              {project.currencyType === "rupees"
                                ? "₹"
                                : project.currencyType === "dollars"
                                  ? "$"
                                  : project.currencyType === "pounds"
                                    ? "£"
                                    : ""}
                            </span>
                          ),
                        }}
                      />
                      {project.currencyType !== "rupees" ? (
                        <>
                          <Button
                            onClick={() => fetchExchangeRate(project._id!)} // Non-null assertion
                            disabled={loadingRate}
                          >
                            {/* <AddIcon /> */}
                            <ReplayIcon />
                          </Button>


                          {rateError && <p>{rateError}</p>}
                        </>
                      ) : null}

                    </TableCell>
                    <TableCell className="text-[13px]w-[110px]">
                      &#x20B9;{project.amount ? project.amount.toFixed(2) : 0}
                    </TableCell>
                    <TableCell className="w-[110px]">
                      <Button
                        onClick={() => handleRemoveProject(project)}
                        className={Styles.removeButton}
                      >
                        <RxCross1 />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <BillAmount workingFixed={workingFixed}/> 
        </div> 

      )
        : (<div>
          <div className="flex flex-col h-[60vh] justify-center items-center ">
            <img src={error} alt="No project selected" className="w-[300px]" />
            <p>No Project Selected</p>
          </div>
        </div>
        )}

    </div>
  );
}

export default InvoiceClientPage;
