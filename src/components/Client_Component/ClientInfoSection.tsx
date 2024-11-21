import React from 'react'
import { ClientType } from '../../types/types';
import { RootState } from '../../states/redux/store';
import { useSelector } from 'react-redux';

function ClientInfoSection() {
    const selectedClientState = useSelector(
        (state: RootState) => state.selectedClientState
    );
    const clientObj: ClientType = selectedClientState.data;
    // Assuming the email is an array and we want to show the first one
    const firstEmail = clientObj?.email?.[0];
    const fullAddress = `${clientObj.address.street}, ${clientObj.address.city}, ${clientObj.address.state}, ${clientObj.address.country} `;
    
    
    return (
        <div>
            {clientObj && selectedClientState.loading !== "idle" ? (
                <div className="  w-[80vw]  flex flex-col justify-end items-start ">
                    <div className="text-black  w-[80vw] ">
                        <div className=" text-black   overflow-hidden overflow-ellipsis">

                            <div className="flex items-center justify-between w-100%">
                                <h2 className=" text-md sm:text-xl mt-3 font-semibold overflow-scroll overflow-x-hidden overflow-y-hidden sm:overflow-hidden ">
                                    {clientObj.clientName}
                                </h2>
                            </div>
                            <div className="flex items-center justify-between w-100%">
                                <div>
                                    <p className="mt-2">
                                        <b>Gstin : </b>
                                        {clientObj.gistin}
                                    </p>
                                    <p className="mb-2">
                                        <b>address: </b>
                                        {fullAddress}
                                    </p>
                                </div>
                                <div className="text-black opacity-70 flex flex-col justify-start gap-1 ">
                                    <p className=" overflow-scroll overflow-x-hidden overflow-y-hidden sm:overflow-hidden">
                                        <b>Email: </b>
                                        {firstEmail}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    )
}

export default ClientInfoSection