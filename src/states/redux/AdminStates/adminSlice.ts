import {
  SliceCaseReducers,
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";
import { getAdminByAdminId, updateAdminByAdminId } from "../../../api/admin_requests";
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
export const updateAdminByIdAction = createAsyncThunk(
  "admin/updateAdminByIdStatus",
  async (
    { adminId, updateData }: { adminId: string; updateData: Partial<AdminType> },
    ThunkApi
  ) => {
    try {
      const res = await updateAdminByAdminId(adminId, updateData);
      return { adminId, updateData: res }; // Returning updated data from the API
    } catch (error) {
      return ThunkApi.rejectWithValue(`Error in updatingAdminById ${error}`);
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
      })

      // Update Admin by ID
      .addCase(updateAdminByIdAction.pending, (state) => {
        state.loading = "pending";
      })
      // Handle updateAdminByIdAction.fulfilled
      .addCase(updateAdminByIdAction.fulfilled, (state, action) => {
        state.loading = "succeeded";
        const { adminId, updateData } = action.payload;

        // Check if _id exists and matches adminId
        if (state.data?._id && state.data._id === adminId) {
          state.data = { ...state.data, ...updateData }; // Merge updated data
        }
      })
      .addCase(updateAdminByIdAction.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload as string;
      });
  },
});

export default createAdminSlice.reducer;
