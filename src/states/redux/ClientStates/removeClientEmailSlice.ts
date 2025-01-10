import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { deleteEmailByClientId } from "../../../api/client_requests";

export const deleteEmailAction = createAsyncThunk(
  "deleteEmail/deleteEmailByClientIdStatus",
  async ({ clientId, email }: { clientId: string; email: string }, thunkApi) => {
    try {
      const res = await deleteEmailByClientId(clientId, email);
      return res;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

interface deleteEmailStateType {
  emailDeleteLoading: "idle" | "pending" | "succeeded" | "failed";
  emailDeleteError: string | null;
}

const initialState: deleteEmailStateType = {
  emailDeleteLoading: "idle",
  emailDeleteError: null,
};

const deleteEmailSlice = createSlice({
  name: "deleteEmail",
  initialState,
  reducers: {
    resetDeleteEmailState: (state) => {
      return { ...state, emailDeleteLoading: "idle", emailDeleteError: null };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteEmailAction.pending, (state) => {
        state.emailDeleteLoading = "pending";
      })
      .addCase(deleteEmailAction.fulfilled, (state) => {
        state.emailDeleteLoading = "succeeded";
      })
      .addCase(deleteEmailAction.rejected, (state, action) => {
        state.emailDeleteLoading = "failed";
        state.emailDeleteError = action.payload as string;
      });
  },
});

export const { resetDeleteEmailState } = deleteEmailSlice.actions;
export default deleteEmailSlice.reducer;
