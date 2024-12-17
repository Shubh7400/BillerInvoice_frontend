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
   const formattedMonth = month.padStart(2, '0');
  try {
    const res = await axios.get(`${config.apiUrlInvoice}/projects-by-month`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { year, month: formattedMonth }, 

    });
    return res.data.data; // Return the projects
  } catch (error) {
    console.error('Error fetching invoice projects:', error);
    throw new Error('Error fetching invoice projects');
  }

}
// Function to fetch invoices by date range
export async function fetchInvoicesByDate({ fromYear, fromMonth, toYear, toMonth }: { fromYear: number; fromMonth: number; toYear: number; toMonth: number }) {
  let token = localStorage.getItem('billAppAuthToken');
  if (token) {
    token = token.substring(1, token.length - 1);
  }
  try {
    const response = await axios.get(`${config.apiUrlInvoice}/invoices-by-date-range`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        fromYear,
        fromMonth,
        toYear,
        toMonth
      }
    });
    return response;  // Return the API response
  } catch (error) {
    console.error('Error fetching invoices:', error);
    throw error;
  }
}

