import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import FormControlLabel from "@mui/material/FormControlLabel";
import { ClientType } from "../../../types/types";
import { useDispatch, useSelector } from "react-redux";
import {
  getClientByIdAction,
  makeStateNeutralOfSelectedClient,
} from "../../../states/redux/ClientStates/selectedClientSlice";
import { AppDispatch, RootState } from "../../../states/redux/store";
import { getAllClientsByAdminIdAction } from "../../../states/redux/ClientStates/allClientSlice";
import { removeAllProjectsFromInvoiceAction } from "../../../states/redux/InvoiceProjectState/addProjectForInvoiceSlice";
import {
  CircularProgress,
  Input,
  TextField,
  useTheme,
  useThemeProps,
} from "@mui/material";
import {
  addDetelingClientIdInState,
  deleteClientAction,
  makeStateLoadingNeutralInDeleteClient,
} from "../../../states/redux/ClientStates/deleteClientSlice";
import { MdOutlineDeleteSweep } from "react-icons/md";
import { enqueueSnackbar } from "notistack";
import CompoLoading from "./Compo-Loding";
import { AuthContext } from "../../../states/context/AuthContext/AuthContext";
import { CiEdit } from "react-icons/ci";
import CompoAddClient from "./Compo_AddClient";
import ActionConfirmer from "../../Navbar/ActionConfirmer";

function ConfirmationDialogRaw(props: {
  onClose: (newValue: string) => void;
  open: boolean;
  value: string;
  id: string; // Add the id prop here
  keepMounted: boolean;
  adminId: string | null;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const { onClose, value: valueProp, open, adminId, ...other } = props;
  const [value, setValue] = React.useState(valueProp);
  const [searchClientName, setSearchClientName] = React.useState("");
  const radioGroupRef = React.useRef(null);
  const { deleteLoading, deleteData, deleteError } = useSelector(
    (state: RootState) => state.deleteClientState
  );
  const {
    loading: clientsLoading,
    data: clients,
    error: clientsError,
  } = useSelector((state: RootState) => state.allClientsState);
  const [deletingClientIdString, setDeletingClientIdString] =
    React.useState("");
  const materialTheme = useTheme();

  React.useEffect(() => {
    if (!open) {
      setValue(valueProp);
    }
  }, [valueProp, open]);

  React.useEffect(() => {
    if (deleteLoading === "succeeded" && deleteData) {
      if (adminId) {
        dispatch(getAllClientsByAdminIdAction(adminId));
      }
      enqueueSnackbar({
        message: "Client deleted successfully",
        variant: "success",
      });
      dispatch(makeStateLoadingNeutralInDeleteClient());
      dispatch(makeStateNeutralOfSelectedClient());
    } else if (deleteLoading === "failed") {
      enqueueSnackbar({
        message: "Error in deleting client",
        variant: "error",
      });
    }
    dispatch(makeStateLoadingNeutralInDeleteClient());
  }, [deleteLoading, deleteError]);

  const handleEntering = () => {
    if (radioGroupRef.current != null) {
    }
  };

  const handleCancel = () => {
    onClose("");
  };

  const handleOk = () => {
    onClose(value);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const handleDeleteClient = (clientId: string | undefined) => {
    if (clientId) {
      setDeletingClientIdString(clientId);
      dispatch(deleteClientAction(clientId));
    }
  };

  return (
    <Dialog
      sx={{
        "& .MuiDialog-paper": {
          width: "80%",
          minHeight: { sm: 435 },
          maxHeight: 435,
        },
      }}
      maxWidth="xs"
      TransitionProps={{ onEntering: handleEntering }}
      open={open}
      {...other}
    >
      <DialogTitle sx={{ mb: "-20px" }}>Select Client</DialogTitle>
      <div className="mx-4">
        <TextField
          autoFocus
          margin="dense"
          id="SearchClientName"
          label="Search by client name"
          type="text"
          fullWidth
          variant="standard"
          name="searchClientName"
          value={searchClientName}
          onChange={(e) => setSearchClientName(e.target.value)}
        />
      </div>

      <DialogContent dividers>
        {clientsLoading === "pending" ? (
          <CompoLoading forAllClients={true} forSelectClient={false} />
        ) : (
          <RadioGroup
            ref={radioGroupRef}
            aria-label="clients"
            name="clients"
            value={value}
            onChange={(e) => handleChange(e)}
          >
            {clients
              .filter((ele) => {
                if (searchClientName.length <= 0) {
                  return true;
                }
                let searchQ = searchClientName.toLocaleLowerCase();
                let clientName = ele.clientName.toLocaleLowerCase();
                if (searchQ.length > clientName.length) {
                  return false;
                }
                return (
                  searchQ.localeCompare(clientName.slice(0, searchQ.length)) ===
                  0
                );
              })
              .map((client) => (
                <div className="flex justify-between items-center">
                  <FormControlLabel
                    value={client._id}
                    control={<Radio />}
                    label={client.clientName}
                    sx={{
                      width: "50%",
                    }}
                  />
                  <div>
                    <CompoAddClient
                      forEditClient={true}
                      clientToEdit={client}
                      handleSelectClientClose={handleCancel}
                    />
                  </div>
                  {deleteLoading === "pending" &&
                  deletingClientIdString === client._id ? (
                    <CircularProgress size={25} />
                  ) : (
                    <div className="cursor-pointer">
                      <ActionConfirmer
                        actionTag="Delete"
                        actionFunction={handleDeleteClient}
                        parameter={client._id}
                      />
                    </div>
                  )}
                </div>
              ))}
          </RadioGroup>
        )}
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleCancel}>
          Cancel
        </Button>
        <Button onClick={handleOk}>Ok</Button>
      </DialogActions>
    </Dialog>
  );
}

ConfirmationDialogRaw.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  value: PropTypes.string.isRequired,
};

export default function ConfirmationDialog() {
  const materialTheme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState<string>("");
  const dispatch = useDispatch<AppDispatch>();
  const { adminId } = React.useContext(AuthContext);
  React.useEffect(() => {
    if (value.length > 0) {
      dispatch(getClientByIdAction(value));
      dispatch(removeAllProjectsFromInvoiceAction());
    }
  }, [value, dispatch]);

  React.useEffect(() => {
    if (adminId) {
      dispatch(getAllClientsByAdminIdAction(adminId));
    }
  }, [adminId, dispatch]);

  const handleClickListItem = () => {
    setOpen(true);
  };

  const handleClose = (newValue: string) => {
    setOpen(false);

    if (newValue) {
      setValue(newValue);
    }
  };

  return (
    <Box>
      <List component="div" role="group">
        <ListItem onClick={handleClickListItem}>
          <Button
            sx={{
              backgroundColor: materialTheme.palette.primary.main,
              color: "white",
              padding: { sx: "3px 5px", sm: "7px 8px" },
              fontSize: { sx: "8px", sm: "14px" },
              borderRadius: "2px",
              transition: "background-color 0.3s, box-shadow 0.3s",
              "&:hover": {
                backgroundColor: materialTheme.palette.secondary.main,
              },
            }}
          >
            Select Clients
          </Button>
        </ListItem>
        <ConfirmationDialogRaw
          id="select-client-menu"
          keepMounted
          open={open}
          onClose={handleClose}
          value={value}
          adminId={adminId}
        />
      </List>
    </Box>
  );
}
