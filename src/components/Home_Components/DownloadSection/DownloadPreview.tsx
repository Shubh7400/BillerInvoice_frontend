import React from "react";
import "./DownloadPreview.module.css";
import dayjs, { Dayjs } from "dayjs";
import { Link } from "react-router-dom";
import { Box } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../../states/redux/store";
import { ClientType } from "../../../types/types";
import cubexoLogo from "../../../utils/images/cubexoLogo.webp";
import gammaedgeLogo from "../../../utils/images/gammaedgeLogo.png";

const DownloadPreview = () => {
  const { loading, data, error } = useSelector(
    (state: RootState) => state.adminState
  );
  const selectedClient = useSelector(
    (state: RootState) => state.selectedClientState
  );
  const { projectsForInvoice } = useSelector(
    (state: RootState) => state.projectsForInvoiceState
  );
  const invoiceObject = useSelector(
    (state: RootState) => state.invoiceObjectState
  );

  const clientObj: ClientType = selectedClient.data;

  const taxAmount = +(
    invoiceObject.amountAfterTax - invoiceObject.amountWithoutTax
  ).toFixed(2);

  if (data.companyLogo === "https://gammaedge.io/images/logo1.png") {
  }
  return (
    <div className="p-4 text-black w-[900px] bg-white m-auto ">
      {/* Logo and Admin seection */}
      <div className=" flex justify-between mb-6">
        {/*Logo*/}
        <div className="w-[55%] h-auto mr-4 mt-4 ">
          {data.companyLogo === "https://gammaedge.io/images/logo1.png" ? (
            <img
              src={gammaedgeLogo}
              alt="gammaedgeLogo"
              className="h-[70%] w-auto "
            />
          ) : (
            <img src={cubexoLogo} alt="cubexoLogo" className="h-auto w-auto " />
          )}
        </div>
        {/*Admin*/}
        <div className=" text-black w-[50%]  ">
          <h3 className=" text-sm  font-bold ">{data.companyName}</h3>
          <p className="text-xs ">
            <b>Gstin: </b>
            {data.gistin}
            <br />
            <b>Pan: </b>
            {data.pancardNo}
          </p>
          <p className="my-1"></p>
          <div className="text-black text-xs opacity-70 flex flex-col justify-start ">
            <p>{data.address?.street}</p>
            <p>
              {data.address?.city +
                " " +
                data.address?.state +
                " " +
                data.address?.postalCode +
                " -" +
                data.address?.country}
            </p>
            <p>
              <span className="text-sky-600 underline font-semibold ">
                {data.email}
              </span>
              {" | " + data.contactNo}
            </p>
          </div>
        </div>
      </div>
      {/* Invoivce and Client section */}
      <div className="flex justify-between mb-2 ">
        {/*Invoice date*/}
        <div className="w-[55%] h-auto mr-4 text-xs  pt-4 ">
          <div className=" flex justify-start w-[40%] text-white bg-colorPdf  mb-2 px-2">
            <span className=" mb-1 pb-1 font-semibold">
              Invoice Number: {invoiceObject.invoiceNo}
            </span>
          </div>
          <div className=" flex justify-start w-[40%] text-white bg-colorPdf  mb-2 px-2">
            <span className="mb-1 pb-1 font-semibold">
              Bill date: {dayjs(invoiceObject.billDate).format("DD/MM/YYYY")}{" "}
            </span>
          </div>
          <div className=" flex justify-start w-[40%] text-white bg-colorPdf  mb-2 px-2">
            <span className="mb-1 pb-1 font-semibold">
              Due date: {dayjs(invoiceObject.dueDate).format("DD/MM/YYYY")}
            </span>
          </div>
        </div>
        {/*Client*/}
        <div className=" text-black w-[50%]  ">
          <p className=" text-xs  font-bold">Bill To:</p>
          <h3 className=" text-sm  font-bold ">
            {selectedClient.data.clientName}
          </h3>
          <p className=" text-xs ">
            <b>Gstin: </b>
            {selectedClient.data.gistin}
          </p>
          <div className="text-black text-xs opacity-70 flex flex-col justify-start ">
            <p>{selectedClient.data.address?.street}</p>
            <p>
              {selectedClient.data.address?.city +
                " " +
                selectedClient.data.address?.state +
                " " +
                selectedClient.data.address?.postalCode +
                " -" +
                selectedClient.data.address?.country}
            </p>
          </div>
        </div>
      </div>
      {/* Table section */}
      <div className="mb-8 w-[100%]   ">
        <table className=" w-[850px] ">
          <thead className="h-12  thead ">
            <tr className=" bg-colorPdf text-white h-12 text-sm px-4  relative">
              <th
                style={{ border: "none" }}
                className="th h-full relative -top-2 px-4  "
              >
                Sr.no.
              </th>
              <th
                style={{ border: "none" }}
                className="th h-full relative -top-2 px-4 "
              >
                Project
              </th>
              <th
                style={{ border: "none" }}
                className="th h-full relative -top-2 px-4 "
              >
                Project Period
              </th>
              <th
                style={{ border: "none" }}
                className="th h-full relative -top-2 px-4 "
              >
                Rate
              </th>
              <th
                style={{ border: "none" }}
                className="th h-full relative -top-2 px-4 "
              >
                Working Period
              </th>
              <th
                style={{ border: "none" }}
                className="th h-full relative -top-2 px-4 "
              >
                Conversion Rate
              </th>
              <th
                style={{ border: "none" }}
                className="th h-full relative -top-2 px-4 "
              >
                Amount
              </th>
            </tr>
          </thead>
          <tbody className="">
            <tr className="h-2 border-none "></tr>
            {projectsForInvoice?.map((project: any, index: any) => {
              return (
                <tr className="text-black " key={project._id}>
                  <td className="border border-[#172554] text-center pb-2 px-2 text-sm">
                    <label>{index + 1}</label>
                  </td>
                  <td className="border border-[#172554] text-center pb-2 px-2 text-sm">
                    {project.projectName}
                    <br />
                    <span className="opacity-70 text-sm">
                      ({project.projectManager})
                    </span>
                  </td>
                  <td className="border border-[#172554] text-center pb-2 px-2 text-sm">
                    {project.projectPeriod ? (
                      <>
                        {project.projectPeriod} <br />(
                        {project.workingPeriodType}){" "}
                      </>
                    ) : (
                      "Hour based project"
                    )}
                  </td>
                  <td className="border border-[#172554] text-center pb-2 px-2 text-sm">
                    {project.rate}
                    <br />(
                    {project.currencyType === "rupees" ? (
                      <span>&#x20B9;</span>
                    ) : project.currencyType === "dollars" ? (
                      <span>$</span>
                    ) : project.currencyType === "pounds" ? (
                      <span>&#163;</span>
                    ) : null}
                    /{project.workingPeriodType})
                  </td>
                  <td className="border border-[#172554] text-center pb-2 px-2 text-sm">
                    {project.workingPeriod}
                    <br />({project.workingPeriodType})
                  </td>
                  <td className="border border-[#172554] text-center pb-2 text-sm">
                    {project.currencyType === "rupees" ? (
                      <span>&#x20B9; </span>
                    ) : project.currencyType === "dollars" ? (
                      <span>$ </span>
                    ) : project.currencyType === "pounds" ? (
                      <span>&#163; </span>
                    ) : null}
                    {project.conversionRate}
                  </td>
                  <td className="border border-[#172554] text-center pb-2 px-2 text-sm">
                    {" "}
                    &#x20B9; {project.amount ? project.amount : 0}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* Bank and bill amount section */}
      <div className=" flex justify-between capitalize font-bold text-sm">
        <div className="w-[60%]">
          <p className="capitalize">{data.companyName}</p>
          <p>A/C NO:{data.accountNo}</p>
          <p>BANK:{data.bank}</p>
          <p>IFSC:{data.ifsc}</p>
        </div>
        <Box
          sx={{
            width: "300px",
            mr: "15px",
            color: "black",
          }}
        >
          <div className="flex justify-between text-sm  text-black font-semibold mb-4 ">
            SUBTOTAL:<span>{invoiceObject.amountWithoutTax} &#8377; </span>
          </div>
          <Box sx={{ mb: "30px" }}>
            {selectedClient.data.sameState ? (
              <>
                <div className="flex justify-between ">
                  SGST @ 9%<span>{taxAmount / 2}</span>
                </div>
                <div className="flex justify-between ">
                  CGST @ 9%<span>{taxAmount / 2}</span>
                </div>
              </>
            ) : (
              <div className="flex justify-between ">
                CGST:(18%)<span>{taxAmount}</span>
              </div>
            )}
          </Box>
          <div className="flex justify-between text-lg font-bold mt-4 text-white h-8 bg-colorPdf px-2 relative">
            <div className="border-r  border-white  w-[40%] text-left absolute -top-2 left-2">
              Total
            </div>
            <div
              style={{ border: "none" }}
              className="w-[70%] text-right flex justify-end absolute -top-2 right-2 "
            >
              {invoiceObject.amountAfterTax} &#8377;{" "}
            </div>
          </div>
        </Box>
      </div>
    </div>
  );
};

export default DownloadPreview;
