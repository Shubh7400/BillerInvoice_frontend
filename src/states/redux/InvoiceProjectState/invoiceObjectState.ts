import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { InvoiceType } from "../../../types/types";
import { produce } from "immer";

const initialState: InvoiceType = {
  _id: "",
  invoiceNo: 0,
  billDate: "",
  dueDate: "",
  amountWithoutTax: 0,
  amountAfterTax: 0,
  clientId: "",
  adminId: "",
  projectsId: [],
  taxType: "",
  // advanceAmount: 0,
  
};

const invoiceObjectSlice = createSlice({
  name: "invoiceObjectSlice",
  initialState,
  reducers: {
    updateInvoiceObjectStateAction: (state, action) => {
      return produce(state, (draftState: any) => {
        let temp = { ...draftState };
        for (const key in action.payload) {
          temp[key] = action.payload[key];
        }       
        return temp
      });
    },
  },
});

export const { updateInvoiceObjectStateAction } = invoiceObjectSlice.actions;
export default invoiceObjectSlice.reducer;
