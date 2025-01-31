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
import SelectCountryStateCity from "./Compo_CountrySelect";
import { Alert, LinearProgress, Typography } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { AuthContext } from "../../states/context/AuthContext/AuthContext";
import {
  editClientAction,
  makeStateLoadingNeutralInEditClient,
} from "../../states/redux/ClientStates/editClientSlice";
import { getAllClientsByAdminIdAction } from "../../states/redux/ClientStates/allClientSlice";
import { getClientByIdAction } from "../../states/redux/ClientStates/selectedClientSlice";
import "react-phone-number-input/style.css";
import "../../styles/addClient.css";
import { useNavigate } from "react-router-dom";
import { IoChevronBackSharp } from "react-icons/io5";
import { deleteEmailAction } from "../../states/redux/ClientStates/removeClientEmailSlice";
export default function AddClientPage({
  forEditClient,
  clientToEdit,
}: {
  forEditClient: boolean;
  clientToEdit: ClientType | null;
  handleSelectClientClose?: () => void | undefined;
}) {
  const { adminId } = React.useContext(AuthContext);
  const [controlEditLoading, setControlEditLoading] = useState(false);

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
      postalCode: "",
    },
    user: "",
    contactNo: "",
  });

  const {
    loading: clientsLoading,
    data: clients,
    error: clientsError,
  } = useSelector((state: RootState) => state.allClientsState);

  const clientsArr: ClientType[] = clients.map((client) => ({
    _id: client._id,
    clientName: client.clientName,
    email: client.email,
    pancardNo: client.pancardNo,
    address: {
      street: client.address.street,
      city: client.address.city,
      state: client.address.state,
      country: client.address.country,
      postalCode: client.address.postalCode,
    },
    gistin: client.gistin,
    user: client.user,
    sameState: client.sameState,
    contactNo: client.contactNo,
  }));

  const [inputEmail, setInputEmail] = useState("");
  const emailRegex = /^(?!(?:(?:\.|\s|@).*@.*(?:\.|\s|@)))(?!.*\.\.)(?!.*@.*@)(?:(?:"(?:\\.|[^"\\])*")|(?:[^"().,:;<>@\[\]\s]+(?:\.[^"().,:;<>@\[\]\s]+)*))@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;

  const [emailError, setEmailError] = useState("");
  const [postalCodeError, setPostalCodeError] = useState("");
  const [gstNumberError, setGstNumberError] = useState("");
  const [panNumberError, setPanNumberError] = useState<string | null>(null);
  const [contactNoError, setContactNoError] = useState<string>("");
  const [clientNameError, setClientNameError] = useState<string>("");
  const [streetError, setStreetError] = useState<string | null>(null);
  
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

    if (name === "clientName") {
      const clientNameRegex = /^[a-zA-Z\s]{2,50}$/;
      if (!clientNameRegex.test(value)) {
        setClientNameError(
          "Invalid Client Name. Only letters and spaces allowed, 2-50 characters."
        );
      } else if (
        clientsArr.some(
          (client) =>
            client.clientName.trim().toLowerCase() === value.trim().toLowerCase() &&
            client._id !== clientToEdit?._id 
        )
      ) {
        setClientNameError("Client name already exists.");
      } else {
        setClientNameError("");
      }   
      setClientData((prevData) => ({
        ...prevData,
        clientName: value,
      }));
    }
     else if (name === "street") {
      const streetRegex = /^[a-zA-Z0-9\s.,'-]{3,50}$/;
      if (!streetRegex.test(value)) {
        setStreetError("Street name must be 3-50 characters and only contain letters, numbers, spaces, ., ',', '-', or '.");
      } else {
        setStreetError("");
      }
      setClientData((prevData) => ({
        ...prevData,
        address: {
          ...prevData.address,
          street: value,
        },
      }));
    } else if (name === "postalCode") {
      const postalCodeRegex = /^[a-zA-Z0-9\s\-]{3,10}$/;
      if (!postalCodeRegex.test(value)) {
        setPostalCodeError("Invalid Postal Code");
      } else {
        setPostalCodeError("");
      }
      setClientData((prevData) => ({
        ...prevData,
        address: {
          ...prevData.address,
          postalCode: value,
        },
      }));
    } else if (name === "pancardNo") {
      const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
      if (value === "" || panRegex.test(value)) {
        setPanNumberError(null);
      } else {
        setPanNumberError("Invalid PAN Number");
      }
      setClientData((prevData) => ({
        ...prevData,
        pancardNo: value,
      }));
    } else if (name === "gistin") {
      const gstRegex =
        /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
      if (!gstRegex.test(value)) {
        setGstNumberError("Invalid GST Number Please Check the format.");
      } else {
        setGstNumberError("");
      }
      setClientData((prevData) => ({
        ...prevData,
        gistin: value,
      }));
    } else if (name === "contactNo") {
      const contactRegex = /^[0-9]{10}$/;
      if (!contactRegex.test(value)) {
        setContactNoError("Invalid Contact Number.");
      } else {
        setContactNoError("");
      }
      setClientData((prevData) => ({
        ...prevData,
        contactNo: value,
      }));
    } else {
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
        setClientData((prev) => ({
          ...prev,
          email: [...prev.email, inputEmail],
        }));
        setEmailError("");
        setInputEmail("");
      } else {
        setEmailError("This email has already been added.");
      }
    } else {
      setEmailError("Please enter a valid email.");
    }
  };


  const handleRemoveEmail = async (index:any) => {
    const emailToDelete = clientData.email[index];

    try {
      if (forEditClient) {
        const clientId = clientData._id;
        if (!clientId) return;
        setClientData((prev) => ({
          ...prev,
          email: prev.email.filter((_, i) => i !== index),
        }));
      } else {
        setClientData((prev) => ({
          ...prev,
          email: prev.email.filter((_, i) => i !== index),
        }));
      }
    } catch (error) {
      console.error("Error removing email:", error);
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

  function areAllFieldsFilled(obj: any) {
    for (const key in obj) {
      if (key === "pancardNo") {
        continue;
      }
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
    if (
      areAllFieldsFilled(clientData) &&
      areEntriesValid(clientData) &&
      !panNumberError &&
      !postalCodeError &&
      !gstNumberError &&
      !contactNoError &&
      !clientNameError &&
      !streetError &&
      !emailError
    ) {
      dispatch(addNewClientAction(clientData));
    } else {
      setIncompleteError("Incomplete fields");
    }
  };

  const handleEditClientSubmit = () => {
    if (
      areAllFieldsFilled(clientData) &&
      areEntriesValid(clientData) &&
      !panNumberError &&
      !postalCodeError &&
      !gstNumberError &&
      !contactNoError &&
      !clientNameError &&
      !streetError &&
      !emailError &&
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
      <div className="flex gap-3 items-center mb-5">
        <button
          onClick={() => navigate(-1)}
          className="text-[16px] flex items-center gap-[10px] text-[#fff] bg-[#d9a990] rounded-[20px] px-[10px] py-[10px] hover:bg-[#4a6180]"
        >
          <IoChevronBackSharp />
        </button>
        <Typography variant="h5">
          {forEditClient ? "Edit Client" : "Add Client"}
        </Typography>
      </div>
      {formError && <Alert severity="error">{formError}</Alert>}
      {incompleteError && <Alert severity="error">{incompleteError}</Alert>}
      {(addClientLoading === "pending" ||
        editClientState.loading === "pending") && <LinearProgress />}
      <TextField
        className="mb-2"
        label="Client Name"
        name="clientName"
        type="text"
        value={clientData.clientName}
        onChange={handleChange}
        onKeyDown={(e) => {
          if (e.key >= '0' && e.key <= '9') {
            e.preventDefault();
          }
        }}
        error={!!clientNameError && clientData.clientName !== ""}
        helperText={
          clientNameError && clientData.clientName !== "" ? clientNameError : ""
        }
        fullWidth
        required
      />

      <div className="flex flex-col gap-3 mt-3">
        <TextField
          fullWidth
          label="Enter email and press enter"
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

        {emailError && (
          <div style={{ color: "red", marginTop: 8 }}>{emailError}</div>
        )}
        {clientData.email.length > 0 && (
          <Box display="flex" flexWrap="wrap" gap={1} mt={2}>
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
      </div>
      <div className="flex gap-5 mt-3">
        <TextField
          className="w-[50%]"
          label="GST No."
          name="gistin"
          value={clientData.gistin}
          onChange={handleChange}
          error={!!gstNumberError && clientData.gistin !== ""}
          helperText={
            gstNumberError && clientData.gistin !== "" ? gstNumberError : ""
          }
          required
        />
        <TextField
          className="w-[50%]"
          label="PAN"
          name="pancardNo"
          value={clientData.pancardNo}
          onChange={handleChange}
          error={!!panNumberError && clientData.pancardNo !== ""}
          helperText={
            panNumberError && clientData.pancardNo !== "" ? panNumberError : ""
          }
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
          error={!!streetError && clientData.address.street !== ""}
          helperText={
            streetError && clientData.address.street !== "" ? streetError : ""
          }
        />
      </div>

      {clientData && (
        <SelectCountryStateCity
          selectedCountry={selectedCountry}
          selectedState={selectedState}
          selectedCity={selectedCity}
          setSelectedCountry={setSelectedCountry}
          setSelectedState={setSelectedState}
          setSelectedCity={setSelectedCity}
          forEditClient={forEditClient}
          countryString={clientData?.address.country}
          stateString={clientData.address.state}
          cityString={clientToEdit?.address?.city}
        />
      )}

      <div className="flex gap-5 mt-3">
        <TextField
          className="w-[100%]"
          label="PostalCode"
          fullWidth
          name="postalCode"
          value={clientData.address.postalCode}
          onChange={handleChange}
          error={!!postalCodeError && clientData.address.postalCode !== ""}
          helperText={
            postalCodeError && clientData.address.postalCode !== ""
              ? postalCodeError
              : ""
          }

        />
      </div>

      <div className="flex gap-5 mt-3">
        <TextField
          className="w-[100%]"
          label="Contact No"
          fullWidth
          name="contactNo"
          value={clientData.contactNo}
          onChange={handleChange}
          onKeyDown={(e) => {
            if (
              !(
                (e.key >= '0' && e.key <= '9') ||
                e.key === 'Backspace' ||
                e.key === 'ArrowLeft' ||
                e.key === 'ArrowRight' ||
                e.key === 'Delete' ||
                e.key === 'Tab'
              )
            ) {
              e.preventDefault();
            }
          }}
          error={!!contactNoError && clientData.contactNo !== ""}
          helperText={
            contactNoError && clientData.contactNo !== "" ? contactNoError : ""
          }
          required
        />
      </div>

      <div className="flex justify-end">
        <Button
          onClick={() => {
            (forEditClient ? handleEditClientSubmit : handleAddClientSubmit)();
            if (
              !panNumberError &&
              !postalCodeError &&
              !gstNumberError &&
              !formError &&
              !contactNoError &&
              !clientNameError &&
              !streetError &&
              !emailError &&
              areAllFieldsFilled(clientData) &&
              areEntriesValid(clientData)
            ) {
              setTimeout(() => {
                navigate(-1);
              }, 600);
            }
          }}
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
