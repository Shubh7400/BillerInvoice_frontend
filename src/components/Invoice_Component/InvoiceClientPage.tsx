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
        project._id === id ? { ...project, [field]: value } : project
      )
    );
  };

  React.useEffect(() => {
    if (isAuth && adminId) {
      dispatch(getAdminByIdAction(adminId));
    }
  }, [isAuth, adminId, dispatch]);

  const invoiceObject = useSelector(
    (state: RootState) => state.invoiceObjectState
  );
  return (
    <div>
      <div className="flex justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="text-white text-[20px] bg-[#E4A98A] w-[35px] h-[35px] flex justify-center items-center rounded-[50px]"
          >
            <IoIosArrowBack />
          </button>
          <Typography variant="h5" component="h2" className="text-center">
            CLIENT INFORMATION
          </Typography>
        </div>
        <div className="text-black mr-5">
          <strong>Invoice Number: </strong>

          <TextField
            variant="outlined"
            size="small"
            value={invoiceObject.invoiceNo}
            // onChange={(e) =>}
          />
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
                    &#x20B9; {project.amount ? project.amount : 0}
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
