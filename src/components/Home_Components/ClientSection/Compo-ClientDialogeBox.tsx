import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Radio from "@mui/material/Radio";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useDispatch, useSelector } from "react-redux";
import {
  getClientByIdAction,
  makeStateNeutralOfSelectedClient,
} from "../../../states/redux/ClientStates/selectedClientSlice";
import { AppDispatch, RootState } from "../../../states/redux/store";
import { getAllClientsByAdminIdAction } from "../../../states/redux/ClientStates/allClientSlice";
import { CircularProgress, TextField, useTheme } from "@mui/material";
import {
  deleteClientAction,
  makeStateLoadingNeutralInDeleteClient,
} from "../../../states/redux/ClientStates/deleteClientSlice";
import { enqueueSnackbar } from "notistack";
import CompoLoading from "./Compo-Loding";
import { AuthContext } from "../../../states/context/AuthContext/AuthContext";
import CompoAddClient from "./Compo_AddClient";
import ActionConfirmer from "../../SideBar/ActionConfirmer";
import { Outlet, useNavigate } from "react-router-dom";
import { ClientType } from "../../../types/types";

type ClientSelectionTableProps = {
  clientsLoading: string;
  clients: ClientType[];
  searchClientName: string;
};
export default function ClientSelectionTable({
  clientsLoading,
  clients,
  searchClientName,
}: ClientSelectionTableProps) {
  const dispatch = useDispatch<AppDispatch>();
  const materialTheme = useTheme();
  const { adminId } = React.useContext(AuthContext);

  const [selectedClientId, setSelectedClientId] = React.useState<string>("");
  const [clientDetails, setClientDetails] = React.useState<any>(null); // Store client details
  const { deleteLoading, deleteData, deleteError } = useSelector(
    (state: RootState) => state.deleteClientState
  );
  const navigate = useNavigate();

  const [deletingClientIdString, setDeletingClientIdString] =
    React.useState<string>("");

  const selectedClient = useSelector(
    (state: RootState) => state.selectedClientState
  );
  const clientObj: ClientType = selectedClient.data;

  React.useEffect(() => {
    if (deleteLoading === "succeeded" && deleteData) {
      if (adminId) {
        dispatch(getAllClientsByAdminIdAction(adminId));
      }
      enqueueSnackbar("Client deleted successfully", { variant: "success" });
      dispatch(makeStateLoadingNeutralInDeleteClient());
      dispatch(makeStateNeutralOfSelectedClient());
    } else if (deleteLoading === "failed") {
      enqueueSnackbar("Error in deleting client", { variant: "error" });
    }
  }, [deleteLoading, deleteError]);

  React.useEffect(() => {
    if (adminId) {
      dispatch(getAllClientsByAdminIdAction(adminId));
      setSelectedClientId(clientObj._id || "");
    }
  }, [adminId, dispatch]);

  const handleDeleteClient = (clientId: string) => {
    if (clientId) {
      setDeletingClientIdString(clientId);
      dispatch(deleteClientAction(clientId));
    }
  };

  const handleConfirmSelection = () => {
    if (selectedClientId) {
      dispatch(getClientByIdAction(selectedClientId));
      const selectedClient = clients.find(
        (client) => client._id === selectedClientId
      );
      setClientDetails(selectedClient); // Store selected client details
      navigate("/projects"); // Navigate to the /project page
    }
  };

  return (
    <Box>
      {clientsLoading === "pending" ? (
        <CompoLoading forAllClients={true} forSelectClient={false} />
      ) : (
        <TableContainer className="h-[58vh] overflow-y-scroll overflow-x-hidden">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Select</TableCell>
                <TableCell>Client Name</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {clients
                .filter((ele: ClientType) => {
                  if (searchClientName.length <= 0) {
                    return true;
                  }
                  let searchQ = searchClientName.toLowerCase();
                  let clientName = ele.clientName.toLowerCase();
                  return clientName.includes(searchQ);
                })
                .map((client: ClientType) => (
                  <TableRow key={client._id}>
                    <TableCell>
                      <FormControlLabel
                        control={
                          <Radio
                            checked={selectedClientId === client._id}
                            onChange={() =>
                              setSelectedClientId(client._id || "")
                            }
                          />
                        }
                        label=""
                      />
                    </TableCell>
                    <TableCell>{client.clientName}</TableCell>
                    <TableCell>
                      <div className="flex">
                        <CompoAddClient
                          forEditClient={true}
                          clientToEdit={client}
                        />
                        {deleteLoading === "pending" &&
                        deletingClientIdString === client._id ? (
                          <CircularProgress size={25} />
                        ) : (
                          <ActionConfirmer
                            actionTag="Delete"
                            actionFunction={handleDeleteClient}
                            parameter={client._id}
                          />
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Button
        variant="contained"
        color="primary"
        onClick={handleConfirmSelection}
        disabled={!selectedClientId}
        sx={{
          backgroundColor: "#d9a990",
          borderRadius: "20px",
          ":hover": {
            backgroundColor: materialTheme.palette.secondary.main,
          },
        }}
      >
        Confirm Selection
      </Button>

      {clientDetails && (
        <Box sx={{ marginTop: "20px" }}>
          <h2>Client Details</h2>
          <p>
            <strong>Name:</strong> {clientDetails.clientName}
          </p>
          {/* Add more client details here as needed */}
        </Box>
      )}
    </Box>
  );
}
