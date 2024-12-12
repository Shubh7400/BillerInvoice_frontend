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

export async function getInvoiceCounts(year: string, user: string) {
  let token = localStorage.getItem("billAppAuthToken");
  if (token) {
    token = token.substring(1, token.length - 1);
  }

  try {
    const response = await axios.get(`${config.apiUrlInvoice}/monthly-count`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { year, user },
    });

    return response.data;
  } catch (error: any) {
    throw new Error(`Failed to fetch invoice counts: ${error.message || error}`);
  }
};

export async function fetchInvoiceProjects(year: string, month: string) {
  let token = localStorage.getItem('billAppAuthToken');
  if (token) {
    token = token.substring(1, token.length - 1);
  }

  try {
    const res = await axios.get(`${config.apiUrlInvoice}/projects-by-month`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { year, month },
    });
    return res.data.data; // Return the projects
  } catch (error) {
    console.error('Error fetching invoice projects:', error);
    throw new Error('Error fetching invoice projects');
  }
}

