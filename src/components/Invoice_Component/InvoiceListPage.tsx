import React from "react";
import { Link } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Styles from "../Project_Component/ProjectTable.module.css";
import { useTheme } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@mui/material";
import { useState, useContext, useEffect } from "react";
import { RootState, AppDispatch } from "../../states/redux/store";
import { useSelector, useDispatch } from "react-redux";
import { AuthContext } from "../../states/context/AuthContext/AuthContext";
import { fetchInvoicesThunk, clearInvoices } from "../../states/redux/InvoiceProjectState/invoiceListSlice";
import { getAllClientsByAdminIdAction } from "../../states/redux/ClientStates/allClientSlice";
import DownloadPreview from "./DownloadPreview";
import { Invoice } from "../../states/redux/InvoiceProjectState/invoiceListSlice";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "../../states/redux/store";
import html2canvas from "html2canvas"
import { RxCross1 } from "react-icons/rx";
import TextField from "@mui/material/TextField";

import { ChangeEvent } from "react";
function InvoiceListPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const materialTheme = useTheme();
  const { adminId } = useContext(AuthContext);
  const searchParams = new URLSearchParams(location.search);
  const selectedYear = searchParams.get("year");
  const selectedMonth = searchParams.get("month");

  const { invoices, loading, error } = useSelector((state: RootState) => state.invoiceListState);

  const {
    loading: clientsLoading,
    data: clients,
    error: clientsError,
  } = useSelector((state: RootState) => state.allClientsState);

  useEffect(() => {
    if (selectedYear && selectedMonth) {
      dispatch(clearInvoices());
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
  const [showView, setShowView] = useState(false);
  const [tempImgData, setTempImgData] = useState("");
  const [searchInvoiceProject, setSearchInvoiceProject] = useState("");
  const ViewAndPreviewPDF = async (invoice: Invoice) => {
    setShowView(true);
    const div = document.createElement("div");
    div.style.width = "1050px";
    div.style.height = "1124px";
    div.style.position = "absolute";
    div.style.top = "-9999px";
    document.body.appendChild(div);

    const root = createRoot(div);
    root.render(
      <Provider store={store}>
        <DownloadPreview
          invoice={invoice}
          showPreview={false}
        />
      </Provider>
    );

    setTimeout(async () => {
      try {
        const canvas = await html2canvas(div);
        const imgData = canvas.toDataURL("image/png");
        setTempImgData(imgData);
        root.unmount();
        document.body.removeChild(div);
      } catch (error) {
        console.error("Error generating preview image:", error);
      }
    }, 500);
  };

  const previewExecution = (state: boolean) => {
    setShowView(state);
    if (!state) setTempImgData("");
  };
  return (
    <div>
      <div className="flex justify-between items-center pb-[10]">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="text-white text-[20px] bg-[#E4A98A] w-[35px] h-[35px] flex justify-center items-center rounded-[50px]"
          >
            <IoIosArrowBack />
          </button>
          <Typography variant="h5" component="h2" className="text-center">
            INVOICE LIST
          </Typography>
        </div>
        <div className={Styles.search_input}>
          <TextField
            label="Search by Project name"
            type="text"
            variant="outlined"
            value={searchInvoiceProject || ""}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setSearchInvoiceProject(e.target.value)
            }
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "50px",
              },
            }}
          />
        </div>
      </div>


      {showView ? (
        <div className="w-screen h-[900px] sm:h-[1200px] absolute top-[0px] right-[0] z-[100] bg-[#989fce] bg-opacity-80">
          <div
            className="fixed top-[25px] right-[20px] flex z-50 cursor-pointer hover:bg-inherit"
            onClick={() => previewExecution(false)}
          >
            <RxCross1 size={40} color="black" />
          </div>

          <div className="m-auto w-full h-auto flex justify-center items-start pt-0 mt-[15%] sm:mt-[5%]">
            {tempImgData ? (
              <img src={tempImgData} alt="Invoice Preview" className="w-auto h-auto max-w-full max-h-[90%]" />
            ) : null}
          </div>
        </div>
      ) : (
        <>
          {loading ? (
            <div className="flex justify-center items-center mt-10">
              <Typography variant="h6">Loading invoices...</Typography>
            </div>
          ) : (
            <div className="rounded-[20px] mt-5">
              <TableContainer className={Styles.table_scroll}>
                <Table>
                  <TableHead className={Styles.animated}>
                    <TableRow>
                      <TableCell sx={{ paddingX: "10px", width: "50px" }}>Sr.No.</TableCell>
                      <TableCell style={{ paddingLeft: "0", paddingRight: "0", width: "150px" }}>
                        Invoice No
                      </TableCell>
                      <TableCell style={{ paddingLeft: "0", paddingRight: "0" }}>Client Name</TableCell>
                      <TableCell style={{ paddingLeft: "0", paddingRight: "0" }}>Resume Name</TableCell>
                      <TableCell style={{ paddingLeft: "0", paddingRight: "0" }}>Project</TableCell>
                      <TableCell style={{ paddingLeft: "20px", paddingRight: "0" }}>Rate</TableCell>
                      <TableCell style={{ paddingLeft: "0", paddingRight: "0", width: "170px" }}>
                        Conversion Rate
                      </TableCell>
                      <TableCell style={{ paddingLeft: "15px", paddingRight: "0" }}>Amount</TableCell>
                      <TableCell style={{ paddingLeft: "25px", paddingRight: "0" }}>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Array.isArray(invoices) && invoices.length > 0 ? (
                      invoices.filter((invoice) => {
                        if (searchInvoiceProject.trim().length === 0) return true;

                        const searchLower = searchInvoiceProject.toLowerCase();

                        return (
                          (invoice.projectName?.toLowerCase().startsWith(searchLower) ?? false) ||
                          (invoice.clientDetails?.clientName?.toLowerCase().startsWith(searchLower) ?? false) ||
                          (invoice.resumeName?.toLowerCase().startsWith(searchLower) ?? false)
                        );
                      })

                        .map((invoice, index) => {
                          if (!invoice) return null;
                          return (
                            <TableRow key={invoice._id}>
                              <TableCell>{index + 1}</TableCell>
                              <TableCell style={{ paddingLeft: "0", paddingRight: "0" }}>{invoice.invoiceNo}</TableCell>
                              <TableCell>{invoice.clientDetails?.clientName}</TableCell>
                              <TableCell style={{ paddingLeft: "0", paddingRight: "0" }}>
                                {invoice.resumeName || ""}
                              </TableCell>
                              <TableCell style={{ paddingLeft: "0", paddingRight: "0" }}>
                                {invoice.projectName || "Unnamed Project"}
                              </TableCell>
                              <TableCell>
                                {invoice.rate}(
                                {invoice.currencyType === "rupees" ? (
                                  <span>&#x20B9;</span>
                                ) : invoice.currencyType === "dollars" ? (
                                  <span>$</span>
                                ) : invoice.currencyType === "pounds" ? (
                                  <span>&#163;</span>
                                ) : null}
                                /{invoice.workingPeriodType})
                              </TableCell>
                              <TableCell sx={{ paddingX: "16px", width: "auto" }}>
                                {invoice.currencyType === "rupees" ? (
                                  <span>NA</span>
                                ) : (
                                  <span>
                                    &#x20B9; {(invoice?.conversionRate ?? 0).toFixed(2)}
                                  </span>
                                )}
                              </TableCell>

                              <TableCell>&#x20B9; {invoice.conversionRate ? invoice.amountAfterTax.toFixed(2) : 'N/A'}</TableCell>
                              <TableCell>
                                <Button
                                  variant="contained"
                                  color="primary"
                                  onClick={() => ViewAndPreviewPDF(invoice)}
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
                        <TableCell colSpan={8} style={{ textAlign: "center", padding: "20px" }}>
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
        </>
      )}
    </div>
  );
}

export default InvoiceListPage;