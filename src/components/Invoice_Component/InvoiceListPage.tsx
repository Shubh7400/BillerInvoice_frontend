import React from "react";
import { Link } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import {
  Grid,
  Typography,
  Select,
  MenuItem,
  FormControl,
  styled,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Styles from "../Project_Component/ProjectTable.module.css";
import { CiEdit } from "react-icons/ci";
import ActionConfirmer from "../SideBar/ActionConfirmer";
import { useTheme } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@mui/material";
import { InvoiceType, ProjectType } from "../../types/types";
import { useState, useContext, useEffect } from "react";
import { RootState, AppDispatch } from "../../states/redux/store";
import { useSelector, useDispatch } from "react-redux";
import { AuthContext } from "../../states/context/AuthContext/AuthContext";
import { fetchInvoicesThunk, clearInvoices } from "../../states/redux/InvoiceProjectState/invoiceListSlice";
import { getAllClientsByAdminIdAction } from "../../states/redux/ClientStates/allClientSlice";
import { getClientByIdAction } from "../../states/redux/ClientStates/selectedClientSlice";
import { addProjectForInvoiceAction } from "../../states/redux/InvoiceProjectState/addProjectForInvoiceSlice";
function InvoiceListPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const materialTheme = useTheme();
  const { isAuth, adminId } = useContext(AuthContext);
  const searchParams = new URLSearchParams(location.search);
  const selectedYear = searchParams.get("year");
  const selectedMonth = searchParams.get("month");

  const { invoices, loading, error } = useSelector((state: RootState) => state.invoiceListState);

  const {
    loading: clientsLoading,
    data: clients,
    error: clientsError,
  } = useSelector((state: RootState) => state.allClientsState);

  const getClientNameForInvoice = (clientId: string) => {
    const selectData = clients.find((item) => item._id === clientId);
    return selectData?.clientName || "Unknown Client";
  };
  useEffect(() => {
    if (selectedYear && selectedMonth) {
      dispatch(clearInvoices()); // Clear state before fetching
      dispatch(
        fetchInvoicesThunk({ year: selectedYear, month: selectedMonth })
      );
    }
  }, [selectedYear, selectedMonth, dispatch]);

  useEffect(() => {
    if (adminId) {
      dispatch(getAllClientsByAdminIdAction(adminId));
    }
  }, [dispatch, adminId]);

  const handleViewInvoice = (selectedProject?: ProjectType) => {
    if (selectedProject) {
      console.log("Selected Project Data:", selectedProject); // Debug
    }
    if (selectedProject && selectedProject.clientId) {
      dispatch(getClientByIdAction(selectedProject.clientId));
    }

    if (selectedProject) {
      dispatch(addProjectForInvoiceAction(selectedProject));
    }

    navigate("/client/invoices");
  };
  return (
    <div>
      <div className="flex justify-between items-center  pb-[10]">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="text-white text-[20px] bg-[#E4A98A] w-[35px] h-[35px] flex justify-center items-center rounded-[50px]"
          >
            <IoIosArrowBack />
          </button>
          <Typography variant="h5" component="h2" className='text-center'>
            INVOICE LIST
          </Typography>
        </div>
      </div>
      {/* Loading Spinner */}
      {loading ? (
        <div className="flex justify-center items-center mt-10">
          <Typography variant="h6">Loading invoices...</Typography>
        </div>
      ) : (
        <div className="  rounded-[20px] mt-5">
          <TableContainer className={Styles.table_scroll}>
            <Table sx={{ width: "100vw" }}>
              <TableHead className={Styles.animated}>
                <TableRow>
                  <TableCell sx={{ paddingX: "10px", width: "50px" }}>
                    Sr.No.
                  </TableCell>
                  <TableCell style={{ paddingLeft: "0", paddingRight: "0" }}>
                    Invoice No
                  </TableCell>
                  <TableCell style={{ paddingLeft: "0", paddingRight: "0" }}>
                    Project
                  </TableCell>
                  <TableCell style={{ paddingLeft: "0", paddingRight: "0" }}>
                    Client Name
                  </TableCell>
                  <TableCell style={{ paddingLeft: "0", paddingRight: "0" }}>
                    Rate
                  </TableCell>
                  <TableCell style={{ paddingLeft: "0", paddingRight: "0" }}>
                    Conversion Rate
                  </TableCell>
                  <TableCell style={{ paddingLeft: "0", paddingRight: "0" }}>
                    Amount
                  </TableCell>
                  <TableCell>
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(invoices) && invoices.length > 0 ? (
                  invoices.map((invoice, index) => {
                    if (!invoice) return null;
                    const clientName = getClientNameForInvoice(
                      invoice.clientId
                    );

                    return (
                      <TableRow key={invoice._id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{invoice.invoiceNo}</TableCell>
                        <TableCell>
                          {invoice.projectName || "Unnamed Project"}
                        </TableCell>
                        <TableCell>{clientName}</TableCell>
                        <TableCell>{invoice.rate}(
                            {invoice.currencyType === "rupees" ? (
                              <span>&#x20B9;</span>
                            ) : invoice.currencyType === "dollars" ? (
                              <span>$</span>
                            ) : invoice.currencyType === "pounds" ? (
                              <span>&#163;</span>
                            ) : null}
                            /{invoice.workingPeriodType})</TableCell>
                        <TableCell>&#x20B9; {invoice.conversionRate}</TableCell>
                        <TableCell>&#x20B9; {invoice.amountAfterTax}</TableCell>
                        <TableCell>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleViewInvoice(invoice)}
                            sx={{
                              backgroundColor: "#d9a990",
                              borderRadius: "20px",
                              ":hover": {
                                backgroundColor: "#4a6180",
                              },
                            }}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      style={{ textAlign: "center", padding: "20px" }}
                    >
                      <Typography variant="body1" sx={{ color: "#666" }}>
                        No Invoices available.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}
    </div>
  );
}

export default InvoiceListPage;