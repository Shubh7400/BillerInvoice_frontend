import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../states/redux/store";
import { AuthContext } from "../../states/context/AuthContext/AuthContext";
import { getAdminByIdAction } from "../../states/redux/AdminStates/adminSlice";
import { getAllClientsByAdminIdAction } from "../../states/redux/ClientStates/allClientSlice";
import cubexoLogo from "../assets/cubexo_logo.png";
import gamaedgeLogo from "../../utils/images/gammaedgeLogo.png";
import { useNavigate } from "react-router-dom";
import { Button, TextField, useTheme } from "@mui/material";
import { FaRegUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { Grid, Typography, Select, MenuItem, FormControl, styled, SelectChangeEvent } from '@mui/material';

const ProfilePage = () => {

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



  return (
    <div>

      <div className='flex justify-between items-center  pb-[10]'>
        <div className='flex items-center gap-2'>
          <button
            onClick={() => navigate(-1)}
            className="text-white text-[20px] bg-[#E4A98A] w-[35px] h-[35px] flex justify-center items-center rounded-[50px]"
          >
            <IoIosArrowBack />
          </button>
          <Typography variant="h5" component="h2" className='text-center'>
            PROFILE
          </Typography>
        </div>


      </div>
      {data ? (
        <div className="text-black  p-4 relative border-2 border-[#c1c1c1] rounded-[20px] mt-[15px]">
          <div className="bg-slate-100 flex justify-start items-center rounded-[15px]  h-auto  w-[200px]  p-2  b ">
            <img
              src={companyLogo}
              alt="CompanyLogo"
              className="h-auto w-[200px] "
            />
          </div>
          <div className=" text-black  pt-5 ">
            <h3 className=" text-2xl font-semibold ">
              {data.companyName}
            </h3>
            <p className="my-2">
              <b>Gstin : </b>
              {data.gistin}
            </p>
            <div className="text-black  opacity-70 flex flex-col justify-start gap-1">
              <p>{data.address ? data.address.street : null}</p>
              <p>
                {data.address
                  ? data.address.city + ' ' + data.address.state
                  : null}
              </p>
              <p>
                {data.address
                  ? data.address.postalCode + " - " + data.address.country
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
  );
};

export default ProfilePage;
