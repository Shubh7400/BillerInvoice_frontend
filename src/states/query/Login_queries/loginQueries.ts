import {
  getAdminById,
  getLogin,
} from "../../../api/login_request/login_request";
import { LoginDataType } from "../../../types/types";
import { queryClient } from "./../../../index";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";

export function useLoginMutation() {
  const LoginMutationHandler = useMutation(
    (loginData: LoginDataType) => getLogin(loginData),
    {
      onSuccess: (data) => {
        console.log("data fater login res in useMutaion", data);
        localStorage.setItem("billAppAuthToken", JSON.stringify(data.token));
        queryClient.setQueryData(["billAppAuthToken"], data.token);
      },
      onError: (error) => {
        console.log("Error in login:from query", error);
      },
    }
  );
  return LoginMutationHandler;
}
export function useGetAdminById(adminId: string) {
  const result = useQuery(["admin", adminId], () => getAdminById(adminId));
  return result;
}
