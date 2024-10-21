import axios from "axios";
import config from "../config/config";
import { InvoiceType } from "../types/types";

export async function addNewInvoice(invoiceObject: InvoiceType) {
  let token = localStorage.getItem("billAppAuthToken");
  if (token) {
    token = token.substring(1, token.length - 1);
  }

  try {
    const res = await axios.post(`${config.apiUrlInvoice}`, invoiceObject, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Res after add invoice-", res.data);
    return res.data;
  } catch (error) {
    console.log("Error after add invoice-", error);
    return new Error(`Network error in adding invoice to server ${error}`);
  }
}

export async function getAllInvoice() {
  let token = localStorage.getItem("billAppAuthToken");
  if (token) {
    token = token.substring(1, token.length - 1);
  }

  try {
    const res = await axios(`${config.apiUrlInvoice}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    return new Error(
      `Network error in getting all invoice from server ${error}`
    );
  }
}
