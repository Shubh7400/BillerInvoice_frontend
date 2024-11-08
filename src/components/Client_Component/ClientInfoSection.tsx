import React from 'react'
import { ClientType } from '../../types/types';
import { RootState } from '../../states/redux/store';
import { useSelector } from 'react-redux';

function ClientInfoSection() {
    const selectedClientState = useSelector(
        (state: RootState) => state.selectedClientState
    );
    const clientObj: ClientType = selectedClientState.data;
    return (
        <div>
            {clientObj && selectedClientState.loading !== "idle" ? (
                <div className="  w-[80vw]  flex flex-col justify-end items-start ">
                    <div className="text-black  w-[80vw] ">
                        <div className=" text-black   overflow-hidden overflow-ellipsis">

                            <div className="flex items-center justify-between w-100%">
                                <h2 className=" text-md sm:text-xl my-2 font-semibold overflow-scroll overflow-x-hidden overflow-y-hidden sm:overflow-hidden ">
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
                                        <b>Pancard: </b>
                                        {clientObj.pancardNo}
                                    </p>
                                </div>
                                <div className="text-black opacity-70 flex flex-col justify-start gap-1 ">
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
                </div>
            ) : null}
        </div>
    )
}

export default ClientInfoSection