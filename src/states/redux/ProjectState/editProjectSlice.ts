import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { UpdateProjectDataType } from "../../../types/types";
import { editProject } from "../../../api/project_requests";

interface EditProjectActionType {
  projectId: string;
  projectData: UpdateProjectDataType;
}

export const editProjectAction = createAsyncThunk(
  "editClient/editClientByIdStatus",
  async ({ projectId, projectData }: EditProjectActionType, thunkApi) => {
    try {
      const res = await editProject(projectId, projectData);
      return res;
    } catch (error) {
      return thunkApi.rejectWithValue(
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }
);

interface EditProjectStateType {
  loading: "idle" | "pending" | "succeeded" | "failed";
  data: UpdateProjectDataType;
  error: string | null;
}

const initialState: EditProjectStateType = {
  loading: "idle",
  data: {} as UpdateProjectDataType,
  error: null,
};

const editProjectSlice = createSlice({
  name: "editProject",
  initialState,
  reducers: {
    makeStateLoadingNeutralInEditProject: (state) => {
      return { ...state, loading: "idle" };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(editProjectAction.pending, (state, action) => {
        state.loading = "pending";
      })
      .addCase(editProjectAction.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.data = action.payload;
      })
      .addCase(editProjectAction.rejected, (state, action) => {
        state.loading = "failed";
        state.data = {} as UpdateProjectDataType;
        state.error = action.payload as string;
      });
  },
});

export const { makeStateLoadingNeutralInEditProject } =
  editProjectSlice.actions;
export default editProjectSlice.reducer;
