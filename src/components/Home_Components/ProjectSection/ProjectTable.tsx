import React, { useContext, useRef, useState } from "react";
import "./ProjectTable.css";
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
import ActionConfirmer from "../../Navbar/ActionConfirmer";
import BillAmount from "../InvoiceSection/BillAmount";

const ProjectTable = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const materialTheme = useTheme();

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
      <div className=" dark:text-colorLightFont px-8 pb-4 ">
        <table className="border-none table ">
          <caption className="text-xl font-bold text-center p-4 bg-white dark:bg-slate-800 caption shadow-md dark:shadow-slate-950 ">
            PROJECT DETAILS
          </caption>
          <thead className="thead  ">
            <tr className="dark:bg-slate-800 dark:text-colorLightFont tr ">
              <th className=" md:flex md:pl-8 th ">
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
                      onChange={(e) => handleAllCheckboxChange(e, data)}
                    />
                  }
                  label="Sr.no."
                />
              </th>
              <th className="th">Project</th>
              <th className="th">Project Period</th>
              <th className="th">Rate</th>
              <th className="th">Working Period</th>
              <th className="th">Conversion Rate</th>
              <th className="th">Amount</th>
              <th className="th"></th>
            </tr>
          </thead>
          <tbody className="shadow-lg dark:shadow-slate-950">
            {data?.map((project: any, index: any) => {
              return (
                <tr
                  className="dark:bg-slate-800 dark:text-colorLightFont tr "
                  key={project._id}
                >
                  <td data-label="Sr.no." className=" md:flex md:pl-8 td ">
                    <div className=" flex justify-end items-center md:justify-start md:w-full md:text-start md:mt-4">
                      <input
                        type="checkbox"
                        className="w-5 h-5 border-2  accent-thirdColor cursor-pointer mr-4 "
                        ref={(element) =>
                          (checkboxesRefs.current[index] = element)
                        }
                        onChange={(e) =>
                          handleSingleCheckboxChange(e, index, project)
                        }
                      />
                      <label>{index + 1}</label>
                    </div>
                  </td>
                  <td
                    data-label="Project"
                    className="td overflow-hidden overflow-ellipsis"
                  >
                    {project.projectName}
                    <br />
                    {project.projectManager}
                  </td>
                  <td data-label="Project Period" className="td">
                    {project.projectPeriod ? (
                      <>
                        {project.projectPeriod} ({project.workingPeriodType}){" "}
                      </>
                    ) : (
                      "Hour based project"
                    )}
                  </td>
                  <td data-label="Rate" className="td">
                    {project.rate}(
                    {project.currencyType === "rupees" ? (
                      <span>&#x20B9;</span>
                    ) : project.currencyType === "dollars" ? (
                      <span>$</span>
                    ) : project.currencyType === "pounds" ? (
                      <span>&#163;</span>
                    ) : null}
                    /{project.workingPeriodType})
                  </td>
                  <td data-label="Working Period" className="td">
                    {project.workingPeriod}({project.workingPeriodType})
                  </td>
                  <td data-label="Conversion Rate" className="td">
                    {project.currencyType === "rupees" ? (
                      <span>&#x20B9; </span>
                    ) : project.currencyType === "dollars" ? (
                      <span>$ </span>
                    ) : project.currencyType === "pounds" ? (
                      <span>&#163; </span>
                    ) : null}
                    {project.conversionRate}
                  </td>
                  <td data-label="Amount" className="td">
                    {" "}
                    &#x20B9; {project.amount ? project.amount : 0}
                  </td>
                  <td className="td">
                    <div className="h-14 md:h-auto flex  justify-between items-center md:justify-around ">
                      <div>
                        <CompoAddProject
                          clientId={selectedClientState.data._id}
                          adminId={adminId}
                          forAddProject={false}
                          projectToEdit={project}
                        />
                      </div>
                      <div
                        className=" cursor-pointer 
                      opacity-70 hover:opacity-100 "
                      >
                        <ActionConfirmer
                          actionTag="Delete"
                          actionFunction={handleProjectDelete}
                          parameter={project._id}
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* <BillAmount /> */}
    </section>
  );
};

export default ProjectTable;
