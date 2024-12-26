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
} from "@mui/material";
import { queryClient } from "../..";
import { useSnackbar } from "notistack";
import {
  ClientType,
  ProjectType,
  UpdateProjectDataType,
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
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography } from "@mui/material";
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
  const [selectedProject, setSelectedProject] = useState<ProjectType | null>(null);
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
    if (projectsForInvoice.length !== 0) {
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
      // When a checkbox is checked, deselect all other projects and select this one
      setProjectId([project._id]); // Set only the current project ID
      setSelectedProjectId(project._id); // Set as selected
      setProjectDetails([project]); // Set project details with only the selected project
      setAllChecked(false); // Reset "Select All" state
    } else {
      // When the checkbox is unchecked, clear all selections
      setProjectId([]); // Clear all project IDs
      setSelectedProjectId(""); // Clear selected ID
      setProjectDetails([]); // Clear project details
      setAllChecked(false); // Reset "Select All" state
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
          <ClientInfoSection />
        ) : null}
      </div>
      {!projectTableforClient ? (
        <>
          {/* Project Table for all  */}
          {isError || isLoading || (data === "" && data.length <= 0) ? (
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
                {(data && (data === "" || data.length <= 0)) ||
                  (clientProjectTableData &&
                    (clientProjectTableData === "" ||
                      clientProjectTableData.length <= 0)) ? (
                  <p className="text-lg text-purple-500 font-thin dark:text-purple-300 p-4 ">
                    No project available !
                  </p>
                ) : null}
              </div>
            </div>
          ) : (
            <div className="  rounded-[20px]">
              <TableContainer className={Styles.table_scroll}>
                <Table >
                  <TableHead className={Styles.animated}>
                    <TableRow>
                      {/* <TableCell style={{ paddingRight: "0" }}>Select</TableCell> */}
                      <TableCell sx={{ paddingX: "10px", width: "50px" }}>
                        Sr.No.
                      </TableCell>
                      <TableCell
                        style={{ paddingLeft: "0", paddingRight: "0", width: "200px" }}
                      >
                        Project
                      </TableCell>
                      <TableCell
                        style={{ paddingLeft: "0", paddingRight: "0" }}
                      >
                        Client Name
                      </TableCell>
                      {/* <TableCell
                        style={{ paddingLeft: "0", paddingRight: "0" }}
                      >
                        Project Period
                      </TableCell> */}
                      <TableCell
                        style={{ paddingLeft: "0", paddingRight: "0", width: "150px" }}
                      >
                        Rate
                      </TableCell>
                      {/* <TableCell
                        style={{ paddingLeft: "0", paddingRight: "0" }}
                      >
                        Working Period
                      </TableCell> */}
                      <TableCell
                        style={{ paddingLeft: "0", paddingRight: "0", width: "170px" }}
                      >
                        Conversion Rate
                      </TableCell>
                      {/* <TableCell
                        style={{ paddingLeft: "0", paddingRight: "0" }}
                      >
                        Amount
                      </TableCell> */}
                      <TableCell
                        style={{ paddingLeft: "0", paddingRight: "0", width: "100px" }}
                      >
                        Action
                      </TableCell>
                      <TableCell
                        style={{ paddingLeft: "0", paddingRight: "0", width: "100px" }}
                      >
                        selection
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {ProjectData &&
                      ProjectData?.filter((project) => {
                        if (searchProjectName.length <= 0) return true;
                        return project.projectName
                          .toLowerCase()
                          .startsWith(searchProjectName.toLowerCase());
                      }).map((project: ProjectType, index: number) => (
                        <TableRow key={project._id} className="p-3">
                          <TableCell
                            sx={{ paddingX: "10px", textAlign: "center" }}
                          >
                            {index + 1}
                          </TableCell>
                          <TableCell style={{ padding: "0" }}>
                            {project.projectName}
                          </TableCell>
                          <TableCell style={{ padding: "0" }}>
                            {getClientName(project.clientId)}
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
                              {(project?.conversionRate ?? 0).toFixed(2)}
                            </TableCell>
                            
                            <TableCell style={{ padding: "0" }}>
                              <div className="flex">
                                <div className={Styles.editButton}>
                                  <div className="">

                                    <Button
                                      onClick={() => handleViewProject(project)}
                                      sx={{
                                        color: materialTheme.palette.primary.main,
                                        ":hover": {
                                          color: materialTheme.palette.secondary.main,
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
                            <TableCell sx={{ paddingY: "8px", paddingX: "0" }}>
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
                <Dialog open={isModalOpen} onClose={handleCloseModal} maxWidth="sm" fullWidth>
                  <DialogTitle>Project Details</DialogTitle>
                  <DialogContent>
                    <Typography variant="body1"><strong>Project Name:</strong> {selectedProject.projectName}</Typography>
                    <Typography variant="body1"><strong>Client Name:</strong> {getClientName(selectedProject.clientId)}</Typography>
                    <Typography variant="body1"><strong>Rate:</strong> {selectedProject.rate?.toFixed(2)}
                      {selectedProject.currencyType === "rupees"
                        ? selectedProject.workingPeriodType === "fixed"
                          ? " ₹/fixed"
                          : ` ₹/${selectedProject.workingPeriodType === "hours"
                            ? "hours"
                            : "months"
                          }`
                        : selectedProject.currencyType === "dollars"
                          ? selectedProject.workingPeriodType === "fixed"
                            ? " $/fixed"
                            : ` $/${selectedProject.workingPeriodType === "hours"
                              ? "hours"
                              : "months"
                            }`
                          : selectedProject.currencyType === "pounds"
                            ? selectedProject.workingPeriodType === "fixed"
                              ? " £/fixed"
                              : ` £/${selectedProject.workingPeriodType === "hours"
                                ? "hours"
                                : "months"
                              }`
                            : ""}
                    </Typography>
                    <Typography variant="body1"><strong>Conversion Rate:</strong> &#x20B9;{selectedProject.conversionRate.toFixed(2)}</Typography>
                    {selectedProject.workingPeriod && (
                      <Typography variant="body1"><strong>Working Period:</strong> {selectedProject.workingPeriod}{selectedProject.workingPeriodType !== "fixed" &&
                        (selectedProject.workingPeriodType === "months" ? (
                          <span> Working Days</span>
                        ) : (
                          <span> Working Hours</span>
                        ))}</Typography>
                    )}
                    {selectedProject.paymentStatus && (
                      <Typography variant="body1"><strong>Payment Status:</strong> {selectedProject.paymentStatus}</Typography>
                    )}
                    {selectedProject.candidateName && (
                      <Typography variant="body1"><strong>Candidate Name:</strong> {selectedProject.candidateName}</Typography>
                    )}
                    {selectedProject.billingCycle && (
                      <Typography variant="body1"><strong>Billing Cycle:</strong> {selectedProject.billingCycle}</Typography>
                    )}
                    {selectedProject.advanceAmount != null && selectedProject.advanceAmount > 0 && (
                      <Typography variant="body1">
                        <strong>Advance Amount:</strong> {selectedProject.advanceAmount}
                      </Typography>
                    )}


                    <Typography variant="body1"><strong>Currency Type:</strong> {selectedProject.currencyType}</Typography>
                    <Typography variant="body1"><strong>Payment Cycle:</strong> {selectedProject.paymentCycle}</Typography>
                    <Typography variant="body1"><strong>Start Date:</strong> {selectedProject.startDate}</Typography>
                    <Typography variant="body1"><strong>End Date:</strong> {selectedProject.endDate}</Typography>
                    {selectedProject.ratePerDay && (
                      <Typography variant="body1"><strong>Rate/Day:</strong>{selectedProject.currencyType === "rupees" ? (
                        <span> &#x20B9;</span>
                      ) : selectedProject.currencyType === "dollars" ? (
                        <span> $</span>
                      ) : selectedProject.currencyType === "pounds" ? (
                        <span> &#163;</span>
                      ) : null}{selectedProject.ratePerDay.toFixed(2)}</Typography>
                    )}
                    <Typography variant="body1"><strong>Technology:</strong> {selectedProject.technology}</Typography>
                    {selectedProject.timeSheet && (
                      <Typography variant="body1"><strong>Timesheet:</strong> {selectedProject.timeSheet}</Typography>
                    )}
                    <Typography variant="body1"><strong>Working Period Type:</strong> {selectedProject.workingPeriodType}</Typography>
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
          {/* Project Table for Client  */}
          {clientProjectTableError ||
            clientProjectTableLoading ||
            clientProjectTableData === "" ||
            clientProjectTableData.length <= 0 ? (
            <div>
              <div></div>
              <div className="text-xl font-bold text-center p-4 ">
                <h3>PROJECT DETAILS</h3>
                {isError || clientProjectTableError ? (
                  <p className="font-thin p-4 ">
                    <Alert severity="error">
                      Network request error, refresh!!!
                    </Alert>
                  </p>
                ) : null}
                {(data && (data === "" || data.length <= 0)) ||
                  (clientProjectTableData &&
                    (clientProjectTableData === "" ||
                      clientProjectTableData.length <= 0)) ? (
                  <p className="text-lg text-purple-500 font-thin dark:text-purple-300 p-4 ">
                    No project available !
                  </p>
                ) : null}
              </div>
            </div>
          ) : (
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
                      </TableCell> */}
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
                      {/* <TableCell
                        style={{ paddingLeft: "0", paddingRight: "0" }}
                      >
                        Working Period
                      </TableCell> */}
                      <TableCell
                        style={{ paddingLeft: "0", paddingRight: "0" }}
                      >
                        Conversion Rate
                      </TableCell>
                      {/* <TableCell
                        style={{ paddingLeft: "0", paddingRight: "0" }}
                      >
                        Amount
                      </TableCell> */}
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
                        // Apply the same filter condition as ProjectTable 1
                        if (searchProjectName.length <= 0) return true;
                        return project.projectName
                          .toLowerCase()
                          .startsWith(searchProjectName.toLowerCase());
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
                                    handleSingleCheckboxChange(e, index, project)
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
            clientProjectTableData.length <= 0
          ) && projectTableforClient ? (
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleConfirmSelection()}
              disabled={projectId.length === 0}
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
