import { Skeleton } from "@mui/material";
import React from "react";

const CompoLoadingProjects = () => {
  return (
    <div className=" px-4 sm:px-16 min-w-full flex flex-col items-center  ">
      <Skeleton
        className=" bg-gray-300 bg-opacity-50 w-full sm:min-w-full"
        variant="text"
        width={700}
        height={100}
      />
      <Skeleton
        className=" bg-gray-300 bg-opacity-50 w-full sm:min-w-full"
        variant="text"
        width={700}
        height={70}
      />
      <Skeleton
        className=" bg-gray-300 bg-opacity-50 w-full sm:min-w-full"
        variant="text"
        width={700}
        height={70}
      />
    </div>
  );
};

export default CompoLoadingProjects;
