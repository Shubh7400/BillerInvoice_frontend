import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getProjectById } from "../../../api/project_requests";
import { ProjectType } from "../../../types/types";

// Async thunk for fetching a project by its ID
export const getProjectByIdAction = createAsyncThunk(
  "selectedProject/getProjectByIdStatus",
  async (projectId: string, thunkApi) => {
    try {
      const res = await getProjectById(projectId);
      return res;
    } catch (error) {
      return thunkApi.rejectWithValue(
        `Error in gettingOneProjectById ${error}`
      );
    }
  }
);

interface ProjectStateType {
  loading: "idle" | "pending" | "succeeded" | "failed";
  data: ProjectType;
  error: string | null;
}

const projectInitialState: ProjectStateType = {
  loading: "idle",
  data: {} as ProjectType,
  error: null,
};

const selectedProjectSlice = createSlice({
  name: "singleProject",
  initialState: projectInitialState,
  reducers: {
    makeStateNeutralOfSelectedProject: (state) => {
      return {
        ...state,
        loading: "idle",
        data: {} as ProjectType,
        error: null,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProjectByIdAction.pending, (state, action) => {
        state.loading = "pending";
      })
      .addCase(getProjectByIdAction.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.data = action.payload;
      })
      .addCase(getProjectByIdAction.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { makeStateNeutralOfSelectedProject } =
  selectedProjectSlice.actions;
export default selectedProjectSlice.reducer;
