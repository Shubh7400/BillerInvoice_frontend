import { Skeleton } from "@mui/material";
import React from "react";

const CompoLoading = (props: {
  forAllClients: boolean;
  forSelectClient: boolean;
}) => {
  const { forAllClients, forSelectClient } = props;
  return (
    <>
      {forAllClients ? (
        <div className="flex flex-col justify-center p-8 gap-3">
          <Skeleton
            className=" bg-gray-300 bg-opacity-50 min-w-full"
            variant="text"
            width={100}
            height={50}
          ></Skeleton>
          <Skeleton
            className=" bg-gray-300 bg-opacity-50 min-w-full"
            variant="text"
            width={100}
            height={50}
          ></Skeleton>{" "}
          <Skeleton
            className=" bg-gray-300 bg-opacity-50 min-w-full"
            variant="text"
            width={100}
            height={50}
          ></Skeleton>
          <Skeleton
            className=" bg-gray-300 bg-opacity-50 min-w-full"
            variant="text"
            width={100}
            height={30}
          ></Skeleton>
        </div>
      ) : (
        <div className="flex justify-between items-center p-8">
          <Skeleton
            className=" bg-gray-300 bg-opacity-50 min-w-full"
            variant="rectangular"
            width={700}
            height={300}
          ></Skeleton>
        </div>
      )}
    </>
  );
};

export default CompoLoading;
