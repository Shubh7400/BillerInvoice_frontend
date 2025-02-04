import React, { useState, useEffect } from "react";
import { ClientType } from "../../types/types";
import { RootState } from "../../states/redux/store";
import { useSelector } from "react-redux";
import { ProjectType } from "../../types/types";
interface clientInfoProp {
  projectsForInvoice: ProjectType[];
}
function ClientInfoSection({ projectsForInvoice }: clientInfoProp) {
  const selectedClientState = useSelector(
    (state: RootState) => state.selectedClientState
  );

const initialClientData =
  Object.keys(selectedClientState.data).length > 0
    ? selectedClientState.data
    : (projectsForInvoice[0]?.clientDetails as ClientType) || {};

const [clientData, setClientData] = useState<ClientType | null>(
  initialClientData
);


 const [loadingState, setLoadingState] = useState(
   selectedClientState?.loading || "idle"
 );

useEffect(() => {
  if (
    selectedClientState?.data &&
    Object.keys(selectedClientState.data).length > 0
  ) {
    
    setClientData(selectedClientState.data);
    setLoadingState(selectedClientState.loading);
  } else if (projectsForInvoice?.length > 0) {
   
    const fallbackClient = projectsForInvoice[0]?.clientDetails as ClientType;
    if (fallbackClient) {
      setClientData(fallbackClient);
      setLoadingState("succeeded");
    }
  }
}, [selectedClientState, projectsForInvoice]);
// useEffect(() => {
//   if (
//     selectedClientState?.data &&
//     Object.keys(selectedClientState.data).length > 0
//   ) {
//     if (selectedClientState.data !== clientData) {
//       setClientData(selectedClientState.data);
//     }
//     setLoadingState(selectedClientState.loading);
//   } else if (projectsForInvoice?.length > 0) {
//     const fallbackClient = projectsForInvoice[0]?.clientDetails as ClientType;
//     if (fallbackClient && fallbackClient !== clientData) {
//       setClientData(fallbackClient);
//       setLoadingState("succeeded");
//     }
//   }
// }, [selectedClientState, projectsForInvoice, clientData]);



const fullAddress = `${clientData?.address?.street || ""}, ${
  clientData?.address?.city || ""
} ${clientData?.address?.state || ""} ${
  clientData?.address?.country || ""
}`;

  return (
    <div>
    {loadingState === "pending" ? (
      <p>Loading client information...</p>
    ) : clientData && Object.keys(clientData).length > 0 ? (
      <div className="flex flex-col justify-end items-start">
        <div className="text-black ">
          <div className="text-black overflow-hidden overflow-ellipsis">
            <div className="flex items-center justify-between w-full">
              <h2 className="text-md sm:text-xl mt-3 font-semibold overflow-scroll overflow-x-hidden overflow-y-hidden sm:overflow-hidden">
                {clientData.clientName}
              </h2>
            </div>
            <div>
              <p className="overflow-scroll overflow-x-hidden overflow-y-hidden sm:overflow-hidden mt-2">
                <b>Email: </b>
                {clientData.email?.[0] || "N/A"}
              </p>
            </div>
            {clientData.contactNo && (
              <p>
                <b>Contact No: </b>
                {clientData.contactNo}
              </p>
            )}
            <p className="mb-2">
              <b>Address: </b>
              {fullAddress.trim() || "N/A"}
            </p>
          </div>
        </div>
      </div>
    ) : (
      <p>No client information available.</p>
    )}
  </div>
    
  );
}

export default ClientInfoSection;
