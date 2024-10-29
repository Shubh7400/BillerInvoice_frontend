import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getDashBoardDataAPI } from "../../../api/dashboard_requests";

export const getDashBoardData = createAsyncThunk(
  "dashboard/dashboardData",
  async (_, thunkApi) => {
    try {
      const res = await getDashBoardDataAPI();
      return res;
    } catch (error) {
      return thunkApi.rejectWithValue(`Error in adding new client ${error}`);
    }
  }
);

interface dashBoardType {
  loading: "idle" | "pending" | "succeeded" | "failed";
  data: {
    totalClients: number;
    totalProjects: number;
    totalInvoices: number;
  };
  error: string | null;
}

const initialState: dashBoardType = {
  loading: "idle",
  data: {
    totalClients: 0,
    totalProjects: 0,
    totalInvoices: 0,
  },
  error: null,
};


const dashBoardSlice = createSlice({
  name: "dashBoardSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getDashBoardData.pending, (state, action) => {
        state.loading = "pending";
      })
      .addCase(getDashBoardData.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.data = action.payload;
      })
      .addCase(getDashBoardData.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload as string;
      });
  },
});

export default dashBoardSlice.reducer;
