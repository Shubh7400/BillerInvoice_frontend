import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { InvoiceType } from "../../../types/types";
import { produce } from "immer";

interface InvoiceObjectStateType {
  invoiceNo: number,
  billDate: string,
  dueDate: string,
  amountWithoutTax: 0,
  amountAfterTax: 0,
  clientId: string,
  adminId: string,
  projectsId: string[],
  taxType: string,
  grandTotal?: number,
  taxAmount: number,
  projectName: string;
  rate?: number | null;
  workingPeriodType: "hours" | "months" | "fixed";
  currencyType: "rupees" | "dollars" | "pounds";
  conversionRate: number;
  paymentStatus: boolean;
  amount?: number | null;
  advanceAmount?: number | null;
  workingPeriod?: number | null;
  ratePerDay?: number | null;
}

const initialState: { data: InvoiceObjectStateType; loading: "idle" | "loading" | "pending" | "fulfilled"; error: string | null } = {
  data: {
    invoiceNo: 0,
    billDate: "",
    dueDate: "",
    amountWithoutTax: 0,
    amountAfterTax: 0,
    clientId: "",
    adminId: "",
    projectsId: [],
    taxType: "",
    grandTotal: 0,
    taxAmount: 0,
    projectName: "",
    rate: 1,
    workingPeriodType: "hours",
    currencyType: "rupees",
    conversionRate: 1,
    paymentStatus: false,
    amount: 0,
    advanceAmount: 0,
    workingPeriod: 1,
    ratePerDay: 1
  },
  loading: "idle",
  error: null,

};

const invoiceObjectSlice = createSlice({
  name: "invoiceObjectSlice",
  initialState,
  reducers: {
    updateInvoiceObjectStateAction: (state, action) => {
      return produce(state, (draftState: any) => {
        for (const key in action.payload) {
          if (Object.prototype.hasOwnProperty.call(action.payload, key)) {
            draftState.data[key] = action.payload[key];
          }
        }
      });
    },

    setLoadingState: (state) => {
      return produce(state, (draftState: any) => {
        draftState.status = "loading";
        draftState.error = null;
      });
    },
    setPendingState: (state) => {
      return produce(state, (draftState: any) => {
        draftState.status = "pending";
      });
    },
    setFulfilledState: (state, action: PayloadAction<Partial<InvoiceType>>) => {
      return produce(state, (draftState: any) => {
        Object.assign(draftState, action.payload);
        draftState.status = "fulfilled";
        draftState.error = null;
      });
    },
    setErrorState: (state, action: PayloadAction<string>) => {
      return produce(state, (draftState: any) => {
        draftState.status = "pending";
        draftState.error = action.payload;
      });
    },
  },
});

export const { updateInvoiceObjectStateAction, setLoadingState,
  setPendingState,
  setFulfilledState,
  setErrorState, } = invoiceObjectSlice.actions;
export default invoiceObjectSlice.reducer;
