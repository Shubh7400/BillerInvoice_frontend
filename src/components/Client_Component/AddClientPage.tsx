import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Chip, Box } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdOutlineClose } from "react-icons/md";
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
import SelectCountryStateCity from "../Home_Components/ClientSection/Compo_CountrySelect";
import { Alert, LinearProgress, Typography, useTheme } from "@mui/material";
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
import PhoneInput from "react-phone-number-input";
import { E164Number } from "libphonenumber-js/core";
import "../../styles/addClient.css";
import { Link } from "react-router-dom";
import { Outlet, useNavigate } from "react-router-dom";
import { IoChevronBackSharp } from "react-icons/io5";

export default function AddClientPage({
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
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

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
    email: [],
    pancardNo: "",
    gistin: "",
    address: {
      street: "",
      city: selectedCountry.name,
      state: selectedState.name,
      country: selectedCity.name,
      postalCode: "N/A",
    },
    user: "",
  });

  const [inputEmail, setInputEmail] = useState("");
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const [emailError, setEmailError] = useState("");

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
        message: "Client edited successfully",
        variant: "success",
      });
      setFormError("");
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
  }, [clientToEdit]);

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
      enqueueSnackbar({
        message: "Error in adding client. Try again!",
        variant: "error",
      });
      dispatch(makeStateLoadingNeutralInAddClient(true));
    }
  }, [addClientLoading, addClientError]);

  React.useEffect(() => {
    setClientData((prevData) => ({
      ...prevData,
      address: {
        ...prevData.address,
        country: selectedCountry.name || "",
        state: selectedState.name || "",
        city: selectedCity.name || "",
      },
    }));
  }, [selectedCountry, selectedState, selectedCity]);


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
  
    if (name === "street") {
      // Update nested field for address.street
      setClientData((prevData) => ({
        ...prevData,
        address: {
          ...prevData.address,
          street: value,
        },
      }));
    } else {
      // Handle other fields in clientData
      setClientData({
        ...clientData,
        [name]: value,
      });
    }
  
    setFormError("");
    setIncompleteError("");
  };
  

  const handleAddEmail = () => {
    if (inputEmail && emailRegex.test(inputEmail)) {
      if (!clientData.email.includes(inputEmail)) {
        setClientData((prev) => {
          const updatedEmails = [...prev.email, inputEmail];
          console.log(updatedEmails); // Log the updated email array
          return {
            ...prev,
            email: updatedEmails, // Update the clientData.email state
          };
        });
        setEmailError(""); // Clear any previous error
        setInputEmail(""); // Clear the input field
      } else {
        setEmailError("This email has already been added.");
      }
    } else {
      setEmailError("Please enter a valid email.");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setInputEmail(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddEmail();
    }
  };

  const handleRemoveEmail = (index: number) => {
    setClientData({
      ...clientData,
      email: clientData.email.filter((_, i) => i !== index),
    });
  };

  function areAllFieldsFilled(obj: any) {
    for (const key in obj) {
      if (key === "pancardNo") continue; // Skip PAN field validation
      if (typeof obj[key] === "object" && obj[key] !== null) {
        if (Array.isArray(obj[key])) {
          if (key === "email" && obj[key].length === 0) {
            return false; 
          }
        } else if (!areAllFieldsFilled(obj[key])) {
          return false;
        }
      } else if (obj[key] === "" || obj[key] === undefined) {
        return false;
      } 
    }
    return true;
  }

  function areEntriesValid(obj: any) {
    let clientNameTemp = obj.clientName.trim();
    if (clientNameTemp.length < 2) {
      setFormError("Client name minimum length is 2");
      return false;
    }
    return true;
  }

  const handleAddClientSubmit = () => {
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
    <div >
      <div className="flex justify-between items-center mb-5 " >
        <Typography variant="h5">
          {forEditClient ? "Edit Client" : "Add Client"}
        </Typography>
        <Link
          to="/clients"
          className=" text-[16px] flex items-center gap-[10px] text-[#fff]"
          style={{
            backgroundColor: "#d9a990",
            borderRadius: "20px",
            padding: "5px 10px",
          }}
        >
          <IoChevronBackSharp /> BACK
        </Link>
      </div>
      {formError && <Alert severity="error">{formError}</Alert>}
      {incompleteError && <Alert severity="error">{incompleteError}</Alert>}
      {(addClientLoading === "pending" ||
        editClientState.loading === "pending") && <LinearProgress />}
      <TextField
        className="mb-2"
        label="Client Name"
        name="clientName"
        value={clientData.clientName}
        onChange={handleChange}
        fullWidth
        required
      />
      <div className="flex flex-col gap-3 mt-3">
        <div className="p-4 border border-gray-300 rounded-lg">
          <h3 className="mb-2 text-gray-600">Email Addresses</h3>

          {/* Render only if there are emails in the array */}
          {clientData.email.length > 0 && (
            <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
              {clientData.email.map((email, index) => (
                <Chip
                  key={index}
                  label={email}
                  onDelete={() => handleRemoveEmail(index)}
                  deleteIcon={<MdOutlineClose />}
                  aria-label={`Remove ${email}`}
                />
              ))}
            </Box>
          )}

          <TextField
            fullWidth
            label="Enter email"
            value={inputEmail}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Add email and press Enter"
            aria-label="Enter email address"
            InputProps={{
              style: {
                marginTop: clientData.email.length > 0 ? 16 : 0,
                textAlign: "center", 
              },
            }}
          />

          {/* Error message below the input field */}
          {emailError && (
            <div style={{ color: "red", marginTop: 8 }}>{emailError}</div>
          )}
        </div>
      </div>
      <div className="flex gap-5 mt-3">
        <TextField
          className="w-[50%]"
          label="GST No."
          name="gistin"
          value={clientData.gistin}
          onChange={handleChange}
          required
        />
        <TextField
          className="w-[50%]"
          label="PAN"
          name="pancardNo"
          value={clientData.pancardNo}
          onChange={handleChange}
        />
      </div>
      <div className="flex gap-5 mt-3">
        <TextField
          className="w-[100%]"
          label="Street"
          fullWidth
          name="street"
          value={clientData.address.street}
          onChange={handleChange}
        />
      </div>

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
    
      <div className="flex justify-end">
        <Button
          onClick={
            forEditClient ? handleEditClientSubmit : handleAddClientSubmit
          }
          className=" text-[16px] flex items-center gap-[10px] text-[#fff]"
          style={{
            backgroundColor: isHovered ? "#4a6180" : "#d9a990",
            borderRadius: "20px",
            padding: "5px 15px",
            color: "#fff ",
            marginTop: "10px",
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {forEditClient ? "Edit Client" : "Add Client"}
        </Button>
      </div>
    </div>
  );
}
