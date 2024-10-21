import { ProjectType } from "./../../../types/types";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { produce } from "immer";

interface InitialStateType {
  projectsForInvoice: ProjectType[];
}

const initialState: InitialStateType = {
  projectsForInvoice: [] as ProjectType[],
};

const addProjectForInvoiceSlice = createSlice({
  name: "addProjectForInvoiceSlice",
  initialState,
  reducers: {
    addProjectForInvoiceAction: (state, action: PayloadAction<ProjectType>) => {
      return produce(state, (draftState: InitialStateType) => {
        draftState.projectsForInvoice.push(action.payload);
      });
    },
    addAllProjectsForInvoiceAction: (
      state,
      action: PayloadAction<ProjectType[]>
    ) => {
      return produce(state, (draftState: InitialStateType) => {
        draftState.projectsForInvoice = action.payload;
      });
    },
    removeProjectFromInvoiceAction: (state, action: PayloadAction<string>) => {
      return produce(state, (draftState: InitialStateType) => {
        draftState.projectsForInvoice = draftState.projectsForInvoice.filter(
          (project) => project._id !== action.payload
        );
      });
    },
    removeAllProjectsFromInvoiceAction: (state) => {
      return produce(state, (draftState: InitialStateType) => {
        draftState.projectsForInvoice = [];
      });
    },
  },
});

export default addProjectForInvoiceSlice.reducer;
export const {
  addProjectForInvoiceAction,
  addAllProjectsForInvoiceAction,
  removeProjectFromInvoiceAction,
  removeAllProjectsFromInvoiceAction,
} = addProjectForInvoiceSlice.actions;
