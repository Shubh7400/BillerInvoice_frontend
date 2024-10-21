import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../states/redux/store";
import { AuthContext } from "../../../states/context/AuthContext/AuthContext";
import { getAdminByIdAction } from "../../../states/redux/AdminStates/adminSlice";
import { getAllClientsByAdminIdAction } from "../../../states/redux/ClientStates/allClientSlice";
import ConfirmationDialog from "./Compo-ClientDialogeBox";
import { ClientType } from "../../../types/types";
import CompoLoading from "./Compo-Loding";
import CompoAddClient from "./Compo_AddClient";
import cubexoLogo from "../../../utils/images/cubexoLogo.webp";
import gamaedgeLogo from "../../../utils/images/gammaedgeLogo.png";

const SelectClient = () => {
  const { isAuth, adminId } = useContext(AuthContext);
  const [companyLogo, setCompanyLogo] = useState<string>();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, data, error } = useSelector(
    (state: RootState) => state.adminState
  );
  const clients = useSelector((state: RootState) => state.allClientsState);
  const selectedClient = useSelector(
    (state: RootState) => state.selectedClientState
  );
  const addedNewClientState = useSelector(
    (state: RootState) => state.addClientState
  );
  // -------------------------------------------------------
  // "https://gammaedge.io/images/logo1.png";
  // "https://www.cubexo.io/images/Logo.webp";
  useEffect(() => {
    if (
      loading === "succeeded" &&
      adminId &&
      adminId === "6516a4ba98fd8b5ed365d5f4"
    ) {
      setCompanyLogo(gamaedgeLogo);
    } else if (loading === "succeeded" && adminId) {
      setCompanyLogo(cubexoLogo);
    }
  }, [loading, data, adminId]);

  useEffect(() => {
    if (isAuth && adminId) {
      dispatch(getAdminByIdAction(adminId));
    }
  }, [isAuth, adminId, dispatch]);

  useEffect(() => {
    if (adminId && loading === "succeeded") {
      let timer = setTimeout(() => {
        dispatch(getAllClientsByAdminIdAction(adminId));
        return () => {
          clearTimeout(timer);
        };
      }, 1000);
    }
  }, [dispatch, adminId, loading]);

  useEffect(() => {
    if (addedNewClientState.loading === "succeeded" && adminId) {
      dispatch(getAllClientsByAdminIdAction(adminId));
    }
  }, [
    addedNewClientState.loading,
    addedNewClientState,
    addedNewClientState.data,
    dispatch,
    adminId,
  ]);
  useEffect(() => {
    if ((adminId && error) || selectedClient.error) {
      window.location.reload();
    }
  }, [error, adminId, selectedClient.error]);

  if (
    loading === "pending" ||
    // clients.loading === "pending" ||
    selectedClient.loading === "pending" ||
    addedNewClientState.loading === "pending"
  ) {
    return <CompoLoading forAllClients={false} forSelectClient={true} />;
  } else if (error || selectedClient.error) {
    return (
      <h3>
        Error in getting admin detail, refresh or login again.
        <br />
        {"adminId--->" + adminId}
        <br />
        {"Admin network error-" + error}
        <br />
        {"All Client get req network error-" + clients.error}
        <br />
        {"Selected client get reqById nework error-" +
          selectedClient.error}{" "}
      </h3>
    );
  }

  const clientsArr: ClientType[] = clients.data;
  const clientObj: ClientType = selectedClient.data;

  return (
    <section>
      <div className="flex justify-around sm:justify-end items-center pr-4 pt-6 sm:pr-8 sticky top-2 bg-slate-200 dark:bg-slate-700 z-10 ">
        <div>
          <ConfirmationDialog />
        </div>
        <div>
          <CompoAddClient forEditClient={false} clientToEdit={null} />
        </div>
      </div>
      <div className="flex flex-row text-xs sm:text-sm  sm:flex-row  w-auto    m-2 rounded-lg sm:mx-8 bg-white dark:bg-slate-800 bg-opacity-50 shadow-lg dark:shadow-slate-950 sm:p-2 ">
        <div className="w-1/2 overflow-hidden ">
          {data ? (
            <div className="text-black dark:text-colorLightFont p-4">
              <div className="bg-slate-100 flex justify-start items-center  h-8 sm:h-16 w-30 sm:w-48  p-3 mb-2 rounded-lg">
                <img
                  src={companyLogo}
                  alt="CompanyLogo"
                  className="h-auto w-auto "
                />
              </div>
              <div className=" text-black dark:text-colorLightFont ">
                <h3 className=" text-sm sm:text-sm mt-6 font-semibold ">
                  {data.companyName}
                </h3>
                <p className="my-2">
                  <b>Gstin: </b>
                  {data.gistin}
                </p>
                <div className="text-black dark:text-colorLightFont opacity-70 flex flex-col justify-start gap-1">
                  <p>{data.address ? data.address.street : null}</p>
                  <p>
                    {data.address
                      ? data.address.city + data.address.state
                      : null}
                  </p>
                  <p>
                    {data.address
                      ? data.address.postalCode + " -" + data.address.country
                      : null}
                  </p>
                  <b>
                    <b>Contact: </b>
                    {data.contactNo}
                  </b>
                  <p className=" overflow-scroll overflow-x-hidden overflow-y-hidden sm:overflow-hidden">
                    <b>Email: </b>
                    {data.email}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            "Loding..."
          )}
        </div>
        <div className=" border-l w-1/2  border-l-slate-400  flex flex-col justify-end items-start ">
          {clientObj && selectedClient.loading !== "idle" ? (
            <div className="text-black ml-0.5 sm:ml-4 dark:text-colorLightFont p-2 sm:p-4 w-full ">
              <div className=" text-black dark:text-colorLightFont  overflow-hidden overflow-ellipsis">
                <h2 className=" text-sm sm:text-lg my-2 font-semibold overflow-scroll overflow-x-hidden overflow-y-hidden sm:overflow-hidden ">
                  {clientObj.clientName}
                </h2>
                <p className="mt-2">
                  <b>Gstin: </b>
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
                      ? clientObj.address.city + clientObj.address.state
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
          ) : (
            <h4>{null}</h4>
          )}
        </div>
      </div>
    </section>
  );
};

export default SelectClient;
