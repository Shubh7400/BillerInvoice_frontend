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
        const { clientId, _id, rate,ratePerDay, workingPeriodType,conversionRate ,workingTime , workingDays} = action.payload;
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
            if (workingPeriodType === "hours" ) {
              amount = rate * (workingTime || 1 ) * conversionRate ; 
            } else if (workingPeriodType === "days" && ratePerDay) {
              amount = ratePerDay * (workingDays || 1) * conversionRate ; 
            } else if (workingPeriodType === "fixed") {
              amount = rate * conversionRate ; 
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
            if (project.workingPeriodType === "hours" ) {
              amount = project.rate * (project.workingTime || 1)* project.conversionRate ;
            } else if (project.workingPeriodType === "days" && project.workingDays && project.ratePerDay) {
              amount = project.ratePerDay * (project.workingDays || 1) * project.conversionRate;
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
        const { _id, rate,ratePerDay, workingPeriodType, conversionRate ,workingTime ,workingDays} = updatedProject;
        
        
        const projectIndex = draftState.projectsForInvoice.findIndex(
          (project) => project._id === _id
        );
        
        if (projectIndex !== -1) {
        
          let amount = 0;
          if (rate && workingPeriodType) {
            if (workingPeriodType === "hours" ) {
              amount = rate * (workingTime || 1)* conversionRate; 
            } else if (workingPeriodType === "days" && workingDays && ratePerDay) {
              amount = ratePerDay * (workingDays || 1) * conversionRate; 
            } else if (workingPeriodType === "fixed") {
              amount = rate * conversionRate; 
            }
          }

          draftState.projectsForInvoice[projectIndex] = {
            ...draftState.projectsForInvoice[projectIndex],
            ...updatedProject,
            amount, 
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
