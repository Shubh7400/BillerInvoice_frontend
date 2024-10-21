import axios from "axios";
import config from "../../config/config";
import { LoginDataType } from "../../types/types";

export async function generateOtp(emailData: string) {
  try {
    const response = await axios.post(`${config.apiUrlAuth}/generate`, {
      email: emailData,
    });
    console.log("response after generate otp", response);
    return response.data;
  } catch (error) {
    throw new Error(`Error in admin generate otp ${error}`);
  }
}
export async function verifyOtp(emailOtpData: { email: string; otp: string }) {
  try {
    const response = await axios.post(
      `${config.apiUrlAuth}/verify`,
      emailOtpData
    );
    return response.data;
  } catch (error) {
    throw new Error(`Error in verifying otp ${error}`);
  }
}
export async function resetPassword(newLoginData: LoginDataType) {
  try {
    const response = await axios.patch(
      `${config.apiUrlAuth}/resetPassword`,
      newLoginData
    );
    return response.data;
  } catch (error) {
    throw new Error(`Error in creating new password ${error}`);
  }
}
