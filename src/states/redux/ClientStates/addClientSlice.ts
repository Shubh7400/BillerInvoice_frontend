import {
  SliceCaseReducers,
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";
import { addClient } from "../../../api/client_requests";
import { ClientType } from "../../../types/types";

export const addNewClientAction = createAsyncThunk(
  "allclients/addNewClientActionStatus",
  async (clientData: ClientType, thunkApi) => {
    try {
      const res = await addClient(clientData);
      return res;
    } catch (error) {
      return thunkApi.rejectWithValue(`Error in adding new client ${error}`);
    }
  }
);

interface ClientStateType {
  loading: "idle" | "pending" | "succeeded" | "failed";
  data: ClientType;
  error: string | null;
}

const addClientInitialState: ClientStateType = {
  loading: "idle",
  data: {} as ClientType,
  error: null,
};

const addClientSlice = createSlice<
  ClientStateType,
  SliceCaseReducers<ClientStateType>
>({
  name: "addClient",
  initialState: addClientInitialState,
  reducers: {
    makeStateLoadingNeutralInAddClient: (state, action) => {
      return { ...state, loading: "idle" };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addNewClientAction.pending, (state, action) => {
        state.loading = "pending";
      })
      .addCase(addNewClientAction.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.data = action.payload;
      })
      .addCase(addNewClientAction.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { makeStateLoadingNeutralInAddClient } = addClientSlice.actions;
export default addClientSlice.reducer;
