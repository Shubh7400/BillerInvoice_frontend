import React, { useContext, useRef, useState } from "react";
import Styles from "./ProjectTable.module.css";
import CompoAddProject from "./CompoAddProject";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../states/redux/store";
import { AuthContext } from "../../../states/context/AuthContext/AuthContext";
import {
  useDeleteProject,
  useFetchAllProjectsByClientId,
} from "../../../states/query/Project_queries/projectQueries";
import { Alert, Checkbox, FormControlLabel, useTheme } from "@mui/material";
import { RiDeleteBin7Line } from "react-icons/ri";
import { queryClient } from "../../..";
import { useSnackbar } from "notistack";
import { ProjectType } from "../../../types/types";
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

const ProjectTable = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const materialTheme = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  // -----------------------------------------------------
  const { isAuth, adminId } = useContext(AuthContext);
  const selectedClientState = useSelector(
    (state: RootState) => state.selectedClientState
  );
  const { isLoading, data, isError } = useFetchAllProjectsByClientId(
    selectedClientState.data._id
  );
  const DeleteProjectMutationHandler = useDeleteProject(
    selectedClientState.data._id
  );
  // -----------------------------------------------------
  const [allChecked, setAllChecked] = useState<boolean>();
  type CheckboxRefType = Array<HTMLInputElement | null>;
  const checkboxesRefs = useRef<CheckboxRefType>([]);

  const handleProjectDelete = (projectId: string) => {
    DeleteProjectMutationHandler.mutate(projectId, {
      onSuccess: () => {
        enqueueSnackbar("Project deleted successfully.", {
          variant: "success",
        });
        queryClient.refetchQueries(["projects", selectedClientState.data._id]);
      },
      onError: () => {
        enqueueSnackbar("Error in deleting project. Try again!", {
          variant: "error",
        });
      },
    });
  };

  if (isError || isLoading || data === "" || data.length <= 0) {
    return (
      <div>
        <div>
          <CompoAddProject
            clientId={selectedClientState.data._id}
            adminId={adminId}
            forAddProject={true}
          />
        </div>
        <div className="text-xl font-bold text-center p-4 ">
          <h3>PROJECT DETAILS</h3>
          {isLoading ? (
            <p className="text-lg text-purple-500 font-thin dark:text-purple-300 p-4 ">
              {!selectedClientState.data._id
                ? "Please select client to display projects or to add project !!"
                : null}
            </p>
          ) : null}
          {isError ? (
            <p className="font-thin p-4 ">
              <Alert severity="error">Network request error, refresh!!!</Alert>
            </p>
          ) : null}
          {data && (data === "" || data.length <= 0) ? (
            <p className="text-lg text-purple-500 font-thin dark:text-purple-300 p-4 ">
              Selected Client has no project available !
            </p>
          ) : null}
        </div>
      </div>
    );
  }

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

  const handleSingleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    project: ProjectType
  ) => {
    const isChecked = e.target.checked;
    const areAllChecked = checkboxesRefs.current.every(
      (checkboxRef) => checkboxRef?.checked === true
    );
    setAllChecked(areAllChecked);

    if (isChecked) {
      dispatch(addProjectForInvoiceAction(project));
    } else if (!isChecked && project._id) {
      dispatch(removeProjectFromInvoiceAction(project._id));
    }
  };

  return (
    <section className="pb-14 ">
      
      <div>
        <CompoAddProject
          clientId={selectedClientState.data._id}
          adminId={adminId}
          forAddProject={true}
        />
      </div>
      <div className="  rounded-[20px]">
      <TableContainer className={Styles.table_scroll}>
        <Table>
          <TableHead className={Styles.animated}>
            <TableRow >
              <TableCell style={{ paddingRight: '0' }}>Select</TableCell>
              <TableCell style={{ paddingLeft: '0', paddingRight: '0' }}>Sr.no.</TableCell>
              <TableCell style={{ paddingLeft: '0', paddingRight: '0' }}>Project</TableCell>
              <TableCell style={{ paddingLeft: '0', paddingRight: '0' }}>Project Period</TableCell>
              <TableCell style={{ paddingLeft: '0', paddingRight: '0' }}>Rate</TableCell>
              <TableCell style={{ paddingLeft: '0', paddingRight: '0' }}>Working Period</TableCell>
              <TableCell style={{ paddingLeft: '0', paddingRight: '0' }}>Conversion Rate</TableCell>
              <TableCell style={{ paddingLeft: '0', paddingRight: '0' }}>Amount</TableCell>
              <TableCell style={{ paddingLeft: '0', paddingRight: '0' }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {data?.map((project: ProjectType, index: number) => (
              <TableRow key={project._id} className="p-3">
                <TableCell style={{ paddingTop: '0', paddingBottom: '0', paddingLeft: '20px' }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={allChecked ? allChecked : false}
                        sx={{
                          color: materialTheme.palette.primary.main,
                          "&.Mui-checked": {
                            color: materialTheme.palette.primary.main,
                          },
                        }}
                        onChange={(e) => handleSingleCheckboxChange(e, index, project)}
                      />
                    }
                    label=""
                  />
                </TableCell>
                <TableCell style={{ padding: '0' }}>{index + 1}</TableCell>
                <TableCell style={{ padding: '0' }}>
                  {project.projectName}
                  <br />
                  {project.projectManager}
                </TableCell>
                <TableCell style={{ padding: '0' }}>
                  {project.projectPeriod ? (
                    <>
                      {project.projectPeriod} ({project.workingPeriodType})
                    </>
                  ) : (
                    'Hour based project'
                  )}
                </TableCell>
                <TableCell style={{ padding: '0' }}>
                  {project.rate}
                  (
                  {project.currencyType === 'rupees' ? (
                    <span>&#x20B9;</span>
                  ) : project.currencyType === 'dollars' ? (
                    <span>$</span>
                  ) : project.currencyType === 'pounds' ? (
                    <span>&#163;</span>
                  ) : null}
                  /{project.workingPeriodType})
                </TableCell>
                <TableCell style={{ padding: '0' }}>
                  {project.workingPeriod}({project.workingPeriodType})
                </TableCell>
                <TableCell style={{ padding: '0' }}>
                  {project.currencyType === 'rupees' ? (
                    <span>&#x20B9; </span>
                  ) : project.currencyType === 'dollars' ? (
                    <span>$ </span>
                  ) : project.currencyType === 'pounds' ? (
                    <span>&#163; </span>
                  ) : null}
                  {project.conversionRate}
                </TableCell>
                <TableCell style={{ padding: '0' }}>
                  &#x20B9; {project.amount ? project.amount : 0}
                </TableCell>
                <TableCell style={{ padding: '0' }}>
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
      {/* <BillAmount /> */}
    </section>
  );
};

export default ProjectTable;
