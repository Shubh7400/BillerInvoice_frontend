import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { editClient } from "../../../api/client_requests";
import { ClientType } from "../../../types/types";

interface EditClientActionType {
  clientId: string;
  clientData: ClientType;
}

export const editClientAction = createAsyncThunk(
  "editClient/editClientByIdStatus",
  async ({ clientId, clientData }: EditClientActionType, thunkApi) => {
    try {
      const res = await editClient(clientId, clientData);
      return res;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

interface EditClientStateType {
  loading: "idle" | "pending" | "succeeded" | "failed";
  data: ClientType;
  error: string | null;
}

const initialState: EditClientStateType = {
  loading: "idle",
  data: {} as ClientType,
  error: null,
};

const editClientSlice = createSlice({
  name: "editClient",
  initialState,
  reducers: {
    makeStateLoadingNeutralInEditClient: (state) => {
      return { ...state, loading: "idle" };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(editClientAction.pending, (state, action) => {
        state.loading = "pending";
      })
      .addCase(editClientAction.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.data = action.payload;
      })
      .addCase(editClientAction.rejected, (state, action) => {
        state.loading = "failed";
        state.data = {} as ClientType;
        state.error = action.payload as string;
      });
  },
});

export const { makeStateLoadingNeutralInEditClient } = editClientSlice.actions;
export default editClientSlice.reducer;
