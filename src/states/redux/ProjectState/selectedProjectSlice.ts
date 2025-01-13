import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getProjectById } from "../../../api/project_requests";
import { ProjectType } from "../../../types/types";
import { deleteFileFromProject } from "../../../api/project_requests";


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

export const deleteFileFromProjectAction = createAsyncThunk(
  "selectedProject/deleteFileFromProject",
  async ({ projectId, filename }: { projectId: string; filename: string }, thunkApi) => {
    try {
      const res = await deleteFileFromProject(projectId, filename);
      return { projectId, filename };  
    } catch (error) {
      return thunkApi.rejectWithValue(
        `Error in deleting file from project: ${error}`
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
      })
      .addCase(deleteFileFromProjectAction.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(deleteFileFromProjectAction.fulfilled, (state, action) => {
        state.loading = "succeeded";
        const updatedFiles = state.data?.uploadedFiles?.filter(
          (file) => file.filename !== action.payload.filename
        );
        state.data.uploadedFiles = updatedFiles;
      })
      .addCase(deleteFileFromProjectAction.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { makeStateNeutralOfSelectedProject } =
  selectedProjectSlice.actions;
export default selectedProjectSlice.reducer;
