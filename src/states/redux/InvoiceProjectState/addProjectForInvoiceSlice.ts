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
        const { clientId, _id, rate, workingPeriodType,conversionRate } = action.payload;
        if (
          draftState.projectsForInvoice.length > 0 &&
          draftState.projectsForInvoice[0].clientId !== clientId
        ) {
          draftState.projectsForInvoice = [];
        }
        const existingProject = draftState.projectsForInvoice.find(
          (project) => project._id === _id
        );
        if (!existingProject) {
          //  Calculate the amount field based on rate and workingPeriodType
          let amount = 0;
          if (rate && workingPeriodType) {
            if (workingPeriodType === "hours") {
              amount = rate * 8 * conversionRate ; // Assuming 8 hours in a workday
            } else if (workingPeriodType === "days") {
              amount = rate * 30 * conversionRate ; // Assuming 30 days in a month
            } else if (workingPeriodType === "fixed") {
              amount = rate * conversionRate ; // Use the rate directly for fixed
            }
          }
          draftState.projectsForInvoice.push({ ...action.payload, amount });
        }
      });
    },

    addAllProjectsForInvoiceAction: (
      state,
      action: PayloadAction<ProjectType[]>
    ) => {
      return produce(state, (draftState: InitialStateType) => {
        draftState.projectsForInvoice = action.payload.map((project) => {
          let amount = 0;
          if (project.rate && project.workingPeriodType) {
            if (project.workingPeriodType === "hours") {
              amount = project.rate * 8 * project.conversionRate ;
            } else if (project.workingPeriodType === "days") {
              amount = project.rate * 30 * project.conversionRate;
            } else if (project.workingPeriodType === "fixed") {
              amount = project.rate * project.conversionRate;
            }
          }
          return { ...project, amount };
        });
      });
    },

    updateProjectForInvoiceAction: (
      state,
      action: PayloadAction<ProjectType>
    ) => {
      return produce(state, (draftState: InitialStateType) => {
        const updatedProject = action.payload;
        const { _id, rate, workingPeriodType, conversionRate } = updatedProject;
        
        // Find the project to update
        const projectIndex = draftState.projectsForInvoice.findIndex(
          (project) => project._id === _id
        );
        
        if (projectIndex !== -1) {
          // Recalculate amount based on rate and workingPeriodType
          let amount = 0;
          if (rate && workingPeriodType) {
            if (workingPeriodType === "hours") {
              amount = rate * 8 * conversionRate; // Assuming 8 hours in a workday
            } else if (workingPeriodType === "days") {
              amount = rate * 30 * conversionRate; // Assuming 30 days in a month
            } else if (workingPeriodType === "fixed") {
              amount = rate * conversionRate; // Use the rate directly for fixed
            }
          }

          // Update the project with the new fields and recalculated amount
          draftState.projectsForInvoice[projectIndex] = {
            ...draftState.projectsForInvoice[projectIndex],
            ...updatedProject,
            amount, // Updated amount
          };
        }
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
  updateProjectForInvoiceAction, // Export the new action
} = addProjectForInvoiceSlice.actions;
