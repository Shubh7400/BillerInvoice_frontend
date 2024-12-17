import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchInvoiceProjects } from '../../../api/invoice_requests'; 
import { getProjectById } from '../../../api/project_requests'; 
import { fetchInvoicesByDate } from '../../../api/invoice_requests';

interface Invoice {
  _id: string;
  invoiceNo: number;
  billDate: string;
  dueDate: string;
  projectsId: string[];
  amountWithoutTax: number;
  amountAfterTax: number;
  projectName: string;
  rate: number;
  adminId: string;
  workingPeriod:number;
  workingPeriodType: "hours" | "months" | "fixed";
  conversionRate: number;
  clientId: string;
  currencyType: "rupees" | "dollars" | "pounds"; 
  paymentStatus: boolean;
}

interface InvoiceListState {
  invoices: Invoice[];
  loading: boolean;
  error: string | null;
}

const initialState: InvoiceListState = {
  invoices: [],
  loading: false,
  error: null,
};

// Fetch invoices for a given month and year
export const fetchInvoicesThunk = createAsyncThunk(
  'invoice/fetchInvoices',
  async ({ year, month }: { year: string; month: string }, { rejectWithValue }) => {
    try {
      const invoices = await fetchInvoiceProjects(year, month);
      return invoices;
    } catch (error) {
      return rejectWithValue('Failed to fetch invoices');
    }
  }
);

// Thunk to fetch invoices by date range
export const fetchInvoicesByDateRange = createAsyncThunk(
  'invoice/fetchInvoicesByDateRange',
  async ({ fromYear, fromMonth, toYear, toMonth }: { fromYear: number, fromMonth: number, toYear: number, toMonth: number }, { rejectWithValue }) => {
    const response = await fetchInvoicesByDate({ fromYear, fromMonth, toYear, toMonth });
    return response.data; 
  }
);

const invoiceListSlice = createSlice({
  name: 'invoice',
  initialState,
  reducers: {
    clearInvoices: (state) => {
      state.invoices = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInvoicesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvoicesThunk.fulfilled, (state, action: PayloadAction<Invoice[]>) => {
        state.loading = false;
        state.invoices = action.payload;
      })
      .addCase(fetchInvoicesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchInvoicesByDateRange.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchInvoicesByDateRange.fulfilled, (state, action) => {
        state.loading = false;
        state.invoices = action.payload||[];
      })
      .addCase(fetchInvoicesByDateRange.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});
export const { clearInvoices } = invoiceListSlice.actions;
export default invoiceListSlice.reducer;



