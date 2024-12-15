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
import { fetchInvoicesThunk,clearInvoices } from "../../states/redux/InvoiceProjectState/invoiceListSlice";
import { getAllClientsByAdminIdAction } from "../../states/redux/ClientStates/allClientSlice";
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
                        <TableCell>{invoice.rate}</TableCell>
                        <TableCell>{invoice.conversionRate}</TableCell>
                        <TableCell>{invoice.amountAfterTax}</TableCell>
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