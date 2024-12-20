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
          workingPeriod,
          advanceAmount,
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
              amount = rate * (workingPeriod || 1) * conversionRate;
            } else if (workingPeriodType === "months") {
              const effectiveWorkingDays = workingPeriod !== undefined ? workingPeriod : 1; // Default to 1 if not provided
              if(effectiveWorkingDays){
              amount = (ratePerDay || 1) * effectiveWorkingDays * conversionRate; }
            } else if (workingPeriodType === "fixed") {
              amount = rate * conversionRate;
            }
          }
          draftState.projectsForInvoice.push({
            ...action.payload,
            workingPeriod: workingPeriod !== undefined ? workingPeriod : 1,
            amount , 
            advanceAmount: advanceAmount || 0, 
            ratePerDay,
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
          const {
            rate,
            ratePerDay,
            workingPeriodType,
            conversionRate,
            workingPeriod,
            advanceAmount,
          } = project;
    
          let amount = 0;
          if (rate && workingPeriodType) {
            if (workingPeriodType === "hours") {
              if(workingPeriod){
              amount = rate * (workingPeriod !== undefined ? workingPeriod : 1) * conversionRate; }
            } else if (workingPeriodType === "months") {
              const effectiveWorkingDays = workingPeriod !== undefined ? workingPeriod : 1;
              if(effectiveWorkingDays){
              amount = (ratePerDay || 1) * effectiveWorkingDays * conversionRate; }
            } else if (workingPeriodType === "fixed") {
              amount = rate * conversionRate;
            }
          }  
          return {
            ...project,
            workingPeriod: workingPeriod !== undefined ? workingPeriod : 1, // Ensure default value
            amount,
            advanceAmount,
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
        const {
          _id,
          rate,
          ratePerDay,
          workingPeriodType,
          conversionRate,
          workingPeriod,
          advanceAmount,
        } = updatedProject;
    
        const projectIndex = draftState.projectsForInvoice.findIndex(
          (project) => project._id === _id
        );
    
        if (projectIndex !== -1) {
          let amount = 0;
          if (rate && workingPeriodType) {
            if (workingPeriodType === "hours") {
              if(workingPeriod){

              amount = rate * (workingPeriod !== undefined ? workingPeriod : 1) * conversionRate; }
            } else if (workingPeriodType === "months") {
              const effectiveWorkingDays = workingPeriod !== undefined ? workingPeriod : 1;
              if(effectiveWorkingDays){
              amount = (ratePerDay || 1) * effectiveWorkingDays * conversionRate; }
            } else if (workingPeriodType === "fixed") {
              amount = rate * conversionRate;
            }
          }
    
          draftState.projectsForInvoice[projectIndex] = {
            ...draftState.projectsForInvoice[projectIndex],
            ...updatedProject,
            workingPeriod: workingPeriod !== undefined ? workingPeriod : 1, // Ensure default value
            amount,
            advanceAmount,
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
