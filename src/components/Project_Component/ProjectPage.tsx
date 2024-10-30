import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../states/redux/store";
import { ClientType } from "../../types/types";
import { Button, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";

const ProjectPage = () => {
  const clients = useSelector((state: RootState) => state.allClientsState);
  const selectedClient = useSelector(
    (state: RootState) => state.selectedClientState
  );
  const clientObj: ClientType = selectedClient.data;

  const navigate = useNavigate();
  const materialTheme = useTheme();

  const clientsArr: ClientType[] = clients.data;
  return (
    <div>
      {clientObj && selectedClient.loading !== "idle" ? (
        <div className=" border-l w-1/2  border-l-slate-400  flex flex-col justify-end items-start ">
          <div className="text-black ml-0.5 sm:ml-4 dark:text-colorLightFont p-2 sm:p-4 w-full ">
            <div className=" text-black dark:text-colorLightFont  overflow-hidden overflow-ellipsis">
              <h2 className=" text-sm sm:text-lg my-2 font-semibold overflow-scroll overflow-x-hidden overflow-y-hidden sm:overflow-hidden ">
                {clientObj.clientName}
              </h2>
              <p className="mt-2">
                <b>Gstin : </b>
                {clientObj.gistin}
              </p>
              <p className="mb-2">
                <b>Pancard: </b>
                {clientObj.pancardNo}
              </p>
              <div className="text-black dark:text-colorLightFont opacity-70 flex flex-col justify-start gap-1 ">
                <p>{clientObj.address ? clientObj.address.street : null}</p>
                <p>
                  {clientObj.address
                    ? clientObj.address.city + " " + clientObj.address.state
                    : null}
                </p>
                <p>
                  {clientObj.address
                    ? clientObj.address.postalCode +
                      " -" +
                      clientObj.address.country
                    : null}
                </p>
                <p>
                  <b>Contact: </b>
                  {clientObj.contactNo}
                </p>
                <p className=" overflow-scroll overflow-x-hidden overflow-y-hidden sm:overflow-hidden">
                  <b>Email: </b>
                  {clientObj.email}
                </p>
                <p>
                  <b>Conversion rate:</b>
                  {" " + clientObj.conversionRate}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center gap-10">
          <h4>Please select a client to see projects : </h4>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#d9a990",
              borderRadius: "20px",
              ":hover": {
                backgroundColor: materialTheme.palette.secondary.main,
              },
            }}
            onClick={() => navigate("/clients")}
          >
            Select Client
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProjectPage;
