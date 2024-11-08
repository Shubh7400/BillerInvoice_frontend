import React from 'react'
import { ClientType, ProjectType } from '../../types/types';
import { RootState } from '../../states/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import ClientInfoSection from '../Client_Component/ClientInfoSection';
import { Button, Checkbox, FormControlLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, useTheme } from '@mui/material';
import Styles from "./invoive.module.css";
import { removeProjectFromInvoiceAction } from '../../states/redux/InvoiceProjectState/addProjectForInvoiceSlice';
import BillAmount from "../../components/Home_Components/InvoiceSection/BillAmount";


function InvoiceClientPage() {
  const materialTheme = useTheme();
  const dispatch = useDispatch();
  const selectedClientState = useSelector(
    (state: RootState) => state.selectedClientState
  );
  const clientObj: ClientType = selectedClientState.data;

  const { projectsForInvoice } = useSelector(
    (state: RootState) => state.projectsForInvoiceState
  );

  const handleRemoveProject = (
    project: ProjectType
  ) => {
    if (project && project._id) {
      dispatch(removeProjectFromInvoiceAction(project._id))
    }
  }
  return (
    <div>
      <div>
        {clientObj && selectedClientState.loading !== "idle" ? (
          <ClientInfoSection />
        ) : null}
      </div>
      <div>
        <div className="  rounded-[20px]">
          <TableContainer className={Styles.table_scroll}>
            <Table>
              <TableBody className='p-5'>
                {projectsForInvoice?.map((project: ProjectType, index: number) => (
                  <TableRow key={project._id} className="p-3">
                    {/* <TableCell style={{ padding: "0" }}>{index + 1}</TableCell> */}
                    <TableCell style={{ padding: "0" }}>
                      {project.projectName}
                    </TableCell>
                    <TableCell style={{ padding: "0" }}>
                      {project.projectManager}
                    </TableCell>
                    <TableCell style={{ padding: "0" }}>
                      {project.projectPeriod ? (
                        <>
                          {project.projectPeriod} ({project.workingPeriodType})
                        </>
                      ) : (
                        "Hour based project"
                      )}
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
                      {project.workingPeriod}({project.workingPeriodType})
                    </TableCell>
                    <TableCell style={{ padding: "0" }}>
                      {project.currencyType === "rupees" ? (
                        <span>&#x20B9; </span>
                      ) : project.currencyType === "dollars" ? (
                        <span>$ </span>
                      ) : project.currencyType === "pounds" ? (
                        <span>&#163; </span>
                      ) : null}
                      {project.conversionRate}
                    </TableCell>
                    <TableCell style={{ padding: "0" }}>
                      &#x20B9; {project.amount ? project.amount : 0}
                    </TableCell>
                    <TableCell style={{ padding: "0" }}>
                      <div className="flex">
                        <Button
                          onClick={() => handleRemoveProject(project)}
                        >
                          remove
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
      <div>
        {projectsForInvoice.length > 0 ? (
          <BillAmount />
        ) : (
          <div>Please Select a Project</div>
        )}
      </div>
    </div>
  )
}

export default InvoiceClientPage