import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getClientByClientId } from "../../../api/client_requests";
import { ClientType } from "../../../types/types";

export const getClientByIdAction = createAsyncThunk(
  "selectedClient/getClientByIdStatus",
  async (clientId: string, thunkApi) => {
    try {
      const res = await getClientByClientId(clientId);
      return res;
    } catch (error) {
      return thunkApi.rejectWithValue(
        `Error in gettingOneClientsById ${error}`
      );
    }
  }
);

interface ClientStateType {
  loading: "idle" | "pending" | "succeeded" | "failed";
  data: ClientType;
  error: string | null;
}

const clientInitialState: ClientStateType = {
  loading: "idle",
  data: {} as ClientType,
  error: null,
};

const selectedClientSlice = createSlice({
  name: "singleClient",
  initialState: clientInitialState,
  reducers: {
    makeStateNeutralOfSelectedClient: (state) => {
      return { ...state, loading: "idle", data: {} as ClientType, error: null };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getClientByIdAction.pending, (state, action) => {
        state.loading = "pending";
      })
      .addCase(getClientByIdAction.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.data = action.payload;
      })
      .addCase(getClientByIdAction.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload as string;
      });
  },
});
export const { makeStateNeutralOfSelectedClient } = selectedClientSlice.actions;
export default selectedClientSlice.reducer;
