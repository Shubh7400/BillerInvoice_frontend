import BillAmount from "./BillAmount";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../states/redux/store";
import { ClientType } from "../../types/types";

const InvoicePage = () => {
  const navigate = useNavigate();
  const selectedClientState = useSelector(
    (state: RootState) => state.selectedClientState
  );
  const clientObj: ClientType = selectedClientState.data;

  const { projectsForInvoice } = useSelector(
    (state: RootState) => state.projectsForInvoiceState
  );
  const invoiceObject = useSelector(
    (state: RootState) => state.invoiceObjectState
  );
  return (
    <BillAmount />
    // <div>
    //   {clientObj && selectedClientState.loading !== "idle" ? (
    //     projectsForInvoice.length > 0 ? (
    //     ) : (
    //       <div className="flex justify-center items-center h-[80vh] m-auto">
    //         <div className="text-center">
    //           <img src={projectError} alt="" className="w-[300px] m-auto" />
    //           <h4 className="text-[20px] mb-3">
    //             Please select atleast one project :{" "}
    //           </h4>
    //           <Button
    //             variant="contained"
    //             sx={{
    //               backgroundColor: "#d9a990",
    //               borderRadius: "20px",
    //               ":hover": {
    //                 backgroundColor: "#4a6180",
    //               },
    //             }}
    //             onClick={() => navigate("/projects")}
    //           >
    //             Select Project
    //           </Button>
    //         </div>
    //       </div>
    //     )
    //   ) : (
    //     <div className="flex justify-center items-center h-[80vh] m-auto">
    //       <div className="text-center">
    //         <img src={error} alt="" className="w-[300px] m-auto" />
    //         <h4 className="text-[20px] mb-3">
    //           Please select a client to see projects :{" "}
    //         </h4>
    //         <Button
    //           variant="contained"
    //           sx={{
    //             backgroundColor: "#d9a990",
    //             borderRadius: "20px",
    //             ":hover": {
    //               backgroundColor: "#4a6180",
    //             },
    //           }}
    //           onClick={() => navigate("/clients")}
    //         >
    //           Select Client
    //         </Button>
    //       </div>
    //     </div>
    //   )}
    // </div>
  );
};

export default InvoicePage;
