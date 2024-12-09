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
        const {
          clientId,
          _id,
          rate,
          ratePerDay,
          workingPeriodType,
          conversionRate,
          workingTime,
          workingDays,
          advanceAmount
        } = action.payload;

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
          let amount = 0;

          if (rate && workingPeriodType) {
            if (workingPeriodType === "hours") {
              amount = rate * (workingTime || 1) * conversionRate;
            } else if (workingPeriodType === "days") {
              const effectiveWorkingDays = workingDays || 1; // Default to 1 if not provided
              amount = (ratePerDay || 0) * effectiveWorkingDays * conversionRate;
            } else if (workingPeriodType === "fixed") {
              amount = rate * conversionRate;
            }
          }

          draftState.projectsForInvoice.push({
            ...action.payload,
            workingDays: workingDays || 1, // Ensure default value
            amount , 
            advanceAmount: advanceAmount || 0, 
          });
        }
      });
    },


    addAllProjectsForInvoiceAction: (
      state,
      action: PayloadAction<ProjectType[]>
    ) => {
      return produce(state, (draftState: InitialStateType) => {
        draftState.projectsForInvoice = action.payload.map((project) => {
          const { rate, ratePerDay, workingPeriodType, conversionRate, workingTime, workingDays , advanceAmount} = project;

          let amount = 0;

          if (rate && workingPeriodType) {
            if (workingPeriodType === "hours") {
              amount = rate * (workingTime || 1) * conversionRate;
            } else if (workingPeriodType === "days") {
              const effectiveWorkingDays = workingDays || 1; // Default to 1 if not provided
              amount = (ratePerDay || 0) * effectiveWorkingDays * conversionRate;
            } else if (workingPeriodType === "fixed") {
              amount = rate * conversionRate;
            }
          }

          return {
            ...project,
            workingDays: workingDays || 1, // Ensure default value
            amount,advanceAmount,
          };
        });
      });
    },


    updateProjectForInvoiceAction: (
      state,
      action: PayloadAction<ProjectType>
    ) => {
      return produce(state, (draftState: InitialStateType) => {
        const updatedProject = action.payload;
        const { _id, rate, ratePerDay, workingPeriodType, conversionRate, workingTime, workingDays , advanceAmount} = updatedProject;

        const projectIndex = draftState.projectsForInvoice.findIndex(
          (project) => project._id === _id
        );

        if (projectIndex !== -1) {
          let amount = 0;

          if (rate && workingPeriodType) {
            if (workingPeriodType === "hours") {
              amount = rate * (workingTime || 1) * conversionRate;
            } else if (workingPeriodType === "days") {
              const effectiveWorkingDays = workingDays || 1; // Default to 1 if not provided
              amount = (ratePerDay || 0) * effectiveWorkingDays * conversionRate;
            } else if (workingPeriodType === "fixed") {
              amount = rate * conversionRate;
            }
          }

          draftState.projectsForInvoice[projectIndex] = {
            ...draftState.projectsForInvoice[projectIndex],
            ...updatedProject,
            workingDays: workingDays || 1, // Ensure default value
            amount, advanceAmount,
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
  updateProjectForInvoiceAction,
} = addProjectForInvoiceSlice.actions;
