import { useMutation, useQuery } from "@tanstack/react-query";
import { addNewInvoice, getAllInvoice } from "../../../api/invoice_requests";
import { InvoiceType } from "../../../types/types";
import { queryClient } from "../../..";

export const useAddInvoiceMutation = () => {
  const AddInvoiceMutationHandler = useMutation(
    (invoiceObject: InvoiceType) => addNewInvoice(invoiceObject),
    {
      onSettled: () => {
        queryClient.invalidateQueries(["allInvoices"]);
      },
    }
  );
  return AddInvoiceMutationHandler;
};
export const useGetAllInvoicesQuery = () => {
  return useQuery(["allInvoices"], () => getAllInvoice());
};
