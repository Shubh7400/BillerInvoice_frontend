import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../states/redux/store";
import { ClientType } from "../../types/types";
import { Button, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ProjectTable from "../Home_Components/ProjectSection/ProjectTable";
import error from "../assets/select_client.png"

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
        <div className="  w-[80vw]  flex flex-col justify-end items-start ">
          <div className="text-black  w-[80vw] ">
            <div className=" text-black   overflow-hidden overflow-ellipsis">
            
              <div className="flex items-center justify-between w-100%">
                  <h2 className=" text-md sm:text-xl my-2 font-semibold overflow-scroll overflow-x-hidden overflow-y-hidden sm:overflow-hidden ">
                    {clientObj.clientName}
                  </h2>
                  {/* <p >
                    <b>Conversion rate:</b>
                    {" " + clientObj.conversionRate}
                  </p> */}
              </div>
              <div className="flex items-center justify-between w-100%">
                <div>
                    <p className="mt-2">
                      <b>Gstin : </b>
                      {clientObj.gistin}
                    </p>
                    <p className="mb-2">
                      <b>Pancard: </b>
                      {clientObj.pancardNo}
                    </p>
                </div>
                <div className="text-black opacity-70 flex flex-col justify-start gap-1 ">
                  {/* <p>{clientObj.address ? clientObj.address.street : null}</p>
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
                  </p> */}
                  <p>
                    <b>Contact: </b>
                    {clientObj.contactNo}
                  </p>
                  <p className=" overflow-scroll overflow-x-hidden overflow-y-hidden sm:overflow-hidden">
                    <b>Email: </b>
                    {clientObj.email}
                  </p>
                  
                </div>
              </div>
            </div>
          </div>
          <ProjectTable />
        </div>
      ) : (
        <div className="flex justify-center items-center h-[80vh] m-auto">
          <div className="text-center">
          <img src={error} alt="" className="w-[300px] m-auto"/>
          <h4 className="text-[20px] mb-3">Please select a client to see projects : </h4>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#d9a990",
              borderRadius: "20px",
              ":hover": {
                backgroundColor:'#4a6180',
              },
            }}
            onClick={() => navigate("/clients")}
          >
            Select Client
          </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectPage;
