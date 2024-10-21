import {
  SliceCaseReducers,
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";
import { getAdminByAdminId } from "../../../api/admin_requests";
import { AdminType } from "../../../types/types";

export const getAdminByIdAction = createAsyncThunk(
  "admin/getAdminByIdStatus",
  async (adminId: string, ThunkApi) => {
    try {
      const res = await getAdminByAdminId(adminId);
      return res;
    } catch (error) {
      return ThunkApi.rejectWithValue(`Error in gettingAdminById ${error}`);
    }
  }
);

interface AdminInitialStateType {
  loading: "idle" | "pending" | "succeeded" | "failed";
  data: AdminType;
  error: string | null;
}

const adminInitialState: AdminInitialStateType = {
  loading: "idle",
  data: {} as AdminType,
  error: null,
};

const createAdminSlice = createSlice<
  AdminInitialStateType,
  SliceCaseReducers<AdminInitialStateType>
>({
  name: "admin",
  initialState: adminInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAdminByIdAction.pending, (state, action) => {
        state.loading = "pending";
      })
      .addCase(getAdminByIdAction.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.data = action.payload;
      })
      .addCase(getAdminByIdAction.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload as string;
      });
  },
});

export default createAdminSlice.reducer;
