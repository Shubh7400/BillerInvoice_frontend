import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../states/redux/store";
import { AuthContext } from "../../states/context/AuthContext/AuthContext";
import { getAdminByIdAction } from "../../states/redux/AdminStates/adminSlice";
import { updateAdminByIdAction } from "../../states/redux/AdminStates/adminSlice";
import cubexoLogo from "../assets/cubexo_logo.png";
import gamaedgeLogo from "../../utils/images/gammaedgeLogo.png";
import { useNavigate } from "react-router-dom";
import { Button, TextField, Typography } from "@mui/material";
import { IoIosArrowBack } from "react-icons/io";
import { CiEdit } from "react-icons/ci";

const ProfilePage = () => {
  const { isAuth, adminId } = useContext(AuthContext);
  const navigate = useNavigate();
  const [companyLogo, setCompanyLogo] = useState<string>();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editableData, setEditableData] = useState<any>({});
  const [originalData, setOriginalData] = useState<any>({});
  const dispatch = useDispatch<AppDispatch>();

  const { loading, data, error } = useSelector(
    (state: RootState) => state.adminState
  );

  useEffect(() => {
    if (
      loading === "succeeded" &&
      adminId &&
      adminId === "6516a4ba98fd8b5ed365d5f4"
    ) {
      setCompanyLogo(gamaedgeLogo);
    } else if (loading === "succeeded" && adminId) {
      setCompanyLogo(cubexoLogo);
    }
  }, [loading, data, adminId]);

  useEffect(() => {
    if (isAuth && adminId) {
      dispatch(getAdminByIdAction(adminId));
    }
  }, [isAuth, adminId, dispatch]);

  useEffect(() => {
    if (data) {
      setEditableData({
        companyName: data.companyName || "",
        gistin: data.gistin || "",
        address: {
          street: data.address?.street || "",
          city: data.address?.city || "",
          state: data.address?.state || "",
          postalCode: data.address?.postalCode || "",
          country: data.address?.country || "",
        },
        contactNo: data.contactNo || "",
        email: data.email || "",
      });
      setOriginalData({
        companyName: data.companyName || "",
        gistin: data.gistin || "",
        address: {
          street: data.address?.street || "",
          city: data.address?.city || "",
          state: data.address?.state || "",
          postalCode: data.address?.postalCode || "",
          country: data.address?.country || "",
        },
        contactNo: data.contactNo || "",
        email: data.email || "",
      });
    }
  }, [data]);
  const [isHovered, setIsHovered] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let errorMsg = "";
  
    // Validation
    if (name === "email") {
      const emailRegex = /^(?!(?:(?:\.|\s|@).*@.*(?:\.|\s|@)))(?!.*\.\.)(?!.*@.*@)(?:(?:"(?:\\.|[^"\\])*")|(?:[^"().,:;<>@\[\]\s]+(?:\.[^"().,:;<>@\[\]\s]+)*))@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;
      if (!emailRegex.test(value)) errorMsg = "Invalid email format";
    }
  
    if (name === "contactNo") {
      const contactRegex = /^\d{10}$/;
      if (!contactRegex.test(value)) errorMsg = "Contact must be 10 digits";
    }
  
    if (name.startsWith("address.")) {
      if (name === "address.postalCode") {
        const postalCodeRegex = /^[1-9][0-9]{5}$/;
        if (!postalCodeRegex.test(value)) {
          errorMsg = "Invalid Postal Code (6 digits required)";
        }
      } else if (name === "address.country") {
        const countryRegex =
          /^(?!.*\d)(?!.*[@!#$%^&*()_+={}\[\]:;"'<>,.?/\\|`~])(?!.*\s{2,})[a-zA-Z\s]{2,60}$/;
        if (!countryRegex.test(value)) {
          errorMsg = "Invalid Country.";
        }
      } else if (name === "address.state") {
        const stateRegex =
          /^(?!.*\d)(?!.*[@!#$%^*()_+={}\[\]:;"'<>,.?/\\|`~])(?!.*\s{2,})[a-zA-ZÀ-ÖØ-öø-ÿ\s-]{2,50}$/;
        if (!stateRegex.test(value)) {
          errorMsg = "Invalid State.";
        }
      } else if (name === "address.city") {
        const cityRegex =
          /^(?!.*\d)(?!.*[@!#$%^*()_+={}\[\]:;"'<>,?/\\|`~])(?!.*\s{2,})[a-zA-ZÀ-ÖØ-öø-ÿ\s.'-]{2,80}$/;
        if (!cityRegex.test(value)) {
          errorMsg = "Invalid City.";
        }
      } else if (name === "address.street") {
        const streetRegex =
          /^(?!.*[@!#$%^*()_+={}\[\]:;"'<>,?/\\|`~])(?!.*\s{2,})[a-zA-Z0-9À-ÖØ-öø-ÿ\s.'-]{2,100}$/;
        if (!streetRegex.test(value)) {
          errorMsg = "Invalid Street.";
        }
      }
    } else if (name === "companyName") {
      const companyNameRegex =
        /^(?!.*[@!#$%^*()_+={}\[\]:;"'<>,.?/\\|`~])(?!.*\s{2,})[a-zA-Z0-9&.\-' ]{2,100}$/;
      if (!companyNameRegex.test(value)) {
        errorMsg = "Invalid Company Name.";
      }
    } else if (name === "gistin") {
      const gstRegex =
        /^\d{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/;
      if (!gstRegex.test(value)) errorMsg = "Invalid GSTIN format";
    }
  
    setErrors((prev: any) => ({ ...prev, [name]: errorMsg }));
  
    // Update state only if no error
    if (name.includes("address.")) {
      const [_, key] = name.split(".");
      setEditableData((prev: any) => ({
        ...prev,
        address: { ...prev.address, [key]: value },
      }));
    } else {
      setEditableData((prev: any) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    if (!adminId) {
      console.error("Admin ID is required but is null or undefined.");
      return;
    }

    try {
      const updatedData = await dispatch(
        updateAdminByIdAction({ adminId, updateData: editableData })
      ).unwrap();
      dispatch(getAdminByIdAction(adminId)); // Fetch the latest data after update
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating admin:", error);
    }
  };
  const handleCancel = () => {
    setEditableData(originalData); // Reset data to original state
    setIsEditing(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setEditableData((prev: any) => ({
          ...prev,
          companyLogo: reader.result, // Store the image as a base64 string for preview
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  
  return (
    <div>
      <div className="flex justify-between items-center pb-[10]">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="text-white text-[20px] bg-[#E4A98A] w-[35px] h-[35px] flex justify-center items-center rounded-[50px]"
          >
            <IoIosArrowBack />
          </button>
          <Typography variant="h5" component="h2" className="text-center">
            PROFILE
          </Typography>
        </div>
      </div>
      {data ? (
        <div className="text-black p-4 relative border-2 border-[#c1c1c1] rounded-[20px] mt-[15px]">
          <div className="absolute right-[20px]">
            {!isEditing && (
              <button
                onClick={(e) => setIsEditing(true)}
                className="text-white text-[20px] bg-[#E4A98A] w-[35px] h-[35px] flex justify-center items-center rounded-[50px]"
              >
                <CiEdit />
              </button>
            )}
          </div>
          <div className="bg-slate-100 flex justify-start items-center rounded-[15px] h-auto w-[200px] p-2">
            <img
              src={data.companyLogo}
              alt="Company Logo"
              className="h-auto w-[200px]"
            />
          </div>
          <div className="text-black pt-5">
            {isEditing ? (
              <>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e)}
                  className="mb-4"
                />
                <TextField
                  label="Company Name"
                  name="companyName"
                  value={editableData.companyName}
                  onChange={handleInputChange}
                  error={!!errors.companyName}
                  helperText={errors.companyName}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="GSTIN"
                  name="gistin"
                  value={editableData.gistin}
                  onChange={handleInputChange}
                  error={!!errors.gistin}
                  helperText={errors.gistin}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Street"
                  name="address.street"
                  value={editableData.address.street}
                  onChange={handleInputChange}
                  error={!!errors["address.street"]}
                  helperText={errors["address.street"]}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="City"
                  name="address.city"
                  value={editableData.address.city}
                  onChange={handleInputChange}
                  error={!!errors["address.city"]}
                  helperText={errors["address.city"]}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="State"
                  name="address.state"
                  value={editableData.address.state}
                  onChange={handleInputChange}
                  error={!!errors["address.state"]}
                  helperText={errors["address.state"]}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Postal Code"
                  name="address.postalCode"
                  value={editableData.address.postalCode}
                  onChange={handleInputChange}
                  error={!!errors["address.postalCode"]}
                  helperText={errors["address.postalCode"]}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Country"
                  name="address.country"
                  value={editableData.address.country}
                  onChange={handleInputChange}
                  error={!!errors["address.country"]}
                  helperText={errors["address.country"]}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Contact"
                  name="contactNo"
                  value={editableData.contactNo}
                  onChange={handleInputChange}
                  error={!!errors.contactNo}
                  helperText={errors.contactNo}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Email"
                  name="email"
                  value={editableData.email}
                  onChange={handleInputChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  fullWidth
                  margin="normal"
                />

                <div className="flex gap-2 mt-4">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSave}
                    style={{
                      backgroundColor: isHovered ? "#4a6180" : "#d9a990",
                      borderRadius: "20px",
                      padding: "5px 15px",
                      color: "#fff ",
                      marginTop: "10px",
                    }}
                  >
                    Save
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleCancel}
                    style={{
                      backgroundColor: isHovered ? "#4a6180" : "#d9a990",
                      borderRadius: "20px",
                      padding: "5px 15px",
                      color: "#fff ",
                      marginTop: "10px",
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-2xl font-semibold">{data.companyName}</h3>
                <div className="text-black opacity-70 flex flex-col justify-start gap-1">
                  <p className="mt-2">
                    <b>Gstin: </b>
                    {data.gistin}
                  </p>
                  <b>Address: </b> <p>{data.address?.street}</p>
                  <p>
                    {data.address
                      ? `${data.address.city} ${data.address.state}`
                      : null}
                  </p>
                  <p>
                    {data.address
                      ? `${data.address.postalCode} - ${data.address.country}`
                      : null}
                  </p>
                  <b>
                    <b>Contact No: </b>
                    {data.contactNo}
                  </b>
                  <p>
                    <b>Email: </b>
                    {data.email}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        "Loading..."
      )}
    </div>
  );
};

export default ProfilePage;
