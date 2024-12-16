import React from "react";
import "./DownloadPreview.module.css";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { RootState } from "../../states/redux/store";
import { ClientType } from "../../types/types";
import cubexoLogo from "../assets/cubexo_logo.png";
import gammaedgeLogo from "../../utils/images/gammaedgeLogo.png";
import billbg from "../assets/invoice_bg.png";
import { TbBorderRadius } from "react-icons/tb";

interface DownloadPreviewProps {
  grandTotal: number;
  advanceAmount: number;
}
const DownloadPreview = ({ grandTotal, advanceAmount }: DownloadPreviewProps) => {
  const { data } = useSelector((state: RootState) => state.adminState);
  const selectedClient = useSelector(
    (state: RootState) => state.selectedClientState
  );
  const { projectsForInvoice } = useSelector(
    (state: RootState) => state.projectsForInvoiceState
  );
  const { data: invoiceObject } = useSelector(
    (state: RootState) => state.invoiceObjectState
  );

  const clientObj: ClientType = selectedClient.data;
  const taxAmount = +(
    invoiceObject.amountAfterTax - invoiceObject.amountWithoutTax
  ).toFixed(2);



  return (
    <div className="relative w-full h-[297mm] flex items-center justify-center  ">
      <div
        className="relative w-full h-[297mm] bg-center overflow-hidden "
        style={{
          backgroundImage: `url(${billbg})`,
          backgroundSize: "100% 100%", // Ensures the entire image is visible without cropping
          backgroundRepeat: "no-repeat", // Prevents the image from repeating
        }}
      >
        <div className="absolute inset-0 p-8 pt-20 flex flex-col">
          {/* Logo and Admin section */}
          <div className="flex justify-between mb-6">
            <div className="w-[55%]">
              {data.companyLogo === "https://gammaedge.io/images/logo1.png" ? (
                <img
                  src={gammaedgeLogo}
                  alt="gammaedgeLogo"
                  className="h-auto w-auto"
                />
              ) : (
                <img
                  src={cubexoLogo}
                  alt="cubexoLogo"
                  className="h-auto w-auto"
                />
              )}
            </div>
            <div className="w-[20%]">
              <div className="text-black  px-2  mb-1">
                Invoice Number: {invoiceObject.invoiceNo}
              </div>
              <div className="text-black px-2  mb-1">
                Bill date: {dayjs(invoiceObject.billDate).format("DD/MM/YYYY")}
              </div>
              <div className="text-black px-2 mb-1">
                Due date: {dayjs(invoiceObject.dueDate).format("DD/MM/YYYY")}
              </div>
            </div>
          </div>
          {/* Invoice and Client section */}
          <div className="flex justify-between my-4 ">
            <div className="text-black">
              <h1 className="text-[20px] flex items-center h-[30px] mt-[-10px] text-white bg-[#94b9ff] w-[300px] rounded pb-[20px] pl-2 ">
                Billing From
              </h1>
              <h3 className="font-bold p-[3px]">{data.companyName}</h3>
              <p className="text-xs p-[3px] text-[15px]">
                <b>Gstin:</b> {data.gistin}
                <br />
                <b>Pan:</b> {data.pancardNo}
              </p>
              <p className="text-xs opacity-70 p-[3px] text-[15px]">
                <span>{data.address?.street}</span>
                <br />
                {data.address?.city}, {data.address?.state}{" "}
                {data.address?.postalCode} - {data.address?.country}
                <br />
                <span className="font-semibold">{data.email}</span> |{" "}
                {data.contactNo}
              </p>
            </div>
            <div className="text-black">
              <h1 className="text-[20px] flex items-center h-[30px] mt-[-10px] text-white bg-[#94b9ff] w-[300px] rounded pb-[20px] pl-2 ">
                Bill To
              </h1>
              <h3 className="text-sm font-bold p-[3px]">
                {clientObj.clientName}
              </h3>
              <p className="text-xs p-[3px] text-[15px]">
                <b>Gstin:</b> {clientObj.gistin}
              </p>
              <p className="text-xs opacity-70 p-[3px] text-[15px]">
                {clientObj.address?.street}
                <br />
                {clientObj.address?.city}, {clientObj.address?.state}{" "}
                {clientObj.address?.postalCode} - {clientObj.address?.country}
              </p>
            </div>
          </div>
          {/* Table section */}
          <table
            className="w-full my-4 text-sm rounded-[20px]"
            style={{
              borderRadius: "20px",
            }}
          >
            <thead className="bg-[#94b9ff] text-white ">
              <tr>
                <th className="px-2 pb-4">Sr.no.</th>
                <th className="px-2 pb-4">Project Name</th>
                {/* <th className="px-2 pb-4">Project Period</th> */}
                <th className="px-2 pb-4">Rate</th>
                {projectsForInvoice?.map((project, index) => (
                  <>
                    {project.workingPeriodType === "months" && (
                    <th key={index} className="px-2 pb-4">Rate/day</th>
                    )}
                   { project.workingPeriodType !== "fixed" && (
                    <th className="px-2 pb-4">Working Period</th>)}
                  </>


                ))}


                <th className="px-2 pb-4">Conversion Rate</th>
                <th className="px-2 pb-4">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {projectsForInvoice?.map((project, index) => (
                <tr key={project._id} className="text-black">
                  <td className="border px-2 pb-4 text-center">{index + 1}</td>
                  <td className="border px-2 pb-4 text-center">
                    {project.projectName}
                  </td>
                  {/* <td className="border px-2 pb-4 text-center">
                  </td> */}
                  <td className="border px-2 pb-4 text-center">
                    {`${project.rate}/${project.workingPeriodType}`}
                  </td>

                  {project.workingPeriodType === "months" && (
                    <td className="border px-2 pb-4 text-center">
                      {project.ratePerDay?.toFixed(2)}
                    </td>
                  )}
                  {project.workingPeriodType !== "fixed" &&
                    <td className="border px-2 pb-4 text-center">
                      {project.workingPeriod || 1}
                    </td>
                  }
                  <td className="border px-2 pb-4 text-center">
                    {project.conversionRate.toFixed(2)}
                  </td>
                  <td className="border px-2 pb-4 text-center">
                    &#x20B9; {project.amount?.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Bank and Total amount section */}
          <div className="flex justify-between mt-4">
            <div className="text-sm">
              <h1 className="text-[20px] flex items-center h-[30px] mt-[-10px] text-white bg-[#94b9ff] w-[300px] rounded pb-[20px] pl-2 ">
                Payment info
              </h1>
              <p className="font-bold">{data.companyName}</p>
              <p>A/C NO: {data.accountNo}</p>
              <p>BANK: {data.bank}</p>
              <p>IFSC: {data.ifsc}</p>
            </div>
            <div className="text-sm w-[300px]">
              <div className="flex justify-between mb-2">
                SUBTOTAL: <span>&#8377; {invoiceObject.amountWithoutTax}</span>
              </div>
              {/* {clientObj.sameState ? (
                <>
                  <div className="flex justify-between">
                    SGST @ 9%: <span>{taxAmount / 2}</span>
                  </div>
                  <div className="flex justify-between">
                    CGST @ 9%: <span>{taxAmount / 2}</span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between mb-[30px]">
                  IGST @ 18%: <span>{taxAmount}</span>
                </div>
              )} */}
              <div className="flex justify-between mb-[30px]">
                {invoiceObject.taxType === 'igst' ? (<span>IGST</span>) : (<span>SGST+CGST</span>)} <span>{taxAmount}</span>
              </div>

              {advanceAmount > 0 ?
                (<>

                  <div className="flex justify-between mb-[30px]">
                    Advance: <span>{advanceAmount}</span>
                  </div>
                  <div className="text-[20px] justify-between flex items-center h-[30px] mt-[-10px] text-white bg-[#94b9ff] w-[300px] rounded pb-[20px] px-2 ">
                    GrandTotal: <span>{grandTotal}</span>
                  </div>

                </>) :
                (
                  <>
                    <div className="text-[20px] justify-between flex items-center h-[30px] mt-[-10px] text-white bg-[#94b9ff] w-[300px] rounded pb-[20px] px-2 ">
                      Total: <span>&#8377; {invoiceObject.amountAfterTax}</span>
                    </div>
                  </>
                )
              }
            </div>
          </div>
        </div>
        {/* T&C section*/}
        <div className="flex justify-between absolute bottom-[15%] right-[10%]">
          <div>
            <h3 className="font-bold text-[20px] p-[3px]">
              {data.companyName}
            </h3>
          </div>
        </div>
        {/* <div className=" absolute bottom-[5%] mx-8">
          <h1 className="text-[16px] font-bold">Terms and Conditions</h1>
          <ul>
            <li><span className="font-bold">1.</span> Late payments will incur a monthly interest charge of 1.5% or the maximum permitted by law, beginning from the due date until the balance is paid in full.</li>
            <li><span className="font-bold">2.</span>Once payment is complete, ownership rights are transferred to the client, unless otherwise stated in the project agreement.</li>
          </ul>
        </div> */}
      </div>
    </div>
  );
};

export default DownloadPreview;
