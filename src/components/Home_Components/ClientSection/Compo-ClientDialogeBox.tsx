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
import Styles from "./client.module.css"

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
        <TableContainer className={Styles.table_scroll}>
          <Table>
            <TableHead className={Styles.animated} >
              <TableRow>
                <TableCell style={{ paddingRight:'0'}}>Select</TableCell>
                <TableCell style={{paddingLeft:'0', paddingRight:'0'}}>Client Name</TableCell>
                <TableCell style={{paddingLeft:'0', paddingRight:'0'}}>Client Email</TableCell>
                <TableCell style={{paddingLeft:'0', paddingRight:'0'}}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody  >
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
                  <TableRow key={client._id} className="p-3">
                    <TableCell style={{paddingTop: '0', paddingBottom: '0', paddingLeft:'20px'}}>
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
                    <TableCell style={{padding:'0' }}>{client.clientName}</TableCell>
                    <TableCell style={{padding:'0'}}>{client.email}</TableCell>
                    <TableCell style={{padding:'0'}}>
                      <div className="flex">

                      <div className={Styles.editButton}>
                        <CompoAddClient
                          forEditClient={true}
                          clientToEdit={client}
                        />
                        </div>
                        <div className={Styles.editButton}>
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
            backgroundColor: "#4a6180",
          }
          , position:'absolute', bottom:'50px', right:'40px'
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
