import React, { useEffect, useState } from "react";
import axios from "axios";
import { ClientType, ProjectType } from "../../types/types";
import { AppDispatch, RootState } from "../../states/redux/store";
import { useDispatch, useSelector } from "react-redux";
import ClientInfoSection from "../Client_Component/ClientInfoSection";
import { Button, TextField, useTheme } from "@mui/material";
import Styles from "./invoive.module.css";
import {
  addProjectForInvoiceAction,
  removeProjectFromInvoiceAction,
} from "../../states/redux/InvoiceProjectState/addProjectForInvoiceSlice";
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
import {
  useAddNewProject,
  useUpdateProject,
} from "../../states/query/Project_queries/projectQueries";
import { queryClient } from "./../../index";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import MenuItem from "@mui/material/MenuItem";
import dayjs, { Dayjs } from "dayjs";
import { updateInvoiceObjectStateAction } from "../../states/redux/InvoiceProjectState/invoiceObjectState";
import { updateProjectForInvoiceAction } from "../../states/redux/InvoiceProjectState/addProjectForInvoiceSlice";
import { removeAllProjectsFromInvoiceAction } from "../../states/redux/InvoiceProjectState/addProjectForInvoiceSlice";
import { InvoiceType } from "../../types/types";
import { MdOutlineReplay } from "react-icons/md";
import { useSnackbar } from "notistack";
import { log } from "console";
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
      setTimeout(() => {
        navigate(-1);
      }, 600);
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

  const fetchExchangeRate = async (projectId: string) => {
    setLoadingRate(true);
    setRateError("");

    try {
      // Fetch the latest exchange rates
      const response = await axios.get(
        `https://api.exchangerate-api.com/v4/latest/USD`
      );
      const rates = response.data.rates;

      // Identify the specific project
      const targetProject = editableProjects.find(
        (project) => project._id === projectId
      );

      if (!targetProject) {
        throw new Error("Project not found.");
      }

      // Ensure the currencyType is taken from the project
      const { currencyType, workingPeriodType, adminId, clientId } =
        targetProject;

      let newRate = 1;
      if (currencyType === "dollars") {
        newRate = rates.INR; // USD to INR
      } else if (currencyType === "pounds") {
        newRate = rates.INR / rates.GBP; // GBP to INR
      } else {
        throw new Error("Unsupported currency type.");
      }

      // Update the project's conversion rate locally
      const updatedProjects = editableProjects.map((project) =>
        project._id === projectId
          ? { ...project, conversionRate: newRate }
          : project
      );

      const updatedProject = updatedProjects.find(
        (project) => project._id === projectId
      );

      if (updatedProject) {
        setEditableProjects(updatedProjects);

        // Dispatch the updated project to Redux
        dispatch(updateProjectForInvoiceAction(updatedProject));
        dispatch(
          updateInvoiceObjectStateAction({
            conversionRate: updatedProject.conversionRate,
          })
        );

        // Construct the mutation data with FormData
        const formData = new FormData();
        formData.append("conversionRate", newRate.toString());
        formData.append("workingPeriodType", workingPeriodType);
        formData.append("currencyType", currencyType);
        formData.append("adminId", adminId);
        formData.append("clientId", clientId);

        const mutationData = {
          projectId,
          updatedProjectData: formData,
        };

        // Save the updated conversion rate to the database
        UpdateProjectMutationHandler.mutate(mutationData, {
          onSuccess: () => {
            // Optionally show a success notification
            console.log("Conversion rate updated successfully.");
          },
          onError: (error) => {
            // Handle error and show notification
            setRateError("Failed to save conversion rate. Try again.");
            console.error("Error updating conversion rate:", error);
          },
        });
      }
    } catch (error) {
      setRateError("Failed to fetch exchange rates. Try again.");
      console.error("Error fetching exchange rates:", error);
    } finally {
      setLoadingRate(false);
    }
  };

  const [id, setId] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {
    const project = projectsForInvoice.find(
      (project) => project.clientId === clientObj._id
    );
    if (project) {
      setId(project._id);
    }
  }, [projectsForInvoice, clientObj._id]);
  console.log("id", id);
  const UpdateProjectMutationHandler = useUpdateProject(id, clientObj._id);
  const handleInputChange = (id: string, field: string, value: any) => {
    const newValue = value === "" ? null : value; // Use null instead of empty string
    setEditableProjects((prevProjects) =>
      prevProjects.map((project) => {
        if (project._id === id) {
          const updatedProject = { ...project, [field]: newValue };

          // Dispatch updated project to Redux
          dispatch(
            updateInvoiceObjectStateAction({
              projectName: updatedProject.projectName,
              workingPeriod: updatedProject.workingPeriod,
              conversionRate: updatedProject.conversionRate,
              rate: updatedProject.rate,
              currencyType: updatedProject.currencyType,
              ratePerDay: updatedProject.ratePerDay,
              workingPeriodType: updatedProject.workingPeriodType,
            })
          );

          // Perform amount calculation based on workingPeriodType
          if (updatedProject.workingPeriodType && updatedProject.workingPeriod) {
            if (updatedProject.workingPeriodType === "hours") {
              updatedProject.amount =
                (updatedProject.rate || 0) *
                updatedProject.workingPeriod *
                (updatedProject.conversionRate || 1);
            } else if (
              updatedProject.workingPeriodType === "months" &&
              updatedProject.ratePerDay
            ) {
              updatedProject.amount =
                updatedProject.ratePerDay *
                updatedProject.workingPeriod *
                (updatedProject.conversionRate || 1);
            } else {
              updatedProject.amount =
                (updatedProject.rate || 0) *
                (updatedProject.conversionRate || 1);
            }
          }

          // Prepare FormData for mutation
          if (updatedProject._id) {
            const formData = new FormData();
            formData.append("projectName", updatedProject.projectName || "");
            formData.append(
              "workingPeriodType",
              updatedProject.workingPeriodType || ""
            );
            formData.append("currencyType", updatedProject.currencyType || "");
            formData.append(
              "conversionRate",
              updatedProject.conversionRate?.toString() || "0"
            );
            formData.append(
              "paymentStatus",
              updatedProject.paymentStatus?.toString() || "false"
            );
            formData.append("adminId", updatedProject.adminId || "");
            formData.append("clientId", updatedProject.clientId || "");
            formData.append(
              "workingPeriod",
              updatedProject.workingPeriod?.toString() || "0"
            );
            formData.append("amount", updatedProject.amount?.toString() || "0");
            formData.append(
              "advanceAmount",
              updatedProject.advanceAmount?.toString() || "0"
            );

            const mutationData = {
              projectId: updatedProject._id,
              updatedProjectData: formData,
            };

            // Save the updated data to the database
            UpdateProjectMutationHandler.mutate(mutationData, {
              onSuccess: () => {
                dispatch(updateProjectForInvoiceAction(updatedProject));
                // Optionally show success notification
                console.log("Project updated successfully.");
              },
              onError: (error) => {
                // Optionally handle and log the error
                console.error("Error updating project:", error);
              },
            });
          }
          return updatedProject;
        }
        return project;
      })
    );
  };

  const [workingFixed, setWorkingFixed] = useState(false);
  
  useEffect(() => {
    const updatedProjects = projectsForInvoice.map((project) => {
      const updatedProject = { ...project };

      if (project.workingPeriodType === "fixed") {
        setWorkingFixed(true);
      }

      // Calculate ratePerDay on component mount
      if (project.workingPeriodType === "months" && project.rate) {
        if (invoiceDate) {
          const prevMonth = invoiceDate.subtract(1, "month");
          const daysInPrevMonth = prevMonth.daysInMonth();
          updatedProject.ratePerDay = project.rate / daysInPrevMonth;
        }
      }

      // Set default workingPeriod to 1 if workingPeriodType is "months"
      if (project.workingPeriodType === "months") {
        updatedProject.workingPeriod = project.workingPeriod !== undefined ? project.workingPeriod : 1;
      }

      // Calculate the amount based on the workingPeriodType
      let amount = 0;
      if (project.rate && project.workingPeriodType) {
        if (project.workingPeriodType === "hours" && project.workingPeriod) {
          amount =
            project.rate *
            project.workingPeriod *
            project.conversionRate;
        } else if (
          project.workingPeriodType === "months" &&
          updatedProject.workingPeriod &&
          updatedProject.ratePerDay
        ) {
          amount =
            updatedProject.ratePerDay *
            updatedProject.workingPeriod *
            project.conversionRate;
        } else if (project.workingPeriodType === "fixed") {
          amount = project.rate * project.conversionRate;
        }

        dispatch(updateInvoiceObjectStateAction({
          projectName: updatedProject.projectName,
          workingPeriod: updatedProject.workingPeriod,
          conversionRate: updatedProject.conversionRate,
          rate: updatedProject.rate,
          currencyType: updatedProject.currencyType,
          ratePerDay: updatedProject.ratePerDay,
          workingPeriodType: updatedProject.workingPeriodType,
          clientId: updatedProject.clientId,
          adminId: updatedProject.adminId,
        }));
      }

      updatedProject.amount = amount;

      // Save updated ratePerDay to the database
      if (updatedProject.ratePerDay !== project.ratePerDay) {
        const projectId = updatedProject._id;
        if (!projectId) {
          console.error("Project ID is undefined, cannot save ratePerDay.");
          return updatedProject; // Skip mutation if projectId is undefined
        }

        const formData = new FormData();
        formData.append("ratePerDay", String(updatedProject.ratePerDay ?? 0));
        formData.append("workingPeriodType", updatedProject.workingPeriodType || "");
        formData.append("currencyType", updatedProject.currencyType || "");
        formData.append("adminId", updatedProject.adminId || "");
        formData.append("clientId", updatedProject.clientId || "");

        const mutationData = {
          projectId,
          updatedProjectData: formData, // Pass FormData here
        };

        UpdateProjectMutationHandler.mutate(mutationData, {
          onSuccess: () => {
            console.log(
              `RatePerDay updated successfully for project ${projectId}`
            );
            dispatch(updateProjectForInvoiceAction(updatedProject));
          },
          onError: (error) => {
            console.error(
              `Failed to update ratePerDay for project ${projectId}`,
              error
            );
          },
        });
      }

      return updatedProject;
    });

    setEditableProjects(updatedProjects);
  }, [projectsForInvoice, invoiceDate, workingFixed]);


  React.useEffect(() => {
    if (isAuth && adminId) {
      dispatch(getAdminByIdAction(adminId));
    }
  }, [isAuth, adminId, dispatch]);

  const { data: invoiceObject } = useSelector(
    (state: RootState) => state.invoiceObjectState
  );
  const handleBackButton = () => {
    navigate(-1);
  };

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

  const handleInvoiceNoChange = (newInvoiceNo: number) => {
    dispatch(updateInvoiceObjectStateAction({ invoiceNo: newInvoiceNo }));
  };
  const handleRateChange = (newRate: number, project: ProjectType) => {
    const updatedProject = {
      ...project,
      rate: newRate,
    };
    dispatch(updateProjectForInvoiceAction(updatedProject));
    dispatch(updateInvoiceObjectStateAction(updatedProject));
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
        <div></div>
      </div>
      <div className="flex justify-between items-start gap-2">
        {clientObj && selectedClientState.loading !== "idle" ? (
          <ClientInfoSection />
        ) : null}
        <div className="w-full flex justify-end">
          {windowWidth && windowWidth > 768 ? (
            <>
              <div className="flex flex-col items-end mb-3">
                <div className="flex items-center gap-[20px] mb-1">
                  <label className="w-[130px]">
                    <strong>Invoice Number: </strong>{" "}
                  </label>

                  <TextField
                    variant="outlined"
                    size="small"
                    value={invoiceObject.invoiceNo}
                    onChange={(e) => handleInvoiceNoChange(Number(e.target.value))}
                    className="w-[150px] "
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        padding: "5px 0",
                      },
                    }}
                  />
                </div>

                <div className="flex items-center gap-[20px] mb-1">
                  <label style={{ color: textColor }} className="w-[130px]">
                    <strong>Invoice date: </strong>
                  </label>
                  <DemoItem>
                    <DesktopDatePicker
                      defaultValue={invoiceDate}
                      onChange={(newDate) => handleInvoiceDateChange(newDate)}
                      format="DD/MM/YYYY"
                      className="w-[150px]"
                      // label="Invoice date"
                      sx={{
                        backgroundColor: "#cecece",
                        "& .MuiOutlinedInput-root": {
                          width: "100%",
                        },
                      }}
                    />
                  </DemoItem>
                </div>
                <div className="flex text-start items-center gap-[20px] ">
                  <label style={{ color: textColor }} className="w-[130px]">
                    <strong>Due date: </strong>
                  </label>
                  <DemoItem>
                    <DesktopDatePicker
                      defaultValue={dueDate}
                      onChange={(newDate) => handleDueDateChange(newDate)}
                      format="DD/MM/YYYY"
                      className="w-[150px]"
                      sx={{
                        backgroundColor: "#cecece",
                        "& .MuiOutlinedInput-root": {
                          width: "100%",
                        },
                      }}
                    />
                  </DemoItem>
                </div>
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
                      width: "250px", // Explicitly set a wider width
                      "& .MuiOutlinedInput-root": {
                        width: "100%",
                      },
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
                      width: "250px", // Explicitly set a wider width
                      "& .MuiOutlinedInput-root": {
                        width: "100%",
                      },
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
          <TableContainer
            component={Paper}
            className={`${Styles.table_scroll}`}
          >
            <Table
              sx={{
                borderRadius: "20px !important",
                width: "100%",
                "& .MuiTable-root": {
                  borderRadius: "20px !important", // Applied to the table root
                },
              }}
            >
              <TableHead className={Styles.animated}>
                <TableRow>
                  <TableCell>Project Description</TableCell>
                  <TableCell>Rate</TableCell>
                  {editableProjects.map((project: ProjectType) => (
                    <>
                      {project.workingPeriodType === "months" && (
                        <TableCell>Rate/day</TableCell>
                      )}
                    </>
                  ))}
                  {editableProjects.map((project: ProjectType) => (
                    <>
                      {project.workingPeriodType !== "fixed" &&
                        (project.workingPeriodType === "months" ? (
                          <TableCell className="w-[175px]">
                            Working Days
                          </TableCell>
                        ) : (
                          <TableCell className="w-[175px]">
                            Working Hours
                          </TableCell>
                        ))}
                    </>
                  ))}
                  <TableCell className="w-[175px]">Conversion Rate</TableCell>
                  <TableCell className="w-[110px]">Subtotal</TableCell>
                  <TableCell className="w-[110px]">Remove</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {editableProjects.map((project: ProjectType) => (
                  <TableRow
                    key={project._id}
                    className={`${Styles.project_row}`}
                  >
                    {/* <TableCell className="text-[19px] overflow-hidden whitespace-nowrap text-ellipsis">
                      {project.projectName}
                    </TableCell>                    */}
                    <TableCell className="text-[19px] overflow-hidden whitespace-nowrap text-ellipsis">
                      <TextField
                        variant="outlined"
                        size="small"
                        type="text"
                        value={project.projectName}
                        onChange={(e) => {
                          const target = e.target as HTMLInputElement; // Cast to HTMLInputElement
                          handleInputChange(project._id ?? "", "projectName", target.value);
                        }}
                      />
                    </TableCell>

                    <TableCell className="text-[13px] w-[150px]">
                      <TextField
                        variant="outlined"
                        size="small"
                        value={project.rate || ""}
                        onChange={(e) => handleRateChange(Number(e.target.value), project)}
                        InputProps={{
                          endAdornment: (
                            <Typography variant="body2" style={{ marginLeft: "8px" }}>
                              {project.currencyType === "rupees"
                                ? project.workingPeriodType === "fixed"
                                  ? "₹/fixed"
                                  : `₹/${project.workingPeriodType === "hours" ? "hours" : "months"}`
                                : project.currencyType === "dollars"
                                  ? project.workingPeriodType === "fixed"
                                    ? "$/fixed"
                                    : `$/${project.workingPeriodType === "hours" ? "hours" : "months"}`
                                  : project.currencyType === "pounds"
                                    ? project.workingPeriodType === "fixed"
                                      ? "£/fixed"
                                      : `£/${project.workingPeriodType === "hours" ? "hours" : "months"}`
                                    : ""}
                            </Typography>
                          ),
                        }}
                      />

                    </TableCell>

                    {project.workingPeriodType === "months" && (
                      <TableCell className="text-[13px] w-[150px]">
                        <Typography variant="body2">
                          {project.ratePerDay
                            ? ` ${project.currencyType === "rupees"
                              ? "₹"
                              : project.currencyType === "dollars"
                                ? "$"
                                : project.currencyType === "pounds"
                                  ? "£"
                                  : ""
                            } ${project.ratePerDay.toFixed(2)}`
                            : "NA"}
                        </Typography>
                      </TableCell>
                    )}

                    {project.workingPeriodType !== "fixed" && (
                      <TableCell className="text-[13px] w-[150px]">
                        <TextField
                          variant="outlined"
                          size="small"
                          type="text"
                          value={project.workingPeriod}
                          onInput={(e) => {
                            const target = e.target as HTMLInputElement; // Cast to HTMLInputElement
                            const value = target.value;
                            if (!/^\d*$/.test(value)) {
                              target.value = value.slice(0, -1); // Remove last character if invalid
                            }
                          }}
                          onChange={(e) => {
                            const target = e.target as HTMLInputElement; // Cast to HTMLInputElement
                            handleInputChange(
                              project._id ?? "",
                              "workingPeriod",
                              Number(target.value)
                            );
                          }}
                        />
                      </TableCell>
                    )}


                    <TableCell className="text-[13px] w-[150px] ">
                      <div className="relative">
                        <TextField
                          variant="outlined"
                          size="small"
                          value={project.conversionRate.toFixed(2)}
                          onChange={(e) => fetchExchangeRate(project._id ?? "")}
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
                              onClick={() => fetchExchangeRate(project._id!)}
                              disabled={loadingRate}
                              sx={{
                                position: "absolute",
                                right: "-12px",
                                top: "-1px",
                                "&:hover": {
                                  backgroundColor: "transparent",
                                },
                              }}
                            >
                              <MdOutlineReplay />
                            </Button>
                            {rateError && <p>{rateError}</p>}
                          </>
                        ) : null}
                      </div>
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
          <BillAmount workingFixed={workingFixed} />
        </div>
      ) : (
        <div>
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
