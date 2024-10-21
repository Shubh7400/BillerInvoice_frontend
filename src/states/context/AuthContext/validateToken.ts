import jwt_decode from "jwt-decode";
import { DecodedTokenDataType } from "../../../types/types";

export const validateToken = () => {
  const token = localStorage.getItem("billAppAuthToken");
  
  try {
    if (token) {
      const decodedData: DecodedTokenDataType | null = jwt_decode(token);
      const currentTime = Date.now() / 1000; // Convert to seconds
      if (decodedData && decodedData.exp && decodedData.exp > currentTime) {
        return {
          validation: true,
          message: "Token verified",
          adminId: decodedData.id,
        };
      } else {
        return {
          validation: false,
          message: "Token expired",
          adminId: null,
        };
      }
    } else {
      return { validation: false, message: "Token unavailable", adminId: null };
    }
  } catch (error) {
    return { validation: false, message: "Token invalid", adminId: null };
  }
};
