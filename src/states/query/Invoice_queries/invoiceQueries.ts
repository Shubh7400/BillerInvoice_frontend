import { useMutation, useQuery } from "@tanstack/react-query";
import { addNewInvoice, getAllInvoice ,updateInvoice} from "../../../api/invoice_requests";
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
export const useUpdateInvoiceMutation = () => {
  const UpdateInvoiceMutationHandler = useMutation(
    (invoiceObject: InvoiceType) => updateInvoice(invoiceObject),
    {
      onSettled: () => {
        queryClient.invalidateQueries(["allInvoices"]);
      },
    }
  );
  return UpdateInvoiceMutationHandler;
};

export const useGetAllInvoicesQuery = () => {
  return useQuery(["allInvoices"], () => getAllInvoice());
};
