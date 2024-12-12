import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchInvoiceProjects } from '../../../api/invoice_requests'; 
import { getProjectById } from '../../../api/project_requests'; 

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
  workingPeriod:string;
  workingPeriodType: string;
  conversionRate: number;
  clientId: string;
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
  },
});
export const { clearInvoices } = invoiceListSlice.actions;
export default invoiceListSlice.reducer;



