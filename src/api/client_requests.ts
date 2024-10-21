import axios from "axios";
import config from "../config/config";
import { ClientType } from "../types/types";

export async function getAllClientsByAdminId(adminId: string) {
  let token = localStorage.getItem("billAppAuthToken");
  if (token) {
    token = token.substring(1, token.length - 1);
  }

  try {
    const response = await axios(`${config.apiUrlClient}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(`${error.response.data.message}`);
  }
}
export async function getClientByClientId(clientId: string) {
  let token = localStorage.getItem("billAppAuthToken");
  if (token) {
    token = token.substring(1, token.length - 1);
  }
  try {
    const response = await axios(`${config.apiUrlClient}/${clientId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(`${error.response.data.message}`);
  }
}
export async function addClient(clientData: ClientType) {
  let token = localStorage.getItem("billAppAuthToken");
  if (token) {
    token = token.substring(1, token.length - 1);
  }

  try {
    const response = await axios.post(`${config.apiUrlClient}`, clientData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(`${error.response.data.message}`);
  }
}
export async function editClient(clientId: string, clientData: ClientType) {
  let token = localStorage.getItem("billAppAuthToken");
  if (token) {
    token = token.substring(1, token.length - 1);
  }

  try {
    const response = await axios.patch(
      `${config.apiUrlClient}/${clientId}`,
      clientData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(`${error.response.data.message}`);
  }
}
export async function deleteClientByClientId(clientId: string) {
  let token = localStorage.getItem("billAppAuthToken");
  if (token) {
    token = token.substring(1, token.length - 1);
  }
  try {
    const response = await axios.delete(`${config.apiUrlClient}/${clientId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(`${error.response.data.message}`);
  }
}
