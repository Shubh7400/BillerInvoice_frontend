import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toggleClientStatusByClientId } from '../../../api/client_requests';
import { ClientType } from '../../../types/types';


// Initial State
interface ClientState {
  clientStatus: ClientType[];
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ClientState = {
  clientStatus: [],
  loading: 'idle',
  error: null,
};

// Async Action: Toggle Client Status
export const toggleClientStatusAction = createAsyncThunk(
  'clients/toggleStatus',
  async (clientId: string, { rejectWithValue }) => {
    try {
      const response = await toggleClientStatusByClientId(clientId);
      return response.client; // Return updated client from the API
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Client Slice
const clientSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Toggle Client Status
    builder
      .addCase(toggleClientStatusAction.pending, (state) => {
        state.loading = 'pending';
      })
      .addCase(toggleClientStatusAction.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        const updatedClient = action.payload;
        const index = state.clientStatus.findIndex((c) => c._id === updatedClient._id);
        if (index !== -1) {
          state.clientStatus[index] = updatedClient; // Update the state with the new status
        } else {
          // In case the updated client is not found, push it to the list
          state.clientStatus.push(updatedClient);
        }
      })
      
      .addCase(toggleClientStatusAction.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload as string;
      });
  },
});

export default clientSlice.reducer;


