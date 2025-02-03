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
import { useUpdateProject } from "../../states/query/Project_queries/projectQueries";
import { DemoItem } from "@mui/x-date-pickers/internals/demo";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import dayjs, { Dayjs } from "dayjs";
import { updateInvoiceObjectStateAction } from "../../states/redux/InvoiceProjectState/invoiceObjectState";
import { updateProjectForInvoiceAction } from "../../states/redux/InvoiceProjectState/addProjectForInvoiceSlice";
import { MdOutlineReplay } from "react-icons/md";
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
      const response = await axios.get(
        `https://api.exchangerate-api.com/v4/latest/USD`
      );
      const rates = response.data.rates;
      const targetProject = editableProjects.find(
        (project) => project._id === projectId
      );

      if (!targetProject) {
        throw new Error("Project not found.");
      }
      const { currencyType, workingPeriodType, adminId, clientId } =
        targetProject;

      let newRate = 1;
      if (currencyType === "dollars") {
        newRate = rates.INR;
      } else if (currencyType === "pounds") {
        newRate = rates.INR / rates.GBP;
      } else {
        throw new Error("Unsupported currency type.");
      }
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
        dispatch(updateProjectForInvoiceAction(updatedProject));
        dispatch(
          updateInvoiceObjectStateAction({
            conversionRate: updatedProject.conversionRate,
          })
        );

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

        UpdateProjectMutationHandler.mutate(mutationData, {
          onSuccess: () => { },
          onError: (error) => {
            // Handle error and show notification
            setRateError("Failed to save conversion rate. Try again.");
          },
        });
      }
    } catch (error) {
      setRateError("Failed to fetch exchange rates. Try again.");
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
  const UpdateProjectMutationHandler = useUpdateProject(id, clientObj._id);
  const handleInputChange = (id: string, field: string, value: any) => {
    
    const newValue =
      value === "" ? null : field === "sacNo" ? Number(value) : value; // Convert sacNo to number
    setEditableProjects((prevProjects) =>
      prevProjects.map((project) => {
        if (project._id === id) {
          const updatedProject = { ...project, [field]: newValue };
          dispatch(
            updateInvoiceObjectStateAction({
              projectName: updatedProject.projectName,
              resumeName: updatedProject.resumeName,
              workingPeriod: updatedProject.workingPeriod,
              conversionRate: updatedProject.conversionRate,
              rate: updatedProject.rate,
              currencyType: updatedProject.currencyType,
              ratePerDay: updatedProject.ratePerDay,
              workingPeriodType: updatedProject.workingPeriodType,
              sacNo: updatedProject.sacNo,
              description: updatedProject.description,
              actualDays: updatedProject.actualDays,
              billDate: invoiceDate ? invoiceDate.toISOString() : "",
              dueDate: dueDate ? dueDate.toISOString() : "",
            })
          );

          if (
            updatedProject.workingPeriodType &&
            updatedProject.workingPeriod
          ) {
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

          if (updatedProject._id) {
            const formData = new FormData();
            formData.append("projectName", updatedProject.projectName || "");
            formData.append("resumeName", updatedProject.resumeName || "");
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
            formData.append(
              "actualDays",
              updatedProject.actualDays?.toString() || "30"
            );
            formData.append("amount", updatedProject.amount?.toString() || "0");
            formData.append(
              "advanceAmount",
              updatedProject.advanceAmount?.toString() || "0"
            );
            formData.append("sacNo", updatedProject.sacNo?.toString() || "0");
            formData.append("description", updatedProject.description || "");
            formData.append(
              "billDate",
              invoiceDate ? invoiceDate.toISOString() : ""
            );
            formData.append("dueDate", dueDate ? dueDate.toISOString() : "");

            const mutationData = {
              projectId: updatedProject._id,
              updatedProjectData: formData,
            };

            UpdateProjectMutationHandler.mutate(mutationData, {
              onSuccess: () => {
                dispatch(updateProjectForInvoiceAction(updatedProject));
              },
              onError: (error) => { },
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

      if (project.workingPeriodType === "months" && project.rate) {
        if (invoiceDate && project.actualDays) {
          updatedProject.ratePerDay = project.rate / project.actualDays;
        }
      }

      if (project.workingPeriodType === "months") {
        updatedProject.workingPeriod =
          project.workingPeriod !== undefined ? project.workingPeriod : 1;
        updatedProject.actualDays =
          project.actualDays !== undefined ? project.actualDays : 1;
      }

      let amount = 0;
      if (project.rate && project.workingPeriodType) {
        if (project.workingPeriodType === "hours" && project.workingPeriod) {
          amount =
            project.rate * project.workingPeriod * project.conversionRate;
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

        dispatch(
          updateInvoiceObjectStateAction({
            projectName: updatedProject.projectName,
            resumeName: updatedProject.resumeName,
            workingPeriod: updatedProject.workingPeriod,
            conversionRate: updatedProject.conversionRate,
            rate: updatedProject.rate,
            currencyType: updatedProject.currencyType,
            ratePerDay: updatedProject.ratePerDay,
            workingPeriodType: updatedProject.workingPeriodType,
            clientId: updatedProject.clientId,
            adminId: updatedProject.adminId,
            actualDays: updatedProject.actualDays,
            description: updatedProject.description,
            billDate: invoiceDate ? invoiceDate.toISOString() : "", // Include updated invoice date
            dueDate: dueDate ? dueDate.toISOString() : "",
          })
        );
      }

      updatedProject.amount = amount;

      if (updatedProject.ratePerDay !== project.ratePerDay) {
        const projectId = updatedProject._id;
        if (!projectId) {
          return updatedProject;
        }

        const formData = new FormData();
        formData.append("ratePerDay", String(updatedProject.ratePerDay ?? 0));
        formData.append("actualDays", String(updatedProject.actualDays ?? 0));
        formData.append(
          "workingPeriodType",
          updatedProject.workingPeriodType || ""
        );
        formData.append("currencyType", updatedProject.currencyType || "");
        formData.append("adminId", updatedProject.adminId || "");
        formData.append("clientId", updatedProject.clientId || "");

        const mutationData = {
          projectId,
          updatedProjectData: formData,
        };

        UpdateProjectMutationHandler.mutate(mutationData, {
          onSuccess: () => {
            dispatch(updateProjectForInvoiceAction(updatedProject));
          },
          onError: (error) => { },
        });
      }

      return updatedProject;
    });

    setEditableProjects(updatedProjects);
  }, [projectsForInvoice, invoiceDate, workingFixed, dueDate]);

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

    if (
      !newDate ||
      !newDate.isValid() ||
      newDate.year().toString().length < 4 ||
      newDate.month() === undefined ||
      newDate.date() === undefined
    ) {
      return;
    }
    if (dueDate && newDate.isAfter(dueDate)) {
      dispatch(
        updateInvoiceObjectStateAction({ billDate: newDate })
      );
      enqueueSnackbar("Invoice date cannot be after the due date.", {
        variant: "error",
      });
      return;
    }

    setInvoiceDate(newDate);


    if (!dueDate || !dueDate.isValid()) {
      const newDueDate = newDate.add(1, "day");
      setDueDate(newDueDate);
      dispatch(
        updateInvoiceObjectStateAction({ dueDate: newDueDate.toISOString() })
      );
    }

    try {
      const iso8601InvoiceDate = newDate.toISOString();
      dispatch(
        updateInvoiceObjectStateAction({ billDate: iso8601InvoiceDate })
      );
    } catch (error) {
      console.error("Error converting invoice date to ISO string:", error);
      enqueueSnackbar("Failed to process the invoice date. Please try again.", {
        variant: "error",
      });
    }
  };

  const handleDueDateChange = (newDate: dayjs.Dayjs | null) => {
    if (!newDate || !newDate.isValid()) {
      dispatch(updateInvoiceObjectStateAction({ dueDate: "" }));
      setAllowDownload(false);
      return;
    }

    if (
      newDate.year().toString().length < 4 ||
      newDate.month() === undefined ||
      newDate.date() === undefined
    ) {
      return;
    }

    if (newDate.isBefore(invoiceDate)) {
      enqueueSnackbar("Due date cannot be before invoice date.", {
        variant: "error",
      });
      setAllowDownload(false);
      dispatch(updateInvoiceObjectStateAction({ dueDate: "" }));
      return;
    }

    setDueDate(newDate);
    setAllowDownload(true);

    try {
      const iso8601DueDate = newDate.toISOString();
      dispatch(updateInvoiceObjectStateAction({ dueDate: iso8601DueDate }));
    } catch (error) {
      console.error("Error converting due date to ISO string:", error);
      enqueueSnackbar("Failed to process the due date. Please try again.", {
        variant: "error",
      });
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


  const handleProjectNameChange = (
    newProjectName: string,
    project: ProjectType
  ) => {
    const updatedProject = {
      ...project,
      projectName: newProjectName,
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
          <ClientInfoSection projectsForInvoice={projectsForInvoice} />
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
                    onChange={(e) =>
                      handleInvoiceNoChange(Number(e.target.value))
                    }
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
                      sx={{
                        backgroundColor: "#cecece",
                        "& .MuiOutlinedInput-root": {
                          width: "100%",
                        },
                      }}
                    />
                  </DemoItem>
                </div>
                <div className="flex text-start items-center gap-[20px]">
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
                      width: "250px",
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
                      width: "250px",
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
        <div className="rounded-[20px] overflow-x-auto">
          <TableContainer
            component={Paper}
            className={`${Styles.table_scroll}`}
          >
            <Table sx={{ minWidth: "1500px" }} size="small">
              <TableHead className={Styles.animated}>
                <TableRow>
                  {editableProjects.map((project: ProjectType) => (
                    <>
                      <TableCell
                        key={`description-${project._id}`}
                        className={`${project.workingPeriodType === "months"
                          ? "w-[200px]"
                          : project.workingPeriodType === "hours" ||
                            project.workingPeriodType === "fixed"
                            ? "w-[150px]"
                            : "w-[150px]"
                          }`}
                      >
                        Description
                      </TableCell>
                    </>
                  ))}
                  {editableProjects.map((project: ProjectType) => (
                    <>
                      <TableCell
                        key={`rate-${project._id}`}
                        className={`${project.workingPeriodType === "months"
                          ? "w-[110px]"
                          : "w-[90px]"
                          }`}
                      >
                        Rate/
                        {project.workingPeriodType === "fixed"
                          ? "fixed"
                          : project.workingPeriodType === "hours"
                            ? "hour"
                            : "month"}
                      </TableCell>
                    </>
                  ))}
                  {editableProjects.map((project: ProjectType) => (
                    <>
                      {project.workingPeriodType === "months" && (
                        <TableCell
                          key={`rate-day-${project._id}`}
                          className="w-[110px]"
                          sx={{ padding: "4px" }}
                        >
                          Rate/day
                        </TableCell>
                      )}
                    </>
                  ))}
                  {editableProjects.map((project: ProjectType) => (
                    <>
                      {project.workingPeriodType !== "fixed" &&
                        (project.workingPeriodType === "months" ? (
                          <>
                            <TableCell
                              key={`working-days-${project._id}`}
                              className="w-[90px]"
                            >
                              Working Days
                            </TableCell>
                            <TableCell
                              key={`actual-days-${project._id}`}
                              className="w-[90px]"
                            >
                              Actual Days
                            </TableCell>
                          </>
                        ) : (
                          <TableCell
                            key={`working-hours-${project._id}`}
                            className="w-[90px]"
                          >
                            Working Hours
                          </TableCell>
                        ))}
                      <TableCell className="w-[110px]">SAC Code</TableCell>
                      {project.currencyType !== "rupees" && (
                        <TableCell
                          key={`conversionRate-${project._id}`}
                          className="w-[120px]"
                          sx={{ padding: "4px" }}
                        >
                          Conversion Rate
                        </TableCell>
                      )}

                      <TableCell
                        key={`subtotal-${project._id}`}
                        className="w-[90px]"
                      >
                        Subtotal
                      </TableCell>
                    </>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {editableProjects.map((project: ProjectType) => (
                  <TableRow
                    key={project._id}
                    className={`${Styles.project_row}`}
                  >
                    <TableCell
                      key={`description-${project._id}`}
                      className={`${project.workingPeriodType === "months"
                        ? "w-[200px]"
                        : project.workingPeriodType === "hours" ||
                          project.workingPeriodType === "fixed"
                          ? "w-[150px]"
                          : "w-[150px]"
                        }`}
                    >
                      <TextField
                        variant="outlined"
                        size="small"
                        value={project.description ?? ""}
                        onChange={(e) => {
                          handleInputChange(
                            project._id ?? "",
                            "description",
                            e.target.value
                          );
                        }}
                        fullWidth
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "30px",
                            width: "200px",
                          },
                          "& input": {
                            padding: "10px",
                          },
                        }}
                      />
                    </TableCell>
                    
                    <TableCell
                      key={`rate-${project._id}`}
                      className={`${project.workingPeriodType === "months" ? "w-[110px]" : "w-[90px]"
                        }`}
                    >
                      <TextField
                        variant="outlined"
                        size="small"
                        value={project.rate || ""}
                        sx={{ width: "130px" }}
                        onChange={(e) => {
                          const inputValue = e.target.value;
                          if (/^\d{0,12}$/.test(inputValue)) {
                            handleRateChange(Number(inputValue), project);
                          }
                        }}
                        InputProps={{
                          startAdornment: (
                            <Typography
                              variant="body2"
                              style={{ marginLeft: "8px", marginRight: "6px" }}
                            >
                              {project.currencyType === "rupees"
                                ? "₹"
                                : project.currencyType === "dollars"
                                  ? "$"
                                  : project.currencyType === "pounds"
                                    ? "£"
                                    : ""}
                            </Typography>
                          ),
                        }}
                      />
                    </TableCell>


                    {project.workingPeriodType === "months" && (
                      <TableCell className="text-[13px] w-[110px]">
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
                      <TableCell
                        className={`text-[13px] ${project.workingPeriodType === "months"
                          ? "w-[90px]"
                          : "w-[80px]"
                          }`}
                      >
                       
                        <TextField
                          variant="outlined"
                          size="small"
                          type="text"
                          value={project.workingPeriod}
                          sx={{ width: "80px" }}
                          onInput={(e) => {
                            const target = e.target as HTMLInputElement;
                            let value = target.value;

                            // Allow only numbers and limit to 4 digits
                            if (!/^\d{0,4}$/.test(value)) {
                              target.value = value.slice(0, 4).replace(/\D/g, ''); // Trim to 4 digits and remove non-numeric characters
                            }
                          }}
                          onChange={(e) => {
                            const target = e.target as HTMLInputElement;
                            let value = target.value.replace(/\D/g, ''); // Remove non-numeric characters

                            // Update the state only if the value is a valid number
                            if (value !== '') {
                              handleInputChange(
                                project._id ?? "",
                                "workingPeriod",
                                Number(value)
                              );
                            } else {
                              // If the value is empty, you can set it to 0 or any other default value
                              handleInputChange(
                                project._id ?? "",
                                "workingPeriod",
                                0
                              );
                            }
                          }}
                        />
                      </TableCell>
                    )}
                    {project.workingPeriodType === "months" && (
                      <TableCell className="text-[13px] w-[90px]">
                       
                        <TextField
                          variant="outlined"
                          size="small"
                          type="text"
                          value={project.actualDays}
                          sx={{ width: "80px" }}
                          onInput={(e) => {
                            const target = e.target as HTMLInputElement;
                            const value = target.value;

                            // Allow only digits and limit to 4 characters
                            if (!/^\d{0,4}$/.test(value)) {
                              target.value = value.slice(0, 4).replace(/\D/g, '');
                            }
                          }}
                          onChange={(e) => {
                            const target = e.target as HTMLInputElement;
                            const value = target.value;

                            // Ensure the value is a 4-digit number
                            if (/^\d{0,4}$/.test(value)) {
                              handleInputChange(
                                project._id ?? "",
                                "actualDays",
                                Number(value)
                              );
                            }
                          }}
                        />
                      </TableCell>
                    )}

                    <TableCell
                      className="text-[13px] w-[90px]"
                      sx={{ padding: "4px" }}
                    >
                     
                      <TextField
                        variant="outlined"
                        size="small"
                        type="text"
                        value={project.sacNo || ""}
                        sx={{ width: "100px" }} // Adjust width for better visibility
                        error={!!project.sacNo && !/^99\d{2}(\d{2})?$/.test(project.sacNo.toString())}
                        helperText={
                          !!project.sacNo && !/^99\d{2}(\d{2})?$/.test(project.sacNo.toString())
                            ? "Invalid SAC No (must start with 99 and be 4 or 6 digits)"
                            : ""
                        }
                        inputProps={{ maxLength: 6 }} // Limits input to 6 characters
                        onInput={(e) => {
                          const target = e.target as HTMLInputElement;
                          let value = target.value;

                          // Allow only numbers & limit to 6 digits
                          if (!/^\d*$/.test(value)) {
                            value = value.replace(/\D/g, ""); // Remove non-numeric characters
                          }

                          if (value.length > 6) {
                            value = value.slice(0, 6); // Trim to 6 digits
                          }

                          target.value = value;
                        }}
                        onChange={(e) => {
                          const target = e.target as HTMLInputElement;
                          handleInputChange(
                            project._id ?? "",
                            "sacNo",
                            target.value ? Number(target.value) : null // Convert to number
                          );
                        }}
                      />


                    </TableCell>

                    {project.currencyType !== "rupees" && (
                      <TableCell className="text-[13px] w-[120px]">
                        <div className="relative">
                          <TextField
                            variant="outlined"
                            size="small"
                            value={project.conversionRate.toFixed(2)}
                            sx={{ width: "120px" }}
                            onChange={(e) =>
                              fetchExchangeRate(project._id ?? "")
                            }
                            InputProps={{
                              startAdornment: (
                                <span>
                                  {project.currencyType === "dollars"
                                    ? "$"
                                    : project.currencyType === "pounds"
                                      ? "£"
                                      : ""}
                                </span>
                              ),
                              endAdornment: (
                                <Button
                                  onClick={() =>
                                    fetchExchangeRate(project._id!)
                                  }
                                  disabled={loadingRate}
                                  sx={{
                                    minWidth: "24px",
                                    padding: "0",
                                    marginLeft: "-8px",
                                    "&:hover": {
                                      backgroundColor: "transparent",
                                    },
                                  }}
                                >
                                  <MdOutlineReplay fontSize="small" />
                                </Button>
                              ),
                            }}
                          />

                          {rateError && <p>{rateError}</p>}
                        </div>
                      </TableCell>
                    )}

                    <TableCell className="text-[13px]w-[100px]">
                      &#x20B9;{project.amount ? project.amount.toFixed(2) : 0}
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
