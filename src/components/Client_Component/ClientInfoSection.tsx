import React, { useState, useEffect } from "react";
import { ClientType } from "../../types/types";
import { RootState } from "../../states/redux/store";
import { useSelector } from "react-redux";

function ClientInfoSection() {
  const selectedClientState = useSelector(
    (state: RootState) => state.selectedClientState
  );

  const [clientData, setClientData] = useState<ClientType | null>(null);
  const [loadingState, setLoadingState] = useState("idle");

  useEffect(() => {
    if (selectedClientState?.data) {
      setClientData(selectedClientState.data);
      setLoadingState(selectedClientState.loading);
    }
  }, [selectedClientState]);

  const firstEmail = clientData?.email?.[0];
  const fullAddress = `${clientData?.address?.street}, ${clientData?.address?.city}, ${clientData?.address?.state}, ${clientData?.address?.country}`;
  const contactNo = clientData?.contactNo;
  return (
    <div>
      {clientData && loadingState !== "idle" ? (
        <div className="flex flex-col justify-end items-start">
          <div className="text-black ">
            <div className="text-black overflow-hidden overflow-ellipsis">
              <div className="flex items-center justify-between w-full">
                <h2 className="text-md sm:text-xl mt-3 font-semibold overflow-scroll overflow-x-hidden overflow-y-hidden sm:overflow-hidden">
                  {clientData.clientName}
                </h2>
              </div>
              <div >
                <p className="overflow-scroll overflow-x-hidden overflow-y-hidden sm:overflow-hidden mt-2">
                  <b>Email: </b>
                  {firstEmail}
                </p>

              </div>
              {contactNo && (
                <p>
                  <b>Contact No: </b>
                  {contactNo}
                </p>
              )}
              <p className="mb-2">
                <b>Address: </b>
                {fullAddress}
              </p>


            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default ClientInfoSection;
