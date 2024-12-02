import React, { useEffect, useState } from "react";
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
import dayjs, { Dayjs } from "dayjs";
import { updateInvoiceObjectStateAction } from "../../states/redux/InvoiceProjectState/invoiceObjectState";
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

  const handleInputChange = (id: string, field: string, value: any) => {
    setEditableProjects((prevProjects) =>
      prevProjects.map((project) =>
       {
        if (project._id === id) {
          const updatedProject = { ...project, [field]: value };
  
          // Perform amount calculation if rate and workingPeriodType are present
          if (updatedProject.rate && updatedProject.workingPeriodType) {
            if (updatedProject.workingPeriodType === "hours") {
              updatedProject.amount = updatedProject.rate * 8; // Assuming 8 hours in a workday
            } else if (updatedProject.workingPeriodType === "days") {
              updatedProject.amount = updatedProject.rate * 30; // Assuming 30 days in a month
            } else {
              updatedProject.amount = updatedProject.rate; // For "fixed", use the rate directly
            }
          }
  
          return updatedProject;
        }
        return project;
      }
      )
    );
  };
 
  useEffect(() => {
    const updatedProjects = projectsForInvoice.map((project) => {
     
      let amount = 0;
      if (project.rate && project.workingPeriodType) {
        if (project.workingPeriodType === "hours") {
          amount = project.rate * 8; 
        } else if (project.workingPeriodType === "days") {
          amount = project.rate * 30; 
        } else if (project.workingPeriodType === "fixed") {
          amount = project.rate; 
        }
      }
      
      return { ...project, amount };
    });
  
    setEditableProjects(updatedProjects); 
  }, [projectsForInvoice]); 
  
  React.useEffect(() => {
    if (isAuth && adminId) {
      dispatch(getAdminByIdAction(adminId));
    }
  }, [isAuth, adminId, dispatch]);

  const invoiceObject = useSelector(
    (state: RootState) => state.invoiceObjectState
  );
  const handleBackButton = ()=>{
    navigate(-1);
  }

 
  const [invoiceDate, setInvoiceDate] = React.useState(dayjs());
  const [dueDate, setDueDate] = React.useState(dayjs());
  const [textColor, setTextColor] = React.useState("black");
  const [allowDownload, setAllowDownload] = React.useState(true);
  const { enqueueSnackbar } = useSnackbar();

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
            value={invoiceObject.invoiceNo}
            // onChange={(e) =>}
          />
        </div>
        <div>
      {windowWidth && windowWidth > 768 ? (
              <>
                <DemoItem>
                  <label style={{ color: textColor }}>Invoice date</label>
                  <DesktopDatePicker
                    defaultValue={invoiceDate}
                    onChange={(newDate) => handleInvoiceDateChange(newDate)}
                    format="DD/MM/YYYY"
                    // label="Invoice date"
                    sx={{ backgroundColor: "#cecece" }}
                  />
                </DemoItem>
                <DemoItem>
                  <label style={{ color: textColor }}>Due date</label>
                  <DesktopDatePicker
                    defaultValue={dueDate}
                    onChange={(newDate) => handleDueDateChange(newDate)}
                    format="DD/MM/YYYY"
                    sx={{ backgroundColor: "#cecece" }}
                  />
                </DemoItem>
              </>
            ) : (
              <>
                <DemoItem>
                  <label style={{ color: textColor }}>Invoice date</label>
                  <MobileDatePicker
                    defaultValue={invoiceDate}
                    onChange={(newDate) => handleInvoiceDateChange(newDate)}
                    format="DD/MM/YYYY"
                  />
                </DemoItem>
                <DemoItem>
                  <label style={{ color: textColor }}>Due date</label>
                  <MobileDatePicker
                    defaultValue={dueDate}
                    onChange={(newDate) => handleDueDateChange(newDate)}
                    format="DD/MM/YYYY"
                  />
                </DemoItem>
              </>
            )}
      </div>
       </div>
      </div>    

      <div>
        {clientObj && selectedClientState.loading !== "idle" ? (
          <ClientInfoSection />
        ) : null}
      </div>
      <div className="rounded-[20px]">
        <TableContainer component={Paper} className={`${Styles.table_scroll}`}>
          <Table>
            <TableHead className={Styles.animated}>
              <TableRow>
                <TableCell>Project Name</TableCell>
                <TableCell>Rate</TableCell>
                <TableCell>Working Time</TableCell>
                <TableCell className="w-[175px]">Conversion Rate</TableCell>
                <TableCell className="w-[110px]">Amount</TableCell>
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
                  </TableCell>
                  <TableCell className="text-[13px] w-[150px]">
                    <TextField
                      variant="outlined"
                      size="small"
                      value={project.workingPeriodType || ""}
                      onChange={(e) =>
                        handleInputChange(
                          project._id ?? "",
                          "workingPeriod",
                          e.target.value
                        )
                      }
                    />
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
      </div>
      <div>
        {projectsForInvoice.length > 0 ? (
          <BillAmount />
        ) : (
          <div className="flex flex-col h-[60vh] justify-center items-center ">
            <img src={error} alt="No project selected" className="w-[300px]" />
            <p>No Project Selected</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default InvoiceClientPage;
