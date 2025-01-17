import * as React from "react";
import Button from "@mui/material/Button";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux"; // Assuming you're using Redux
import {
  addNewClientAction,
  makeStateLoadingNeutralInAddClient,
} from "../../states/redux/ClientStates/addClientSlice";
import { AppDispatch, RootState } from "../../states/redux/store";
import {
  CityInfoType,
  ClientType,
  CountryInfoType,
  StateInfoType,
} from "../../types/types";
import { useTheme } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { AuthContext } from "../../states/context/AuthContext/AuthContext";
import { CiEdit } from "react-icons/ci";
import {
  editClientAction,
  makeStateLoadingNeutralInEditClient,
} from "../../states/redux/ClientStates/editClientSlice";
import { getAllClientsByAdminIdAction } from "../../states/redux/ClientStates/allClientSlice";
import { getClientByIdAction } from "../../states/redux/ClientStates/selectedClientSlice";
import "react-phone-number-input/style.css";
import "../../styles/addClient.css";
import { useNavigate } from "react-router-dom";

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
 
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleClickOpen = () => {
    if (clientToEdit && clientToEdit?._id) {
      dispatch(getClientByIdAction(clientToEdit._id));
      navigate("/edit-client");
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

 

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
    email: [""],
    pancardNo: "",
    gistin: "",
    address: {
      street: "",
      city: selectedCountry.name,
      state: selectedState.name,
      country: selectedCity.name,
      postalCode: "",
    },
    user: "",
    contactNo: "",
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
      dispatch(makeStateLoadingNeutralInAddClient(true));
      if (adminId) {
        dispatch(getAllClientsByAdminIdAction(adminId));
      }
      enqueueSnackbar({
        message: "Client added successfully",
        variant: "success",
      });
      setFormError("");
    } else if (addClientLoading === "failed") {
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
      setClientData({ ...clientData, email: [sanitisedEmail] });
    } else {
      setClientData({
        ...clientData,
        [name]: value,
      });
    }
    setFormError("");
    setIncompleteError("");
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
    </div>
  );
}
