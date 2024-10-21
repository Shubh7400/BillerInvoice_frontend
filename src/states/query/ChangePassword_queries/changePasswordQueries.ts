import { useMutation } from "@tanstack/react-query";
import {
  generateOtp,
  resetPassword,
  verifyOtp,
} from "../../../api/login_request/changePassword_requests";
import { LoginDataType } from "../../../types/types";

export const useVerifyEmailToGenerateOtp = () => {
  const GenerateOtpMutationHandler = useMutation((email: string) =>
    generateOtp(email)
  );
  return GenerateOtpMutationHandler;
};
export const useVerifyOtp = () => {
  const VerifyOtpMutationHandler = useMutation(
    (emailOtpData: { email: string; otp: string }) => verifyOtp(emailOtpData)
  );
  return VerifyOtpMutationHandler;
};
export const useResetPassword = () => {
  const ResetPasswordMutationHandler = useMutation(
    (newLoginData: LoginDataType) => resetPassword(newLoginData)
  );
  return ResetPasswordMutationHandler;
};
