import React, { useContext, useEffect, useRef, useState } from "react";
import Styles from "./ProjectTable.module.css";
import CompoAddProject from "./CompoAddProject";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../states/redux/store";
import { AuthContext } from "../../../states/context/AuthContext/AuthContext";
import {
  useDeleteProject,
  useFetchAllProjectsByAdminId,
  useFetchAllProjectsByClientId,
} from "../../../states/query/Project_queries/projectQueries";
import {
  Alert,
  Button,
  Checkbox,
  FormControlLabel,
  useTheme,
} from "@mui/material";
import { RiDeleteBin7Line } from "react-icons/ri";
import { queryClient } from "../../..";
import { useSnackbar } from "notistack";
import { ClientType, ProjectType } from "../../../types/types";
import {
  addAllProjectsForInvoiceAction,
  addProjectForInvoiceAction,
  removeAllProjectsFromInvoiceAction,
  removeProjectFromInvoiceAction,
} from "../../../states/redux/InvoiceProjectState/addProjectForInvoiceSlice";
import ActionConfirmer from "../../SideBar/ActionConfirmer";
import BillAmount from "../InvoiceSection/BillAmount";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useNavigate } from "react-router-dom";
import ClientInfoSection from "../../Client_Component/ClientInfoSection";

const ProjectTable = ({
  projectTableforClient,
}: {
  projectTableforClient: boolean;
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
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

  console.log("from project table :", ProjectData);
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

  // const handleSingleCheckboxChange = (
  //   e: React.ChangeEvent<HTMLInputElement>,
  //   index: number,
  //   project: ProjectType
  // ) => {
  //   const isChecked = e.target.checked;
  //   const areAllChecked = checkboxesRefs.current.every(
  //     (checkboxRef) => checkboxRef?.checked === true
  //   );
  //   if (isChecked) {
  //     setAllChecked(areAllChecked);
  //     setSelectedProjectId(project?._id);
  //     setProjectDetails(project);
  //   } else if (!isChecked && project._id) {
  //     // dispatch(removeProjectFromInvoiceAction(project._id));
  //     setSelectedProjectId("");
  //     setAllChecked(false);
  //   }
  // };
  const handleSearchProjectName = (data: string) => {
    setSearchProjectName(data);
  };
  const handleSingleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    project: ProjectType
  ) => {
    const isChecked = e.target.checked;
    const newProjectId = [...projectId];
    let newProjectDetails = [...projectDetails];

    if (isChecked) {
      if (!newProjectId.includes(project._id)) {
        newProjectId.push(project._id);
        setSelectedProjectId(project?._id);
        newProjectDetails.push(project);
        setProjectDetails(newProjectDetails);
      }
    } else {
      setSelectedProjectId("");
      setAllChecked(false);
      const indexToRemove = newProjectId.indexOf(project._id);
      if (indexToRemove > -1) {
        newProjectId.splice(indexToRemove, 1);
      }
    }
    setProjectId(newProjectId);
    setAllChecked(newProjectId.length === projectsForInvoice.length); // Update "Select All" state
  };

  const handleConfirmSelection = (selectedProject?: ProjectType) => {
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
              <TableContainer className={Styles.table_scroll}>
                <Table sx={{ width: "100vw" }}>
                  <TableHead className={Styles.animated}>
                    <TableRow>
                      {/* <TableCell style={{ paddingRight: "0" }}>Select</TableCell> */}
                      <TableCell sx={{ paddingX: "10px", width: "50px" }}>
                        Sr.No.
                      </TableCell>
                      <TableCell
                        style={{ paddingLeft: "0", paddingRight: "0" }}
                      >
                        Project
                      </TableCell>
                      <TableCell
                        style={{ paddingLeft: "0", paddingRight: "0" }}
                      >
                        Client Name
                      </TableCell>
                      <TableCell
                        style={{ paddingLeft: "0", paddingRight: "0" }}
                      >
                        Project Period
                      </TableCell>
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
                        selection
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {ProjectData && ProjectData?.filter((project) => {
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
                        {/* <TableCell style={{ padding: "0" }}>
                          {project.workingPeriod}({project.workingPeriodType})
                        </TableCell> */}
                        <TableCell style={{ padding: "0" }}>
                          <span>&#x20B9; </span>
                          {project.conversionRate}
                        </TableCell>
                        {/* <TableCell style={{ padding: "0" }}>
                          &#x20B9; {project.amount ? project.amount : 0}
                        </TableCell> */}
                        <TableCell style={{ padding: "0" }}>
                          <div className="flex">
                            <div className={Styles.editButton}>
                              <CompoAddProject
                                clientId={selectedClientState.data._id}
                                adminId={adminId}
                                forAddProject={false}
                                projectToEdit={project}
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
                        <TableCell sx={{ paddingY: "8px" }}>
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
                      <TableCell
                        style={{ paddingLeft: "0", paddingRight: "0" }}
                      >
                        Project Period
                      </TableCell>
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
                    {ProjectData?.map((project: ProjectType, index: number) => (
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
                                // checked={allChecked ? allChecked : false}
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
                        {/* <TableCell style={{ padding: "0" }}>{index + 1}</TableCell> */}
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
                          ({project.workingPeriodType})
                        </TableCell>
                        <TableCell style={{ padding: "0" }}>
                          <span>&#x20B9; </span>
                          {project.conversionRate}
                        </TableCell>
                        {/* <TableCell style={{ padding: "0" }}>
                          &#x20B9; {project.amount ? project.amount : 0}
                        </TableCell> */}
                        <TableCell style={{ padding: "0" }}>
                          <div className="flex">
                            <div className={Styles.editButton}>
                              <CompoAddProject
                                clientId={selectedClientState.data._id}
                                adminId={adminId}
                                forAddProject={false}
                                projectToEdit={project}
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
      {ProjectData && <div>
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
            View Invoice...
          </Button>
        ) : null}
      </div>}
    </section>
  );
};

export default ProjectTable;
