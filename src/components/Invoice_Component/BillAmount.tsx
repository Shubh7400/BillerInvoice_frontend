import * as React from "react";
import ReactDOM from "react-dom";
import { createRoot } from "react-dom/client";
import { Global } from "@emotion/react";
import { styled, useTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { deepPurple, grey, purple } from "@mui/material/colors";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
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
import TextField from '@mui/material/TextField';
import { AppBar, Dialog, IconButton, Toolbar } from "@mui/material";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import Styles from "./billi.module.css";
import { Link } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { AuthContext } from "../../states/context/AuthContext/AuthContext";
// import CloseIcon from "@mui/icons-material/Close";
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
  const [invoiceNo, setInvoiceNo] = React.useState(0);
  const [clientSameState, setClientSameState] = React.useState(false);
  const [amountWithoutTax, setAmountWithoutTax] = React.useState(0);
  const [amountAfterTax, setAmountAfterTax] = React.useState(0);
  const [invoiceDate, setInvoiceDate] = React.useState(dayjs());
  const [dueDate, setDueDate] = React.useState(dayjs());
  const [taxAmount, setTaxAmount] = React.useState(0);
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
  const invoiceObject = useSelector(
    (state: RootState) => state.invoiceObjectState
  );

  React.useEffect(() => {
    if (adminState.loading === "succeeded" && adminState.data) {
      setInvoiceNo(+adminState.data.invoiceNo + 1);
    }
    if (selectedClientState.data.sameState) {
      setClientSameState(selectedClientState.data.sameState);
    }
  }, [adminState, selectedClientState]);

  React.useEffect(() => {
    dispatch(updateInvoiceObjectStateAction({ invoiceNo }));
    toggleDrawer(true);
  }, [invoiceNo, projectsForInvoice, showPreview]);

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
          <DownloadPreview />
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
    // Define the content for your PDF
    // Create a div to render your component
    const div = document.createElement("div");
    div.style.width = "1050px";
    div.style.height = "1124px";
    document.body.appendChild(div);

    const root = createRoot(div);
    await root.render(
      <div>
        <Provider store={store}>
          <DownloadPreview />
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
        // Remove the temporary div
        document.body.removeChild(div);
      }
    }, 100);
  };

  const [advanceAmount, setAdvanceAmount] = React.useState<number | "">(0);
  const [grandTotal, setGrandTotal] = React.useState<number>(amountAfterTax);
  const handleAdvanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === "" ? "" : parseFloat(e.target.value);
    setAdvanceAmount(value);
  };
  
  React.useEffect(() => {
    const advance = typeof advanceAmount === "number" ? advanceAmount : 0;
    setGrandTotal(amountAfterTax - advance);
  }, [amountAfterTax, advanceAmount]);

  const toggleDrawer = (newOpen: boolean) => {
    if (projectsForInvoice && projectsForInvoice.length > 0) {
      if (showPreview) {
        generateAndPreviewPDF();
      }
      setPreviewAllowed(true);
      setOpen(newOpen);
      const projectsIdArr = projectsForInvoice.map((project) => {
        return project._id;
      });
      let amountPreTax = 0;
      projectsForInvoice.map((project) => {
        if (project.amount) {
          amountPreTax += project.amount;
          amountPreTax = +amountPreTax.toFixed(2);
        }
      });
      let tax = (amountPreTax * 18) / 100;
      let amountPostTax = +(amountPreTax + tax).toFixed(2);
      setAmountWithoutTax(amountPreTax);
      setAmountAfterTax(amountPostTax);
      setTaxAmount(tax);

      const clientId = projectsForInvoice[0].clientId;
      const adminId = projectsForInvoice[0].adminId;
      setInvoiceNo(+adminState.data.invoiceNo + 1);

      dispatch(
        updateInvoiceObjectStateAction({
          invoiceNo: invoiceNo,
          projectsId: projectsIdArr,
          clientId,
          adminId,
          amountWithoutTax: amountPreTax,
          amountAfterTax: amountPostTax,
          billDate: invoiceDate.toISOString(),
          dueDate: dueDate.toISOString(),
        })
      );
    } else {
      enqueueSnackbar("Select project to create and generate invoice.", {
        variant: "error",
      });
    }
  };

  function allInvoiceFieldsAvailable(obj: any) {
    for (const key in obj) {
      if (obj[key] === "" || obj[key].length <= 0) {
        return false;
      }
      if (obj.dueDate < obj.billDate) {
        return false;
      }
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
      {/* <Box
          sx={{
            position: "fixed",
            bottom: "8%",
            right: "12%",
            maxWidth: "100px",project 
            height: "40px",
            zIndex: 600,
            color: "white",
          }}
        >
          <Button variant="contained" onClick={toggleDrawer(true)}>
            Invoice
          </Button>
        </Box> */}

      {/* <SwipeableDrawer
        anchor="bottom"
        open={open}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        swipeAreaWidth={drawerBleeding}
        disableSwipeToOpen={false}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          width: "100%",
          height: "40%",
        }}
      > */}
      {/*Drawer header*/}
      {/* <Box
          sx={{
            // position: "absolute",
            top: -drawerBleeding,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            visibility: "visible",
            right: 0,
            left: 0,
            bgcolor: '#cfa184cf',
          }}
        >
          <Box
            sx={{
              width: 30,
              height: 6,
              backgroundColor: grey[100],
              borderRadius: 3,
              position: "absolute",
              top: 8,
              left: "calc(50% - 15px)",
            }}
          ></Box>
          <Box
            sx={{
              p: 2,
              color: "white",
              fontWeight: "semibold",
              fontSize: "20px",
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: { xs: "flex-start", sm: "space-between" },
              width: "100%",
            }}
          >
            Fill invoice required details.
            <span className="mr-8 text-sm">Invoice no.{invoiceNo}</span>
          </Box>
        </Box> */}
      {/*Drawer body*/}
      <Box
        sx={{
          px: 2,
          // pb: 2,
          height: "100%",
          overflow: "auto",
          bgcolor: bgColorBodyStyledBox,
          borderRadius: "20px",
        }}
      >
        {/*Date and Bill*/}
        <Box
          sx={{
            display: { xs: "block", sm: "flex", md: "flex" },
            pt: "10px",
            px: "20px",
            justifyContent: "space-between",
          }}
        >
          {/*Date picker*/}
          <Box
            sx={{
              width: "270px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              pt: "10px",
              color: "whitesmoke",
            }}
          >
          </Box>
          {/*Bill section*/}
          <Box
            sx={{
              minWidth: { xs: "100px", sm: "250px", md: "300px" },
              padding: "5px",
              mr: "15px",
              pb: { xs: "40px", sm: "15px" },
              color: textColor,
            }}
          >
            <p className=" text-xl md:text-2xl border-b-2 border-slate-800 border-opacity-70 mb-3 mt-3 md:mt-1 ">
              Bill Total
            </p>
            <div className="flex justify-between text-lg md:text-lg">
              Subtotal:<span>{amountWithoutTax} &#8377; </span>
            </div>
            <Box sx={{ mt: "6px" }}>
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
            </Box>
            <div className="flex justify-between border-t border-slate-800 border-opacity-70 text-xl md:text-2xl mt-4">
              Amount:
              <span className=" ">{amountAfterTax} &#8377; </span>
            </div>
            {workingFixed &&
              <>
                <div className="flex justify-between items-center border-t border-slate-800 border-opacity-70 text-xl md:text-2xl mt-4">
                <span>Advance:</span>
                  <TextField
                    label="Advance Amount"
                    variant="outlined"
                    // type="number"
                    value={advanceAmount}
                    onChange={handleAdvanceChange}
                    size="small"
                    sx={{ ml: 2, minWidth: "200px" }}
                  />
                  
                </div>

                <div>
                    <strong>Grand Total: </strong>₹{grandTotal.toFixed(2)}
                  </div>
              </>
            }
          </Box>
        </Box>
        {/*Download and Preview buttons*/}
        {/* <Box
            sx={{
              display: "flex",
              justifyContent: {
                xs: "space-between",
                sm: "flex-end",
                md: "flex-end",
              },
              width: { xs: "100%", sm: "100%" },
              mt: "20px",
              px: { xs: "0px", sm: "35px", md: "38px" },
              position: { xs: "fixed", sm: "static" },
              bottom: "0%",
              left: "1%",
            }}
          >
           
          </Box> */}
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
          disabled={!allowDownload}
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
          disabled={!previewAllowed}
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
