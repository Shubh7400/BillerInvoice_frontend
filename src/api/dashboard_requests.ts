import axios from "axios";
import config from "../config/config";

export async function getDashBoardDataAPI() {
  let token = localStorage.getItem("billAppAuthToken");
  if (token) {
    token = token.substring(1, token.length - 1);
  }
  try {
    const response = await axios(`${config.apiUrlDashboard}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response,"error");
    return response.data;
  } catch (error: any) {
    throw new Error(`${error.response.data.message}`);
  }
}
