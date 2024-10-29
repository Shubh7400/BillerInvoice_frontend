import axios from "axios";
import config from "../config/config";

export async function getAdminByAdminId(adminId: string) {
  try {
    const response = await axios(`${config.apiUrlAuth}/${adminId}`);
    return response.data;
  } catch (error) {
    throw new Error("Error in getting admin");
  }
}
