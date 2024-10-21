import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ClientType } from "../../../types/types";
import { deleteClientByClientId } from "../../../api/client_requests";

export const deleteClientAction = createAsyncThunk(
  "deleteClient/deleteClientByIdStatus",
  async (clientId: string, thunkApi) => {
    try {
      const res = await deleteClientByClientId(clientId);
      return res;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

interface deleteClientStateType {
  deleteLoading: "idle" | "pending" | "succeeded" | "failed";
  deleteData: ClientType;
  deleteError: string | null;
}

const initialState: deleteClientStateType = {
  deleteLoading: "idle",
  deleteData: {} as ClientType,
  deleteError: null,
};

const deleteClientSlice = createSlice({
  name: "deleteClient",
  initialState,
  reducers: {
    makeStateLoadingNeutralInDeleteClient: (state) => {
      return { ...state, deleteLoading: "idle" };
    },
    addDetelingClientIdInState: (state, action: PayloadAction<string>) => {
      return { ...state, deletingClientId: action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteClientAction.pending, (state, action) => {
        state.deleteLoading = "pending";
      })
      .addCase(deleteClientAction.fulfilled, (state, action) => {
        state.deleteLoading = "succeeded";
        state.deleteData = action.payload;
      })
      .addCase(deleteClientAction.rejected, (state, action) => {
        state.deleteLoading = "failed";
        state.deleteData = {} as ClientType;
        state.deleteError = action.payload as string;
      });
  },
});
export const {
  makeStateLoadingNeutralInDeleteClient,
  addDetelingClientIdInState,
} = deleteClientSlice.actions;
export default deleteClientSlice.reducer;
