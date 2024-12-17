import React, { useContext, useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Grid,
  Typography,
  Select,
  MenuItem,
  FormControl,
  styled,
  SelectChangeEvent,
} from "@mui/material";
import { AppDispatch, RootState } from "../../states/redux/store";
import { AuthContext } from "../../states/context/AuthContext/AuthContext";
import { getAdminByIdAction } from "../../states/redux/AdminStates/adminSlice";
import { getAllClientsByAdminIdAction } from "../../states/redux/ClientStates/allClientSlice";
import ClientSelectionTable from "./ClientSelectionTable";
import CompoLoading from "./Compo-Loding";
import cubexoLogo from "../../utils/images/cubexoLogo.webp";
import gamaedgeLogo from "../../utils/images/gammaedgeLogo.png";
import { useNavigate } from "react-router-dom";
import { Button, TextField, useTheme } from "@mui/material";
import { FaRegUser } from "react-icons/fa";
import Styles from "./client.module.css";
import { Link } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
const ClientPageHeader = () => {
  const { isAuth, adminId } = useContext(AuthContext);
  const navigate = useNavigate();
  const materialTheme = useTheme();
  const [companyLogo, setCompanyLogo] = useState<string>();
  const [searchClientName, setSearchClientName] = React.useState<string>("");
  const dispatch = useDispatch<AppDispatch>();
  const { loading, data, error } = useSelector(
    (state: RootState) => state.adminState
  );

  const {
    loading: clientsLoading,
    data: clients,
    error: clientsError,
  } = useSelector((state: RootState) => state.allClientsState);

  const selectedClient = useSelector(
    (state: RootState) => state.selectedClientState
  );
  const addedNewClientState = useSelector(
    (state: RootState) => state.addClientState
  );


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
      }, 0);
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
        {"All Client get req network error-" + clientsError}
        <br />
        {"Selected client get reqById nework error-" +
          selectedClient.error}{" "}
      </h3>
    );
  }

  return (
    <section>
      <div className="flex justify-between mb-4 items-center">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="text-white text-[20px] bg-[#E4A98A] w-[35px] h-[35px] flex justify-center items-center rounded-[50px]"
          >
            <IoIosArrowBack />
          </button>
          <Typography variant="h5" component="h2" className="text-center">
            CLIENT LIST
          </Typography>
        </div>

        <div className="flex gap-4 items-center">
          <div className={Styles.search_input}>
            <TextField
              label="Search by client name"
              type="text"
              variant="outlined"
              value={searchClientName}
              onChange={(e) => setSearchClientName(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "50px",
                },
              }}
            />
          </div>

          <Button
            variant="contained"
            sx={{
              backgroundColor: "#d9a990",
              borderRadius: "20px",
              ":hover": {
                backgroundColor: "#4a6180",
              },
            }}
            onClick={() => navigate("/add-client")}
          >
            Add Client
          </Button>
        </div>
      </div>
      <div className="  top-2  z-10 ">
        <div>
          <ClientSelectionTable
            clientsLoading={clientsLoading}
            clients={clients}
            searchClientName={searchClientName}
          />
        </div>
      </div>
    </section>
  );
};

export default ClientPageHeader;
