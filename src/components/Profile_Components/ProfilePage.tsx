import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../states/redux/store";
const ProfilePage = () => {
  const clients = useSelector((state: RootState) => state.allClientsState);
  const { loading, data, error } = useSelector(
    (state: RootState) => state.adminState
  );
  const [companyLogo, setCompanyLogo] = useState<string>();
  
  return (
    <div>
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
                  <b>Gstin : </b>
                  {data.gistin}
                </p>
                <div className="text-black dark:text-colorLightFont opacity-70 flex flex-col justify-start gap-1">
                  <p>{data.address ? data.address.street : null}</p>
                  <p>
                    {data.address
                      ? data.address.city + ' ' +data.address.state
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
