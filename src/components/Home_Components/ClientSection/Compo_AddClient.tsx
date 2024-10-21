import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux"; // Assuming you're using Redux
import {
  addNewClientAction,
  makeStateLoadingNeutralInAddClient,
} from "../../../states/redux/ClientStates/addClientSlice";
import { AppDispatch, RootState } from "../../../states/redux/store";
import {
  CityInfoType,
  ClientType,
  CountryInfoType,
  StateInfoType,
} from "../../../types/types";
import SelectCountryStateCity from "./Compo_CountrySelect";
import { Alert, LinearProgress, Typography, useTheme } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { AuthContext } from "../../../states/context/AuthContext/AuthContext";
import { CiEdit } from "react-icons/ci";
import {
  editClientAction,
  makeStateLoadingNeutralInEditClient,
} from "../../../states/redux/ClientStates/editClientSlice";
import { getAllClientsByAdminIdAction } from "../../../states/redux/ClientStates/allClientSlice";
import { getClientByIdAction } from "../../../states/redux/ClientStates/selectedClientSlice";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { E164Number } from "libphonenumber-js/core";
import "../../../styles/addClient.css";

export default function CompoAddClient({
  forEditClient,
  clientToEdit,
  handleSelectClientClose,
}: {
  forEditClient: boolean;
  clientToEdit: ClientType | null;
  handleSelectClientClose?: () => void | undefined;
}) {
  const { adminId } = React.useContext(AuthContext);
  const [controlEditLoading, setControlEditLoading] = useState(false);
  const [addClientLoadingController, setAddClientLoadingController] =
    useState(false);
  //--------------------------------------------------------
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    if (handleSelectClientClose) {
      handleSelectClientClose();
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // -------------------------------------------------------

  const materialTheme = useTheme();
  const [selectedCountry, setSelectedCountry] = useState<CountryInfoType>(
    {} as CountryInfoType
  );
  const [selectedState, setSelectedState] = useState<StateInfoType>(
    {} as StateInfoType
  );
  const [selectedCity, setSelectedCity] = useState<CityInfoType>(
    {} as CityInfoType
  );
  const [incompleteError, setIncompleteError] = useState("");
  const [formError, setFormError] = useState("");

  const dispatch = useDispatch<AppDispatch>();
  const {
    loading: addClientLoading,
    data: addedClient,
    error: addClientError,
  } = useSelector((state: RootState) => state.addClientState);
  const editClientState = useSelector(
    (state: RootState) => state.editClientState
  );
  const { data } = useSelector((state: RootState) => state.selectedClientState);
  const [clientData, setClientData] = useState<ClientType>({
    clientName: "",
    email: "",
    contactNo: "",
    pancardNo: "",
    gistin: "",
    conversionRate: 83,
    address: {
      street: "",
      city: selectedCountry.name,
      state: selectedState.name,
      country: selectedCity.name,
      postalCode: "",
    },
    user: "",
  });

  React.useEffect(() => {
    if (editClientState.loading === "succeeded" && controlEditLoading) {
      setControlEditLoading(false);
      dispatch(makeStateLoadingNeutralInEditClient());
      if (adminId) {
        dispatch(getAllClientsByAdminIdAction(adminId));
      }
      if (clientToEdit && clientToEdit._id === data._id) {
        dispatch(getClientByIdAction(clientToEdit?._id!));
      }
      enqueueSnackbar({
        message: "Client edited successfull",
        variant: "success",
      });
      setFormError("");
      handleClose();
    } else if (editClientState.loading === "failed" && controlEditLoading) {
      setControlEditLoading(false);
      setFormError(`Error in updating client! Try again`);
      enqueueSnackbar({
        message: "Edit client failed",
        variant: "error",
      });
      dispatch(makeStateLoadingNeutralInEditClient());
    }
  }, [editClientState]);

  React.useEffect(() => {
    if (clientToEdit) {
      setClientData({ ...clientToEdit });
    } else {
      setClientData({ ...clientData });
    }
  }, [clientToEdit, open]);

  React.useEffect(() => {
    if (adminId) {
      setClientData({ ...clientData, user: adminId });
    }
  }, [adminId]);

  React.useEffect(() => {
    if (addClientLoading === "succeeded") {
      // setAddClientLoadingController(false);
      dispatch(makeStateLoadingNeutralInAddClient(true));
      if (adminId) {
        dispatch(getAllClientsByAdminIdAction(adminId));
      }
      enqueueSnackbar({
        message: "Client added successfully",
        variant: "success",
      });
      setFormError("");
      // handleClose();
    } else if (addClientLoading === "failed") {
      // setAddClientLoadingController(false);
      setFormError(`${addClientError}`);
      if (
        addClientError ===
        "Error in adding new client Error: Client with this name already exists"
      ) {
        enqueueSnackbar({
          message: "Error, client with this name already exists.Try again!",
          variant: "error",
        });
      } else {
        enqueueSnackbar({
          message: "Error in adding client.Try again!",
          variant: "error",
        });
      }
      dispatch(makeStateLoadingNeutralInAddClient(true));
    }
  }, [addClientLoading, addClientError]);

  // ----------------Change of Country State City----------------------

  React.useEffect(() => {
    setClientData({
      ...clientData,
      address: {
        ...clientData.address,
        country: selectedCountry.name,
        state: "",
        city: "",
      },
    });
    if (adminId) {
      setClientData((prev) => {
        return { ...prev, user: adminId };
      });
    }
  }, [selectedCountry]);

  React.useEffect(() => {
    setClientData({
      ...clientData,
      address: {
        ...clientData.address,
        country: selectedCountry.name,
        state: selectedState.name,
        city: "",
      },
    });
    if (adminId) {
      setClientData((prev) => {
        return { ...prev, user: adminId };
      });
    }
  }, [selectedState]);

  React.useEffect(() => {
    setClientData({
      ...clientData,
      address: {
        ...clientData.address,
        country: selectedCountry.name,
        state: selectedState.name,
        city: selectedCity.name,
      },
    });
    if (adminId) {
      setClientData((prev) => {
        return { ...prev, user: adminId };
      });
    }
  }, [selectedCity]);

  // ------------------------------------------------------------------

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === "gistin" || name === "pancardNo") {
      setClientData({
        ...clientData,
        [name]: value.toLocaleUpperCase(),
      });
    } else if (name === "email") {
      let sanitisedEmail = value.trim();
      setClientData({ ...clientData, email: sanitisedEmail });
    } else {
      setClientData({
        ...clientData,
        [name]: value,
      });
    }
    setFormError("");
    setIncompleteError("");
  };
  console.log(clientData);
  const handleMobileNoChange = (e: E164Number | undefined) => {
    setClientData({ ...clientData, contactNo: e });
  };

  function areAllFieldsFilled(obj: any) {
    for (const key in obj) {
      if (typeof obj[key] === "object" && obj[key] !== null) {
        if (!areAllFieldsFilled(obj[key])) {
          return false;
        }
      } else {
        if (obj[key] === "" || obj[key] === undefined) {
          return false;
        }
      }
    }
    return true;
  }

  function areEntriesValid(obj: any) {
    let clientNameTemp = obj.clientName.trim();
    if (clientNameTemp.length < 2) {
      setFormError("Client name minimum length is 2");
      return false;
    } else if (obj.contactNo.length !== 13) {
      setFormError("Contactno. must be of 10 digit only.");
      return false;
    } else if (obj.clientName.length > 50 || obj.clientName.length < 2) {
      setFormError(
        "Client name must not exceed 50 characters and not below 2 characters."
      );
      return false;
    } else if (obj.gistin.length !== 15) {
      setFormError("Gstin must be of 15 digit only.");
      return false;
    } else if (obj.pancardNo.length !== 10) {
      setFormError("Pancard must be of 10 digit only.");
      return false;
    } else if (obj.email) {
      const pattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
      if (!pattern.test(obj.email)) {
        setFormError("Invalid email address*");
        return false;
      } else if (/\s/.test(obj.email)) {
        setFormError("Invalid email address,spaces not allowed*");
        return false;
      } else if (obj.email.length > 50) {
        setFormError("Email must be less then 51 characters");
        return false;
      }
      setFormError("");
      return pattern.test(obj.email);
    } else if (obj.address.street.length > 50) {
      setFormError("Street name must not exceed 50 characters");
      return false;
    }
    setFormError("");
    return true;
  }

  const handleAddClientSubmit = () => {
    setClientData({ ...clientData, clientName: clientData.clientName.trim() });
    if (areAllFieldsFilled(clientData) && areEntriesValid(clientData)) {
      dispatch(addNewClientAction(clientData));
      setAddClientLoadingController(true);
    } else {
      setIncompleteError("Incomplete fields");
    }
  };
  const handleEditClientSubmit = () => {
    if (
      areAllFieldsFilled(clientData) &&
      areEntriesValid(clientData) &&
      clientToEdit
    ) {
      const clientId = clientToEdit._id!;
      const prop = { clientId, clientData };
      dispatch(editClientAction(prop));
      setControlEditLoading(true);
    } else {
      setIncompleteError("Incomplete fields");
    }
  };

  return (
    <div>
      {!forEditClient ? (
        <Button
          variant="contained"
          sx={{
            backgroundColor: materialTheme.palette.primary.main,
            ":hover": {
              backgroundColor: materialTheme.palette.secondary.main,
            },
          }}
          onClick={handleClickOpen}
        >
          Add Client
        </Button>
      ) : (
        <Button onClick={handleClickOpen}>
          <CiEdit
            size={20}
            className="text-thirdColor hover:text-violet-900  "
          />
        </Button>
      )}
      <Dialog open={open} /*onClose={handleClose}*/>
        <DialogTitle>
          {forEditClient ? "Edit Client" : "Add Client"}
        </DialogTitle>
        ;
        {formError.length > 0 ? (
          <Alert severity="error"> {formError}</Alert>
        ) : incompleteError.length > 0 ? (
          <Alert severity="error"> {incompleteError}</Alert>
        ) : null}
        {addClientLoading === "pending" ||
        editClientState.loading === "pending" ? (
          <LinearProgress />
        ) : null}
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="clientName"
            label="Client Name"
            type="text"
            fullWidth
            variant="standard"
            name="clientName"
            value={clientData.clientName}
            onChange={(e) => handleChange(e)}
            required
          />
          <TextField
            margin="dense"
            id="email"
            label="Email"
            type="email"
            fullWidth
            variant="standard"
            name="email"
            value={clientData.email}
            onChange={(e) => handleChange(e)}
            required
          />
          <div className="py-2 border-b border-b-slate-400 hover:border-b-black hover:border-b-2 ">
            <label className="text-sm text-gray-500 hover:text-thirdColorHover ">
              Contact No.
            </label>
            <PhoneInput
              defaultCountry="IN"
              international
              countryCallingCodeEditable={false}
              placeholder="Enter phone number"
              value={clientData.contactNo}
              onChange={(e) => handleMobileNoChange(e)}
              className="border-none pt-2  PhoneInputInput"
            />
          </div>
          <TextField
            margin="dense"
            id="pancardNo"
            label="Pancard Number"
            type="text"
            fullWidth
            variant="standard"
            name="pancardNo"
            value={clientData.pancardNo}
            onChange={(e) => handleChange(e)}
            required
          />
          <TextField
            margin="dense"
            id="gistin"
            label="GSTIN"
            type="text"
            fullWidth
            variant="standard"
            name="gistin"
            value={clientData.gistin}
            onChange={(e) => handleChange(e)}
            required
          />
          <TextField
            margin="dense"
            id="conversionRate"
            label="Conversion Rate"
            type="number"
            fullWidth
            variant="standard"
            name="conversionRate"
            value={clientData.conversionRate}
            onChange={(e) => handleChange(e)}
            required
          />
          <TextField
            margin="dense"
            id="street"
            label="Street Address"
            type="text"
            fullWidth
            variant="standard"
            name="street"
            value={clientData.address.street}
            onChange={(e) => {
              setClientData({
                ...clientData,
                address: { ...clientData.address, street: e.target.value },
              });
            }}
            required
          />
          <Typography
            className="text-xs opacity-70 mt-4"
            sx={{ marginTop: "10px" }}
          >
            {" "}
            Select Region
          </Typography>
          <SelectCountryStateCity
            selectedCountry={selectedCountry}
            selectedState={selectedState}
            selectedCity={selectedCity}
            setSelectedCountry={setSelectedCountry}
            setSelectedState={setSelectedState}
            setSelectedCity={setSelectedCity}
            forEditClient={forEditClient}
            countryString={clientData.address.country}
            stateString={clientData.address.state}
            cityString={clientData.address.city}
          />
          <TextField
            margin="dense"
            id="postalCode"
            label="Postal Code"
            type="text"
            fullWidth
            variant="standard"
            name="postalCode"
            value={clientData.address.postalCode}
            onChange={(e) => {
              setClientData({
                ...clientData,
                address: { ...clientData.address, postalCode: e.target.value },
              });
            }}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          {!forEditClient ? (
            <Button onClick={handleAddClientSubmit}>Add Client</Button>
          ) : (
            <Button onClick={handleEditClientSubmit}>Edit Client</Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
}
