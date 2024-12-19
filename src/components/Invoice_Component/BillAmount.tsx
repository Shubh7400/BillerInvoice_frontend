import * as React from "react";
import ReactDOM from "react-dom";
import { createRoot } from "react-dom/client";
import { Global } from "@emotion/react";
import { styled, useTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { deepPurple, grey, purple } from "@mui/material/colors";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { SelectChangeEvent } from "@mui/material/Select";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import { Provider, useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState, store } from "../../states/redux/store";
import { useSnackbar } from "notistack";
import dayjs, { Dayjs } from "dayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { updateInvoiceObjectStateAction } from "../../states/redux/InvoiceProjectState/invoiceObjectState";
import { useAddInvoiceMutation } from "../../states/query/Invoice_queries/invoiceQueries";
import { getAdminByIdAction } from "../../states/redux/AdminStates/adminSlice";
import generatePDF, { Margin, usePDF } from "react-to-pdf";
import { RxCross1 } from "react-icons/rx";
import DownloadPreview from "./DownloadPreview";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { ThemeContext } from "../../states/context/ThemeContext/ThemeContext";
import TextField from "@mui/material/TextField";
import { AppBar, Dialog, IconButton, Toolbar } from "@mui/material";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import Styles from "./billi.module.css";
import { Link } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { AuthContext } from "../../states/context/AuthContext/AuthContext";
// import CloseIcon from "@mui/icons-material/Close";
import { MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import { addProjectForInvoiceAction } from "../../states/redux/InvoiceProjectState/addProjectForInvoiceSlice";
const drawerBleeding = 56;
let windowWidth: number | undefined = window.innerWidth;

interface billAmountProps {
  workingFixed?: boolean;
}
export default function InvoiceDrawer({ workingFixed }: billAmountProps) {
  const materialTheme = useTheme();
  const { visibility } = React.useContext(ThemeContext);
  const adminState = useSelector((state: RootState) => state.adminState);
  const selectedClientState = useSelector(
    (state: RootState) => state.selectedClientState
  );
  const { data: invoiceObject } = useSelector(
    (state: RootState) => state.invoiceObjectState
  );

  const [invoiceNo, setInvoiceNo] = React.useState(0);
  const [clientSameState, setClientSameState] = React.useState(false);
  const [invoiceDate, setInvoiceDate] = React.useState(dayjs());
  const [dueDate, setDueDate] = React.useState(dayjs());
  const [previewAllowed, setPreviewAllowed] = React.useState(true);
  const [showPreview, setShowPreview] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [tempImgData, setTempImgData] = React.useState("");
  const [allowDownload, setAllowDownload] = React.useState(true);
  const [bgColorHeadStyledBox, setBgColorHeadStyledBox] =
    React.useState("#151e2d");
  const [bgColorBodyStyledBox, setBgColorBodyStyledBox] =
    React.useState("#334155");
  const [textColor, setTextColor] = React.useState("whitesmoke");

  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch<AppDispatch>();
  const { projectsForInvoice } = useSelector(
    (state: RootState) => state.projectsForInvoiceState
  );

  React.useEffect(() => {
    if (adminState.loading === "succeeded" && adminState.data) {
      setInvoiceNo(+adminState.data.invoiceNo + 1);
      dispatch(
        updateInvoiceObjectStateAction({
          invoiceNo: +adminState.data.invoiceNo + 1,
          billDate: invoiceDate.toISOString(),
          dueDate: dueDate.toISOString(),
        })
      );
    }
    if (selectedClientState.data.sameState) {
      setClientSameState(selectedClientState.data.sameState);
    }
  }, [adminState, selectedClientState]);

  React.useEffect(() => {
    // dispatch(updateInvoiceObjectStateAction({ invoiceNo }));
    toggleDrawer(true);
  }, [projectsForInvoice, showPreview]);

  React.useEffect(() => {
    if (visibility) {
      setBgColorHeadStyledBox(materialTheme.palette.primary.main);
      setBgColorBodyStyledBox("whitesmoke");
      setTextColor("black");
    } else {
      setBgColorHeadStyledBox("#151e2d");
      setBgColorBodyStyledBox("#334155");
      setTextColor("whitesmoke");
    }
  }, [visibility]);

  const generateAndDownloadPDF = async () => {
    const doc = new jsPDF();
    const div = document.createElement("div");
    div.style.width = "1050px";
    div.style.height = "1124px";
    document.body.appendChild(div);

    const root = createRoot(div);
    await root.render(
      <div>
        <Provider store={store}>
          <DownloadPreview
            grandTotal={grandTotal}
            advanceAmount={advanceAmount}
          />
        </Provider>
      </div>
    );
    setTimeout(async () => {
      try {
        const canvas = await html2canvas(div);
        const imgData = await canvas.toDataURL("image/png");
        const imgOptions = {
          imageData: imgData,
          x: 5,
          y: 5,
          width: 200,
          height: 230,
          resolution: 96,
        };

        // Add the image to the PDF
        doc.addImage(imgOptions);

        // Save the PDF with a specific filename
        doc.save(`invoice${invoiceNo}.pdf`);
      } catch (error) {
        enqueueSnackbar({
          message: "Error generating PDF! Try again",
          variant: "error",
        });
      } finally {
        // Remove the temporary div
        document.body.removeChild(div);
        setAllowDownload(true);
      }
    }, 1000);
  };

  const generateAndPreviewPDF = async () => {
    const div = document.createElement("div");
    div.style.width = "1050px";
    div.style.height = "1124px";
    document.body.appendChild(div);

    const root = createRoot(div);
    await root.render(
      <div>
        <Provider store={store}>
          <DownloadPreview
            grandTotal={grandTotal}
            advanceAmount={advanceAmount}
          />
        </Provider>
      </div>
    );
    setTimeout(async () => {
      try {
        const canvas = await html2canvas(div);
        const imgData = canvas.toDataURL("image/png");
        setTempImgData(imgData);
      } catch (error) {
        enqueueSnackbar({
          message: "Error preview PDF! Try again",
          variant: "error",
        });
      } finally {
        document.body.removeChild(div);
      }
    }, 100);
  };

  const [gstType, setGstType] = React.useState("igst");
  const [amountWithoutTax, setAmountWithoutTax] = React.useState(0);
  const [taxAmount, setTaxAmount] = React.useState(0);
  const [amountAfterTax, setAmountAfterTax] = React.useState(0);
  const [advanceAmount, setAdvanceAmount] = React.useState(0);

  const [grandTotal, setGrandTotal] = React.useState(0);
  const handleGstChange = (event: SelectChangeEvent<string>) => {
    setGstType(event.target.value);
  };

  React.useEffect(() => {
    const taxPercentage = gstType === "igst" ? 18 : 9; // Calculate tax percentage based on gstType
    const tax = (amountWithoutTax * taxPercentage) / 100;
    const total = amountWithoutTax + tax;

    const totalWithAdvance = total - (typeof advanceAmount === "number" ? advanceAmount : 0);
  
    // Dispatch the updated invoice data, using the calculated values
    dispatch(
      updateInvoiceObjectStateAction({
        ...invoiceObject,
        taxType: gstType, 
        amountWithoutTax, 
        amountAfterTax: total, 
        taxAmount: tax, 
        advanceAmount, 
        grandTotal: totalWithAdvance,
      })
    );
  }, [gstType, amountWithoutTax, advanceAmount, dispatch]); // Ensure the useEffect depends on all the relevant states
  const calculateAmounts = () => {
  if (projectsForInvoice && projectsForInvoice.length > 0) {
    let amountPreTax = 0;
    let totalAdvanceAmount = 0;

    projectsForInvoice.forEach((project) => {
      if (project.amount) {
        amountPreTax += project.amount;
        amountPreTax = +amountPreTax.toFixed(2);
      }
      if (project.advanceAmount) {
        totalAdvanceAmount += project.advanceAmount * project.conversionRate; // Sum up the advance amounts
      }
    });

    let taxPercentage = 0;
    if (gstType === "sgst" || gstType === "cgst") {
      taxPercentage = 9;
    } else if (gstType === "igst") {
      taxPercentage = 18;
    }

    const tax = +(amountPreTax * taxPercentage / 100).toFixed(2);
    const amountPostTax = +(amountPreTax + tax).toFixed(2);
    const grandTotalLocal = +(amountPostTax - totalAdvanceAmount).toFixed(2);

    // Update state variables
    setAmountWithoutTax(amountPreTax);
    setAmountAfterTax(amountPostTax);
    setTaxAmount(tax);
    setAdvanceAmount(totalAdvanceAmount); // Set the advance amount
    setGrandTotal(grandTotalLocal);
  }
};

  const toggleDrawer = (newOpen: boolean) => {
  if (projectsForInvoice && projectsForInvoice.length > 0) {
    if (showPreview) {
      generateAndPreviewPDF();
    }
    setPreviewAllowed(true);
    setOpen(newOpen);

    const projectsIdArr = projectsForInvoice.map((project) => project._id);
    const clientId = projectsForInvoice[0].clientId;
    const adminId = projectsForInvoice[0].adminId;

    dispatch(
      updateInvoiceObjectStateAction({
        projectsId: projectsIdArr,
        clientId,
        adminId,
        amountWithoutTax,
        amountAfterTax,
        advanceAmount,
        taxType: gstType,
        taxAmount,
        grandTotal,
      })
    );
  } else {
    enqueueSnackbar("Select project to create and generate invoice.", {
      variant: "error",
    });
  }
};

React.useEffect(() => {
  calculateAmounts();
}, [projectsForInvoice, gstType]);


  function allInvoiceFieldsAvailable(obj: any) {
    
    if (!obj || typeof obj !== "object") {
      return false;
    }
    if (obj.dueDate && obj.billDate && obj.dueDate < obj.billDate) {
      return false;
    }
    const mandatoryFields = ["projectName", "currencyType", "rate", "workingPeriodType"];
    for (const field of mandatoryFields) {
      if (!obj[field] || (typeof obj[field] === "string" && obj[field].trim() === "")) {
        return false; 
      }
    }

    switch (obj.workingPeriodType) {
      case "months":
        if (!obj.ratePerDay || obj.ratePerDay <= 0) {
          return false;
        }
        if (!obj.workingPeriod || obj.workingPeriod <= 0) {
          return false;
        }
        break;
      case "hours":
        if (!obj.workingPeriod || obj.workingPeriod <= 0) {
          return false;
        }
        break;
      case "fixed":
        // No workingPeriod required for "fixed" type
        break;
      default:
        return false; 
    }

    return true; 
  }

  const AddInvoiceMutationHandler = useAddInvoiceMutation();
  let timer = null;
  const handleInvoiceDownload = (timer: any) => {
    setAllowDownload(false);
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      if (invoiceObject && allInvoiceFieldsAvailable(invoiceObject)) {
        AddInvoiceMutationHandler.mutate(invoiceObject, {
          onSuccess: () => {
            enqueueSnackbar("Download successfull", { variant: "success" });
            setPreviewAllowed(false);
            dispatch(getAdminByIdAction(projectsForInvoice[0].adminId));
            generateAndDownloadPDF();
          },
          onError: () => {
            setAllowDownload(true);
            enqueueSnackbar(
              "Network error in save and download invoice. Try again!",
              {
                variant: "error",
              }
            );
          },
        });
      } else {
        enqueueSnackbar(
          "Incomplete invoice details. Please fill invoice date <= due date.",
          { variant: "error" }
        );
      }
      return () => clearTimeout(timer);
    }, 1000);
  };

  const previewExecution = (value: boolean) => {
    if (value) setOpen(false);
    setShowPreview(value);
  };

  return (
    <Box>
      <CssBaseline />
      <Global
        styles={{
          ".MuiDrawer-root > .MuiPaper-root": {
            height: `calc(52% - ${drawerBleeding}px)`,
            overflow: "visible",
          },
        }}
      />

      <Box
        sx={{
          px: 2,
          height: "100%",
          overflow: "auto",
          borderRadius: "20px",
        }}
      >
        <Box
          sx={{
            display: { xs: "block", sm: "flex", md: "flex" },
            pt: "10px",
            px: "20px",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              width: "270px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              pt: "10px",
              color: "whitesmoke",
            }}
          ></Box>
          <Box
            sx={{
              minWidth: { xs: "100px", sm: "250px", md: "300px" },
              padding: "5px",
              mr: "15px",
              pb: { xs: "40px", sm: "15px" },
              color: textColor,
            }}
          >
            <div className="flex justify-between text-lg md:text-lg">
              Subtotal:<span> &#8377;{amountWithoutTax} </span>
            </div>
            {/* <Box sx={{ mt: "6px" }}>
              {clientSameState ? (
                <>
                  <div className="flex justify-between ">
                    SGST:(9%)<span>{(taxAmount / 2).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between ">
                    CGST:(9%)<span>{(taxAmount / 2).toFixed(2)}</span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between ">
                  GST:(18%)<span>{taxAmount.toFixed(2)}</span>
                </div>
              )}
            </Box> */}
            {/* <Box
              sx={{
                mt: "6px",
                "& .MuiFormControl-root": {
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px", 
                    backgroundColor: "rgba(255,255,255,0.9)", 
                    boxShadow: "0 2px 4px rgba(0,0,0,0.08)", 
                    transition: "all 0.3s ease",
                    "& .MuiSelect-select": {
                      paddingY: "14px", 
                      paddingX: "16px", 
                      fontWeight: 500, 
                      color: "rgba(0,0,0,0.87)", 
                    },
                    "& fieldset": {
                      borderColor: "rgba(0,0,0,0.23)", 
                      borderWidth: 1,
                      transition: "all 0.3s ease",
                    },
                    "&:hover fieldset": {
                      borderColor: "primary.main",
                      borderWidth: 2,
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "primary.main", 
                      borderWidth: 2,
                      boxShadow: "0 0 0 4px rgba(25,118,210,0.1)", 
                    },
                  },
                  "& .MuiInputLabel-outlined": {
                    transform: "translate(14px, 14px) scale(1)",
                    fontSize: "0.95rem",
                    color: "rgba(0,0,0,0.54)",
                    transition: "all 0.3s ease",
                  },
                  "& .MuiInputLabel-shrink": {
                    transform: "translate(14px, -6px) scale(0.75)",
                    color: "primary.main",
                    fontWeight: 600,
                  },
                },
              }}
            >
              <div className="flex items-center space-x-4">
                <FormControl sx={{ flex: 1 }}>
                  <Select
                    labelId="gst-type-label"
                    value={gstType}
                    onChange={handleGstChange}
                    label="GST Type"
                    fullWidth
                    sx={{
                      padding: 0,
                      width: "180px",
                      ".MuiOutlinedInput-notchedOutline": {
                        border: "none",
                      },
                      "& .MuiSelect-select": {
                        paddingLeft: "5px !important",
                        paddingTop: "0 !important",
                        paddingBottom: "0 !important",
                      },
                      "& .MuiSelect-icon": {
                        right: "8px",
                      },
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "0 !important",
                        borderBottom: "1px solid #000",
                        paddingLeft: "0 !important",
                      },
                    }}
                  >
                    <MenuItem
                      value="sgst_cgst"
                      sx={{
                        transition: "all 0.3s ease",
                        "&:hover": {
                          backgroundColor: "rgba(25,118,210,0.08)",
                          color: "primary.main",
                        },
                        "&.Mui-selected": {
                          backgroundColor: "rgba(25,118,210,0.16)",
                          color: "primary.main",
                          fontWeight: 600,
                          "&:hover": {
                            backgroundColor: "rgba(25,118,210,0.24)",
                          },
                        },
                      }}
                    >
                      SGST/CGST (18%)
                    </MenuItem>

                    <MenuItem
                      value="igst"
                      sx={{
                        transition: "all 0.3s ease",
                        "&:hover": {
                          backgroundColor: "rgba(25,118,210,0.08)",
                          color: "primary.main",
                        },
                        "&.Mui-selected": {
                          backgroundColor: "rgba(25,118,210,0.16)",
                          color: "primary.main",
                          fontWeight: 600,
                          "&:hover": {
                            backgroundColor: "rgba(25,118,210,0.24)",
                          },
                        },
                      }}
                    >
                      IGST (18%)
                    </MenuItem>
                  </Select>
                </FormControl>
                <div className="flex items-center text-sm text-gray-700 p-3 rounded-lg min-w-[120px] justify-end  transition-all duration-300 hover:bg-gray-100">
                  <span className="font-semibold text-gray-800">
                    {" "}
                    &#8377;{taxAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            </Box> */}

            <Box
              sx={{
                mt: "6px",
                "& .MuiFormControl-root": {
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    backgroundColor: "rgba(255,255,255,0.9)",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
                    transition: "all 0.3s ease",
                    "& .MuiSelect-select": {
                      paddingY: "14px",
                      paddingX: "16px",
                      fontWeight: 500,
                      color: "rgba(0,0,0,0.87)",
                    },
                    "& fieldset": {
                      borderColor: "rgba(0,0,0,0.23)",
                      borderWidth: 1,
                      transition: "all 0.3s ease",
                    },
                    "&:hover fieldset": {
                      borderColor: "primary.main",
                      borderWidth: 2,
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "primary.main",
                      borderWidth: 2,
                      boxShadow: "0 0 0 4px rgba(25,118,210,0.1)",
                    },
                  },
                },
              }}
            >
              <div className="flex items-center space-x-4">
                <FormControl sx={{ flex: 1 }}>
                  <Select
                    labelId="gst-type-label"
                    value={gstType}
                    onChange={handleGstChange}
                    label="GST Type"
                    fullWidth
                  >

                    <MenuItem value="sgst">SGST (9%)</MenuItem>
                    <MenuItem value="cgst">CGST (9%)</MenuItem>
                    <MenuItem value="igst">IGST (18%)</MenuItem>
                  </Select>
                </FormControl>
                <div className="flex items-center text-sm text-gray-700 p-3 rounded-lg min-w-[120px] justify-end transition-all duration-300 hover:bg-gray-100">
                  <span className="font-semibold text-gray-800">
                    &#8377;{taxAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            </Box>

            <div className="flex justify-between border-t border-slate-800 border-opacity-70 text-xl md:text-2xl mt-4">
              Amount:
              <span className=" "> &#8377;{amountAfterTax.toFixed(2)}</span>
            </div>
            {workingFixed && Number(advanceAmount) > 0 && (
              <>
                <div className="flex justify-between text-lg md:text-lg">
                  Advance:<span> &#8377;{advanceAmount}</span>
                </div>

                <div>
                  <strong>Grand Total: </strong>₹{grandTotal.toFixed(2)}
                </div>
              </>
            )}
          </Box>
        </Box>

      </Box>
      <Global
        styles={{
          ".MuiDrawer-root > .MuiPaper-root": {
            height: `calc(52% - ${drawerBleeding}px)`,
            overflow: "visible",
          },
          ".MuiInputBase-root": {
            background: "transparent !important",
            borderRadius: "50px !important",
          },
          ".MuiInputBase-input": {
            height: "0.4375em !important",
          },
          ".MuiFormControl-root": {
            background: "transparent !important",
          },
        }}
      />
      <div className="mt-3 flex gap-3 justify-end">
        <Button
          sx={{
            backgroundColor: "#d9a990",
            borderRadius: "20px",
            ":hover": {
              backgroundColor: "#4a6180",
            },
            // position: "absolute",
            // bottom: "50px",
            // right: "40px",
            color: "#fff",
          }}
          onClick={(timer) => {
            handleInvoiceDownload(timer);
          }}
        // disabled={!allowDownload}
        >
          Download
        </Button>
        <Button
          sx={{
            backgroundColor: "#d9a990",
            borderRadius: "20px",
            ":hover": {
              backgroundColor: "#4a6180",
            },
            // position: "absolute",
            // bottom: "50px",
            // right: "40px",
            color: "#fff",
          }}
          // disabled={!previewAllowed}
          onClick={() => previewExecution(true)}
        >
          Preview
        </Button>
      </div>
      {/* </SwipeableDrawer> */}

      {showPreview ? (
        <div className="w-screen h-[900px] sm:h-[1200px] absolute top-[0px] right-[0] z-[100] bg-[#989fce] bg-opacity-80 ">
          <div
            className="fixed top-[25px] right-[20px] flex  z-50 cursor-pointer hover:bg-inherit"
            onClick={() => previewExecution(false)}
          >
            <RxCross1 size={40} color="black" />
          </div>
          <div className="m-auto w-full h-auto flex justify-center items-start pt-0 mt-[15%] sm:mt-[5%] ">
            {tempImgData.length > 0 ? (
              <img src={tempImgData} alt="invoice" />
            ) : null}
          </div>
        </div>
      ) : null}
    </Box>
  );
}
