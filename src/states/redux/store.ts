import { configureStore } from "@reduxjs/toolkit";
import adminReducer from "./AdminStates/adminSlice";
import allClientsReducer from "./ClientStates/allClientSlice";
import addClientReducer from "./ClientStates/addClientSlice";
import selectedClientReducer from "./ClientStates/selectedClientSlice";
import projectsForInvoiceReducer from "./InvoiceProjectState/addProjectForInvoiceSlice";
import invoiceObjectReducer from "./InvoiceProjectState/invoiceObjectState";
import editClientReducer from "././ClientStates/editClientSlice";
import deleteClientReducer from "././ClientStates/deleteClientSlice";
export const store = configureStore({
  reducer: {
    adminState: adminReducer,
    allClientsState: allClientsReducer,
    addClientState: addClientReducer,
    selectedClientState: selectedClientReducer,
    editClientState: editClientReducer,
    deleteClientState: deleteClientReducer,
    projectsForInvoiceState: projectsForInvoiceReducer,
    invoiceObjectState: invoiceObjectReducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

store.subscribe(() => {
  console.log("in strore", store.getState());
});
