import * as React from "react";
import { createRoot } from "react-dom/client";
import { Global } from "@emotion/react";
import { useTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { SelectChangeEvent } from "@mui/material/Select";
import { Provider, useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState, store } from "../../states/redux/store";
import { useSnackbar } from "notistack";
import dayjs, { Dayjs } from "dayjs";
import { updateInvoiceObjectStateAction } from "../../states/redux/InvoiceProjectState/invoiceObjectState";
import { useAddInvoiceMutation } from "../../states/query/Invoice_queries/invoiceQueries";
import { getAdminByIdAction } from "../../states/redux/AdminStates/adminSlice";
import { RxCross1 } from "react-icons/rx";
import DownloadPreview from "./DownloadPreview";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { ThemeContext } from "../../states/context/ThemeContext/ThemeContext";
// import CloseIcon from "@mui/icons-material/Close";
import { MenuItem, Select, FormControl, InputLabel } from "@mui/material";
const drawerBleeding = 56;
let windowWidth: number | undefined = window.innerWidth;

interface billAmountProps {
  workingFixed?: boolean;
}
export default function InvoiceDrawer({ workingFixed}: billAmountProps) {
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
  const [sameCountry, setSameCountry] = React.useState(false);
  // const [invoiceDate, setInvoiceDate] = React.useState(dayjs());
  // const [dueDate, setDueDate] = React.useState(dayjs());
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
          // billDate: invoiceDate.toISOString(),
          // dueDate: dueDate.toISOString(),
        })
      );
    }

    if (
      selectedClientState?.data.address?.country &&
      adminState?.data?.address?.country &&
      selectedClientState.data.address.country.trim().toLowerCase() === 
      adminState.data.address.country.trim().toLowerCase()
    ) {
      setSameCountry(true);
    } else {
      setSameCountry(false);
    }

    if (
      selectedClientState?.data.address?.state &&
      adminState?.data?.address?.state &&
      selectedClientState.data.address.state.trim().toLowerCase() === 
      adminState.data.address.state.trim().toLowerCase()
    ) {
      setClientSameState(true);
    } else {
      setClientSameState(false);
    }

  }, [adminState, selectedClientState]);


  React.useEffect(() => {
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
            showPreview={showPreview}
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

        doc.addImage(imgOptions);

        doc.save(`invoice${invoiceNo}.pdf`);
      } catch (error) {
        enqueueSnackbar({
          message: "Error generating PDF! Try again",
          variant: "error",
        });
      } finally {
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
            showPreview={showPreview}
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

  const [gstType, setGstType] = React.useState("");
  const [amountWithoutTax, setAmountWithoutTax] = React.useState(0);
  const [taxAmount, setTaxAmount] = React.useState(0);
  const [amountAfterTax, setAmountAfterTax] = React.useState(0);
  const [advanceAmount, setAdvanceAmount] = React.useState(0);

  const [grandTotal, setGrandTotal] = React.useState(0);
  const handleGstChange = (event: SelectChangeEvent<string>) => {
    setGstType(event.target.value);
  };
  React.useEffect(() => {
    if (sameCountry === true) {
      if (clientSameState === true) {
        setGstType("sgst_cgst")
      }
      else {
        setGstType("igst")
      }
    }
    else {
      setGstType("");
    }
    dispatch(
      updateInvoiceObjectStateAction({
        ...invoiceObject,
        taxType: gstType,
      })
    );
  }, [clientSameState, sameCountry]);
  React.useEffect(() => {

    const tax = sameCountry === true ? +(amountWithoutTax * 18 / 100).toFixed(2) : 0;

    const total = amountWithoutTax + tax;

    const totalWithAdvance = total - (typeof advanceAmount === "number" ? advanceAmount : 0);

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
  }, [gstType, amountWithoutTax, advanceAmount, dispatch]);

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

      const tax = sameCountry === true ? +(amountPreTax * 18 / 100).toFixed(2) : 0;

      const amountPostTax = +(amountPreTax + tax).toFixed(2);
      const grandTotalLocal = +(amountPostTax - totalAdvanceAmount).toFixed(2);

      setAmountWithoutTax(amountPreTax);
      setAmountAfterTax(amountPostTax);
      setTaxAmount(tax);
      setAdvanceAmount(totalAdvanceAmount); 
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
  }, [projectsForInvoice, gstType, sameCountry]);

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

    const { loading, data, error } = selectedClientState;

    if (loading === "succeeded" && Object.keys(data).length === 0 && error === null) {
      enqueueSnackbar("Client deleted. Cannot generate invoice.", {
        variant: "error",
      });
      setAllowDownload(true);
      return;
    }


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
              Subtotal:<span> &#8377;{amountWithoutTax.toFixed(2)} </span>
            </div>
            {sameCountry &&
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
                      {" "} &#8377;{taxAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </Box>
            }


            <div className="flex justify-between border-t border-slate-800 border-opacity-70 text-xl md:text-2xl mt-2">
              Amount:
              <span className=" "> &#8377;{amountAfterTax.toFixed(2)}</span>
            </div>
            {workingFixed && Number(advanceAmount) > 0 && (
              <>
                <div className="flex justify-between text-lg md:text-lg">
                  Advance:<span> &#8377;{advanceAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t border-slate-800 border-opacity-70 text-xl md:text-2xl mt-2">
                  Grand Total:
                  <span className=" "> &#8377;{grandTotal.toFixed(2)}</span>
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
            color: "#fff",
          }}
          // disabled={!previewAllowed}
          onClick={() => previewExecution(true)}
        >
          Preview
        </Button>
      </div>

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
