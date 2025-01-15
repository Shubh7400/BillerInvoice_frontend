import React, { useContext, useEffect, useRef, useState } from "react";
import Styles from "./ProjectTable.module.css";
import CompoAddProject from "./CompoAddProject";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../states/redux/store";
import { AuthContext } from "../../states/context/AuthContext/AuthContext";
import {
  useDeleteProject,
  useFetchAllProjectsByAdminId,
  useFetchAllProjectsByClientId,
} from "../../states/query/Project_queries/projectQueries";
import {
  Alert,
  Button,
  Checkbox,
  FormControlLabel,
  useTheme,
  Box,
} from "@mui/material";
import { queryClient } from "../..";
import { useSnackbar } from "notistack";
import {
  ClientType,
  ProjectType
} from "../../types/types";
import {
  addAllProjectsForInvoiceAction,
  addProjectForInvoiceAction,
  removeAllProjectsFromInvoiceAction,
} from "../../states/redux/InvoiceProjectState/addProjectForInvoiceSlice";
import ActionConfirmer from "../SideBar/ActionConfirmer";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ClientInfoSection from "../Client_Component/ClientInfoSection";
import { getAllClientsByAdminIdAction } from "../../states/redux/ClientStates/allClientSlice";
import { getClientByIdAction } from "../../states/redux/ClientStates/selectedClientSlice";
import { CiEdit } from "react-icons/ci";
import { FaEye } from "react-icons/fa";

import { getProjectByIdAction } from "../../states/redux/ProjectState/selectedProjectSlice";

const ProjectTable = ({
  projectTableforClient,
}: {
  projectTableforClient: boolean;
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { enqueueSnackbar } = useSnackbar();
  const materialTheme = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  // -----------------------------------------------------
  const { isAuth, adminId } = useContext(AuthContext);
  const selectedClientState = useSelector(
    (state: RootState) => state.selectedClientState
  );
  const clientObj: ClientType = selectedClientState.data;

  const [ProjectData, setProjectData] = useState<ProjectType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectType | null>(
    null
  );
  const [searchProjectName, setSearchProjectName] = useState("");
  const { isLoading, data, isError } = useFetchAllProjectsByAdminId(
    adminId,
    projectTableforClient
  );
  const {
    isLoading: clientProjectTableLoading,
    data: clientProjectTableData,
    isError: clientProjectTableError,
  } = useFetchAllProjectsByClientId(clientObj._id, projectTableforClient);

  const DeleteProjectMutationHandler = useDeleteProject(
    selectedClientState.data._id
  );

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
  const getClientName = (clientId: string) => {
    const selectData = clients.find((item) => item._id === clientId);
    return selectData?.clientName || "";
  };

  useEffect(() => {
    if (projectTableforClient && clientProjectTableData) {
      setProjectData(clientProjectTableData);
    } else if (data) {
      setProjectData(data);
    }
    return () => {
      setProjectData([]);
    };
  }, [
    isLoading,
    data,
    isError,
    clientProjectTableLoading,
    clientProjectTableData,
    clientProjectTableError,
    projectTableforClient,
  ]);

  useEffect(() => {
    dispatch(removeAllProjectsFromInvoiceAction());
  }, []);
  // -----------------------------------------------------
  const [allChecked, setAllChecked] = useState<boolean>();
  type CheckboxRefType = Array<HTMLInputElement | null>;
  const checkboxesRefs = useRef<CheckboxRefType>([]);
  const [selectedProjectId, setSelectedProjectId] = React.useState<
    string | undefined
  >("");
  const [projectDetails, setProjectDetails] = useState<ProjectType[]>([]);
  const [projectId, setProjectId] = React.useState<any>([]);
  const { projectsForInvoice } = useSelector(
    (state: RootState) => state.projectsForInvoiceState
  );
  useEffect(() => {
    if (projectsForInvoice?.length !== 0) {
      setProjectId(projectsForInvoice.map((project) => project._id));
      setProjectDetails(projectsForInvoice);
    }
  }, [projectsForInvoice]);

  const handleProjectDelete = (projectId: string) => {
    DeleteProjectMutationHandler.mutate(projectId, {
      onSuccess: () => {
        enqueueSnackbar("Project deleted successfully.", {
          variant: "success",
        });
        // Update the project list locally
        setProjectData((prevProjects) =>
          prevProjects.filter((project) => project._id !== projectId)
        );
        queryClient.refetchQueries(["projects", selectedClientState.data._id]);
      },

      onError: () => {
        enqueueSnackbar("Error in deleting project. Try again!", {
          variant: "error",
        });
      },
    });
  };

  const handleAllCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    data: ProjectType[]
  ) => {
    let isAllChecked = e.target.checked;
    setAllChecked(isAllChecked);

    checkboxesRefs.current.forEach((checkboxRef) => {
      if (checkboxRef) {
        checkboxRef.checked = isAllChecked;
      }
    });

    if (isAllChecked) {
      dispatch(addAllProjectsForInvoiceAction(data));
    } else if (!isAllChecked) {
      dispatch(removeAllProjectsFromInvoiceAction());
    }
  };

  const handleSearchProjectName = (data: string) => {
    setSearchProjectName(data);
  };
  const handleSingleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    project: ProjectType
  ) => {
    const isChecked = e.target.checked;

    if (isChecked) {

      setProjectId([project._id]);
      setSelectedProjectId(project._id);
      setProjectDetails([project]);
      setAllChecked(false);
    } else {

      setProjectId([]);
      setSelectedProjectId("");
      setProjectDetails([]);
      setAllChecked(false);
    }
  };

  // const handleSingleCheckboxChange = (
  //   e: React.ChangeEvent<HTMLInputElement>,
  //   index: number,
  //   project: ProjectType
  // ) => {
  //   const isChecked = e.target.checked;

  //   if (isChecked) {
  //     // Add project if not already selected
  //     if (!projectId.includes(project._id)) {
  //       setProjectId([...projectId, project._id]); // Immutable update
  //       setSelectedProjectId(project._id);
  //       setProjectDetails([...projectDetails, project]); // Add to details
  //     }
  //   } else {
  //     // Remove project when deselected
  //     const updatedProjectId = projectId.filter((id:any) => id !== project._id);
  //     const updatedProjectDetails = projectDetails.filter(
  //       (detail) => detail._id !== project._id
  //     );

  //     setProjectId(updatedProjectId); // Immutable update
  //     setSelectedProjectId(""); // Clear selected ID
  //     setProjectDetails(updatedProjectDetails); // Remove from details
  //     setAllChecked(updatedProjectId.length === projectsForInvoice.length); // Update "Select All" state
  //   }
  // };

  const handleConfirmSelection = (selectedProject?: ProjectType) => {
    if (selectedProject && selectedProject.clientId) {
      dispatch(getClientByIdAction(selectedProject.clientId));
    }
    if (projectDetails) {
      if (projectTableforClient) {
        projectDetails.forEach((project: ProjectType) => {
          dispatch(addProjectForInvoiceAction(project));
        });
      } else {
        if (selectedProject) {
          dispatch(addProjectForInvoiceAction(selectedProject));
        }
      }
      navigate("/client/invoices");
    }
  };

  const handleEditProject = (project: ProjectType) => {
    if (project && project?._id) {
      dispatch(getProjectByIdAction(project._id));
    }
    navigate("/edit-project");
  };

  const handleViewProject = (project: ProjectType) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedProject(null);
    setIsModalOpen(false);
  };
  return (
    <section>
      <div>
        <CompoAddProject
          clientId={selectedClientState.data._id}
          adminId={adminId}
          forAddProject={true}
          projectTableforClient={projectTableforClient}
          setSearchProjectName={handleSearchProjectName}
          searchProjectName={searchProjectName}
          handleProjectEdit={handleEditProject}
        />
        {clientObj &&
        selectedClientState.loading !== "idle" &&
        projectTableforClient ? (
          <ClientInfoSection projectsForInvoice={projectsForInvoice} />
        ) : null} 
      </div>
      {!projectTableforClient ? (
        <>
          {isError || isLoading || (data === "" && data?.length <= 0) ? (
            <div>
              <div className="text-xl font-bold text-center p-4 ">
                <h3>PROJECT DETAILS</h3>
                {isError || clientProjectTableError ? (
                  <p className="font-thin p-4 ">
                    <Alert severity="error">
                      Network request error, refresh!!!
                    </Alert>
                  </p>
                ) : null}
                {(data && (data === "" || data?.length <= 0)) ||
                (clientProjectTableData &&
                  (clientProjectTableData === "" ||
                    clientProjectTableData?.length <= 0)) ? (
                  <p className="text-lg text-purple-500 font-thin dark:text-purple-300 p-4 ">
                    No project available !
                  </p>
                ) : null}
              </div>
            </div>
          ) : (
            <div className="  rounded-[20px]">
              <TableContainer className={Styles.table_scroll}>
                <Table>
                  <TableHead className={Styles.animated}>
                    <TableRow>
                      <TableCell
                        sx={{
                          paddingX: "10px",
                          width: "auto",
                          paddingLeft: "0",
                          paddingRight: "0",
                        }}
                      >
                        Sr.No.
                      </TableCell>

                      <TableCell
                        sx={{
                          paddingX: "10px",
                          width: "auto",
                          paddingLeft: "0",
                          paddingRight: "0",
                        }}
                      >
                        Client Name
                      </TableCell>
                      <TableCell
                        sx={{
                          paddingX: "10px",
                          width: "auto",
                          paddingLeft: "0",
                          paddingRight: "0",
                        }}
                      >
                        Resume Name
                      </TableCell>
                      <TableCell
                        sx={{
                          paddingX: "10px",
                          width: "auto",
                          paddingLeft: "0",
                          paddingRight: "0",
                        }}
                      >
                        Project
                      </TableCell>
                      <TableCell
                        sx={{
                          paddingX: "10px",
                          width: "auto",
                          paddingLeft: "20px",
                          paddingRight: "0",
                        }}
                      >
                        Rate
                      </TableCell>
                      <TableCell
                        sx={{
                          paddingX: "10px",
                          width: "auto",
                          paddingLeft: "0",
                          paddingRight: "0",
                        }}
                      >
                        Conversion Rate
                      </TableCell>
                      <TableCell
                        sx={{
                          paddingX: "1px",
                          width: "auto",
                          paddingLeft: "30px",
                          paddingRight: "0",
                        }}
                      >
                        Action
                      </TableCell>
                      <TableCell
                        sx={{
                          paddingX: "10px",
                          width: "auto",
                          paddingLeft: "0",
                          paddingRight: "0",
                        }}
                      >
                        Selection
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {ProjectData &&
                      ProjectData?.filter((project) => {
                        if (searchProjectName?.length <= 0) return true;
                        const searchLower = searchProjectName.toLowerCase();
                        // return project.projectName
                        //   .toLowerCase()
                        //   .startsWith(searchProjectName.toLowerCase());
                        // Check if any field matches the search term
                        return (
                          (project.projectName
                            ?.toLowerCase()
                            .startsWith(searchLower) ??
                            false) ||
                          (project.resumeName
                            ?.toLowerCase()
                            .startsWith(searchLower) ??
                            false) ||
                          (project.clientDetails?.clientName
                            ?.toLowerCase()
                            .startsWith(searchLower) ??
                            false)
                        );
                      }).map((project: ProjectType, index: number) => (
                        <TableRow key={project._id} className="p-3">
                          <TableCell
                            sx={{
                              paddingX: "16px",
                              textAlign: "center",
                              width: "auto",
                            }}
                          >
                            {index + 1}
                          </TableCell>

                          <TableCell sx={{ paddingX: "16px", width: "auto" }}>
                            {project.clientDetails?.clientName}
                          </TableCell>
                          <TableCell sx={{ paddingX: "16px", width: "auto" }}>
                            {project.resumeName}
                          </TableCell>
                          <TableCell sx={{ paddingX: "16px", width: "auto" }}>
                            {project.projectName}
                          </TableCell>
                          <TableCell sx={{ paddingX: "16px", width: "auto" }}>
                            {project.rate}(
                            {project.currencyType === "rupees" ? (
                              <span>&#x20B9;</span>
                            ) : project.currencyType === "dollars" ? (
                              <span>$</span>
                            ) : project.currencyType === "pounds" ? (
                              <span>&#163;</span>
                            ) : null}
                            /{project.workingPeriodType})
                          </TableCell>

                          <TableCell sx={{ paddingX: "16px", width: "auto" }}>
                            <span>&#x20B9; </span>
                            {(project?.conversionRate ?? 0).toFixed(2)}
                          </TableCell>

                          <TableCell sx={{ paddingX: "16px", width: "255px" }}>
                            <div className="flex">
                              <div className={Styles.editButton}>
                                <div className="">
                                  <Button
                                    onClick={() => handleViewProject(project)}
                                    sx={{
                                      color: materialTheme.palette.primary.main,
                                      ":hover": {
                                        color:
                                          materialTheme.palette.secondary.main,
                                      },
                                    }}
                                  >
                                    <FaEye size={20} />
                                  </Button>
                                  <Button
                                    disabled={!adminId}
                                    variant="outlined"
                                    sx={{
                                      color: materialTheme.palette.primary.main,
                                      borderColor:
                                        materialTheme.palette.primary.main,
                                      ":hover": {
                                        borderColor:
                                          materialTheme.palette.secondary.main,
                                        backgroundColor:
                                          materialTheme.palette.secondary.main,
                                        color: "white",
                                      },
                                      cursor: "pointer",
                                    }}
                                    onClick={() => {
                                      if (project) {
                                        handleEditProject(project);
                                      }
                                    }}
                                  >
                                    <CiEdit size={25} />
                                  </Button>
                                </div>
                              </div>
                              <div className={Styles.editButton}>
                                <ActionConfirmer
                                  actionTag="Delete"
                                  actionFunction={handleProjectDelete}
                                  parameter={project._id}
                                />
                              </div>
                            </div>
                          </TableCell>
                          <TableCell
                            sx={{
                              paddingY: "8px",
                              paddingX: "16px",
                              width: "auto",
                            }}
                          >
                            <div>
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleConfirmSelection(project)}
                                sx={{
                                  backgroundColor: "#d9a990",
                                  borderRadius: "20px",
                                  ":hover": {
                                    backgroundColor: "#4a6180",
                                  },
                                }}
                              >
                                view
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Modal */}

              {selectedProject && (
                <Dialog
                  open={isModalOpen}
                  onClose={handleCloseModal}
                  maxWidth="sm"
                  fullWidth
                >
                  <DialogTitle>Project Details</DialogTitle>
                  <DialogContent>
                    <Typography variant="body1">
                      <strong>Project Name:</strong>{" "}
                      {selectedProject.projectName}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Client Name:</strong>{" "}
                      {getClientName(selectedProject.clientId)}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Rate:</strong> {selectedProject.rate?.toFixed(2)}
                      {selectedProject.currencyType === "rupees"
                        ? selectedProject.workingPeriodType === "fixed"
                          ? " ₹/fixed"
                          : ` ₹/${
                              selectedProject.workingPeriodType === "hours"
                                ? "hours"
                                : "months"
                            }`
                        : selectedProject.currencyType === "dollars"
                        ? selectedProject.workingPeriodType === "fixed"
                          ? " $/fixed"
                          : ` $/${
                              selectedProject.workingPeriodType === "hours"
                                ? "hours"
                                : "months"
                            }`
                        : selectedProject.currencyType === "pounds"
                        ? selectedProject.workingPeriodType === "fixed"
                          ? " £/fixed"
                          : ` £/${
                              selectedProject.workingPeriodType === "hours"
                                ? "hours"
                                : "months"
                            }`
                        : ""}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Conversion Rate:</strong> &#x20B9;
                      {selectedProject.conversionRate.toFixed(2)}
                    </Typography>
                    {selectedProject.workingPeriod && (
                      <Typography variant="body1">
                        <strong>Working Period:</strong>{" "}
                        {selectedProject.workingPeriod}
                        {selectedProject.workingPeriodType !== "fixed" &&
                          (selectedProject.workingPeriodType === "months" ? (
                            <span> Working Days</span>
                          ) : (
                            <span> Working Hours</span>
                          ))}
                      </Typography>
                    )}
                    {selectedProject.paymentStatus && (
                      <Typography variant="body1">
                        <strong>Payment Status:</strong>{" "}
                        {selectedProject.paymentStatus}
                      </Typography>
                    )}
                    {selectedProject.candidateName && (
                      <Typography variant="body1">
                        <strong>Candidate Name:</strong>{" "}
                        {selectedProject.candidateName}
                      </Typography>
                    )}
                    {selectedProject.billingCycle && (
                      <Typography variant="body1">
                        <strong>Billing Cycle:</strong>{" "}
                        {selectedProject.billingCycle}
                      </Typography>
                    )}
                    {selectedProject.advanceAmount != null &&
                      selectedProject.advanceAmount > 0 && (
                        <Typography variant="body1">
                          <strong>Advance Amount:</strong>{" "}
                          {selectedProject.advanceAmount}
                        </Typography>
                      )}

                    {selectedProject.currencyType && (
                      <Typography variant="body1">
                        <strong>Currency Type:</strong>{" "}
                        {selectedProject.currencyType}
                      </Typography>
                    )}
                    {selectedProject.paymentCycle && (
                      <Typography variant="body1">
                        <strong>Payment Cycle:</strong>{" "}
                        {selectedProject.paymentCycle}
                      </Typography>
                    )}
                    {selectedProject.startDate && (
                      <Typography variant="body1">
                        <strong>Start Date:</strong> {selectedProject.startDate}
                      </Typography>
                    )}
                    {selectedProject.endDate && (
                      <Typography variant="body1">
                        <strong>End Date:</strong> {selectedProject.endDate}
                      </Typography>
                    )}
                    {selectedProject.ratePerDay && (
                      <Typography variant="body1">
                        <strong>Rate/Day:</strong>
                        {selectedProject.currencyType === "rupees" ? (
                          <span> &#x20B9;</span>
                        ) : selectedProject.currencyType === "dollars" ? (
                          <span> $</span>
                        ) : selectedProject.currencyType === "pounds" ? (
                          <span> &#163;</span>
                        ) : null}
                        {selectedProject.ratePerDay.toFixed(2)}
                      </Typography>
                    )}
                    {selectedProject.technology && (
                      <Typography variant="body1">
                        <strong>Technology:</strong>{" "}
                        {selectedProject.technology}
                      </Typography>
                    )}
                    {selectedProject.timeSheet && (
                      <Typography variant="body1">
                        <strong>Timesheet:</strong> {selectedProject.timeSheet}
                      </Typography>
                    )}
                    <Typography variant="body1"><strong>Working Period Type:</strong> {selectedProject.workingPeriodType}</Typography>
                    {selectedProject.uploadedFiles && selectedProject.uploadedFiles?.length > 0 && (
                      <>
                        <Typography variant="body1"><strong>Uploaded Files:</strong></Typography>
                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 2,
                            justifyContent: "flex-start",
                            alignItems: "center",
                          }}
                        >
                          {selectedProject.uploadedFiles.map((file, index) => (
                            <ListItem
                              key={index}
                              component="a"
                              href={file.viewUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              sx={{
                                maxWidth: '200px',
                                minWidth: '100px',
                                height: 40,


                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: "8px 16px",
                                boxShadow: 2,
                                borderRadius: "25px",
                                backgroundColor: "#f0f0f0",
                                color: "#333",
                                textDecoration: "none",
                                transition: "transform 0.3s, background-color 0.3s",
                                "&:hover": {
                                  transform: "scale(1.05)",
                                  backgroundColor: "#e0e0e0",
                                },
                              }}
                            >
                              <ListItemText
                                primary={
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      textAlign: "center",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      whiteSpace: "nowrap",
                                      fontWeight: "bold",
                                      maxWidth: '168px',
                                    }}
                                    title={file.filename}
                                  >
                                    {file.filename}
                                  </Typography>
                                }
                              />
                            </ListItem>
                          ))}
                        </Box>
                      </>
                    )}
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleCloseModal} color="primary">
                      Close
                    </Button>
                  </DialogActions>
                </Dialog>
              )}
            </div>
          )}
        </>
      ) : (
        <>
          {clientProjectTableError ||
          clientProjectTableLoading ||
          clientProjectTableData === "" ||
          clientProjectTableData?.length <= 0 ? (
            <div>
              
              <div className="text-xl font-bold text-center p-4 ">
                <h3>PROJECT DETAILS</h3>
                {isError || clientProjectTableError ? (
                  <p className="font-thin p-4 ">
                    <Alert severity="error">
                      Network request error, refresh!!!
                    </Alert>
                  </p>
                ) : null}
                {(data && (data === "" || data?.length <= 0)) ||
                (clientProjectTableData &&
                  (clientProjectTableData === "" ||
                    clientProjectTableData?.length <= 0)) ? (
                  <p className="text-lg text-purple-500 font-thin dark:text-purple-300 p-4 ">
                    No project available !
                  </p>
                ) : null}
              </div>
            </div>
          )
           : (
            <div className="  rounded-[20px]">
              <TableContainer className={Styles.table_client_scroll}>
                <Table>
                  <TableHead className={Styles.animated}>
                    <TableRow>
                      <TableCell style={{ paddingRight: "0" }}>
                        Select
                      </TableCell>
                      {/* <TableCell style={{ paddingLeft: "0", paddingRight: "0" }}>
                          Sr.No.
                        </TableCell> */}
                      <TableCell
                        style={{ paddingLeft: "0", paddingRight: "0" }}
                      >
                        Project
                      </TableCell>

                      {/* <TableCell
                        style={{ paddingLeft: "0", paddingRight: "0" }}
                      >
                        Manager
                      </TableCell>  */}
                      {/* <TableCell
                        style={{ paddingLeft: "0", paddingRight: "0" }}
                      >
                        Project Period
                      </TableCell> */}
                      <TableCell
                        style={{ paddingLeft: "0", paddingRight: "0" }}
                      >
                        Rate
                      </TableCell>
                      <TableCell
                        style={{ paddingLeft: "0", paddingRight: "0" }}
                      >
                        Conversion Rate
                      </TableCell>
                      <TableCell
                        style={{ paddingLeft: "0", paddingRight: "0" }}
                      >
                        Action
                      </TableCell>
                      <TableCell
                        style={{ paddingLeft: "0", paddingRight: "0" }}
                      >
                        {" "}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {ProjectData &&
                      ProjectData.filter((project) => {
                        if (searchProjectName?.length <= 0) return true;
                        const searchLower = searchProjectName.toLowerCase();
                        // return project.projectName
                        //   .toLowerCase()
                        //   .startsWith(searchProjectName.toLowerCase());
                        return (
                          (project.projectName
                            ?.toLowerCase()
                            .startsWith(searchLower) ??
                            false) ||
                          (project.resumeName
                            ?.toLowerCase()
                            .startsWith(searchLower) ??
                            false) 
                        );
                      }).map((project: ProjectType, index: number) => (
                        <TableRow key={project._id} className="p-3">
                          <TableCell
                            style={{
                              paddingTop: "0",
                              paddingBottom: "0",
                              paddingLeft: "20px",
                            }}
                          >
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={projectId.includes(project._id)}
                                  sx={{
                                    color: materialTheme.palette.primary.main,
                                    "&.Mui-checked": {
                                      color: materialTheme.palette.primary.main,
                                    },
                                  }}
                                  onChange={(e) =>
                                    handleSingleCheckboxChange(
                                      e,
                                      index,
                                      project
                                    )
                                  }
                                />
                              }
                              label=""
                            />
                          </TableCell>
                          <TableCell style={{ padding: "0" }}>
                            {project.projectName}
                          </TableCell>
                          <TableCell style={{ padding: "0" }}>
                            {project.rate}(
                            {project.currencyType === "rupees" ? (
                              <span>&#x20B9;</span>
                            ) : project.currencyType === "dollars" ? (
                              <span>$</span>
                            ) : project.currencyType === "pounds" ? (
                              <span>&#163;</span>
                            ) : null}
                            /{project.workingPeriodType})
                          </TableCell>
                          <TableCell style={{ padding: "0" }}>
                            <span>&#x20B9; </span>
                            {project.conversionRate.toFixed(2)}
                          </TableCell>
                          <TableCell style={{ padding: "0" }}>
                            <div className="flex">
                              <div className={Styles.editButton}>
                                <CompoAddProject
                                  clientId={selectedClientState.data._id}
                                  adminId={adminId}
                                  forAddProject={false}
                                  projectToEdit={project}
                                  handleProjectEdit={handleEditProject}
                                />
                              </div>
                              <div className={Styles.editButton}>
                                <ActionConfirmer
                                  actionTag="Delete"
                                  actionFunction={handleProjectDelete}
                                  parameter={project._id}
                                />
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          )}
        </>
      )}
      {ProjectData && projectTableforClient && (
        <div>
          {!(
            clientProjectTableError ||
            clientProjectTableLoading ||
            clientProjectTableData === "" ||
            clientProjectTableData?.length <= 0
          ) && projectTableforClient ? (
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleConfirmSelection()}
              disabled={projectId?.length === 0}
              sx={{
                backgroundColor: "#d9a990",
                borderRadius: "20px",
                ":hover": {
                  backgroundColor: "#4a6180",
                },
                position: "absolute",
                bottom: "20px",
                right: "60px",
              }}
            >
              Genrate Invoice
            </Button>
          ) : null}
        </div>
      )}
    </section>
  );
};

export default ProjectTable;
