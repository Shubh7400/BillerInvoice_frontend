import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getInvoiceCounts } from "../../../api/invoice_requests";

interface MonthlyCount {
  count: number;
  month: number;
}

interface InvoiceCountState {
  year: string;
  data: MonthlyCount[];
  loading: boolean;
  error: string | null;
}

const initialState: InvoiceCountState = {
  year: "",
  data: [],
  loading: false,
  error: null,
};

export const fetchInvoiceCounts = createAsyncThunk(
  "invoiceCounts/fetchInvoiceCounts",
  async ({ year, user }: { year: string; user: string }, { rejectWithValue }) => {
    try {
      return await getInvoiceCounts(year, user); 
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch invoice counts");
    }
  }
);

const invoiceCountSlice = createSlice({
  name: "invoiceCounts",
  initialState,
  reducers: {},
  
  extraReducers: (builder) => {
    builder
      .addCase(fetchInvoiceCounts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchInvoiceCounts.fulfilled,
        (state, action: PayloadAction<{ year: string; data: MonthlyCount[] }>) => {
          state.loading = false;
          state.year = action.payload.year;
          state.data = action.payload.data;
        }
      )
      .addCase(fetchInvoiceCounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || "Failed to fetch invoice counts";
      });
  },
});

export default invoiceCountSlice.reducer;
