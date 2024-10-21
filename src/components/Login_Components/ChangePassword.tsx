import { Alert, LinearProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import styles from "../../pages/Login/Login.module.css";
import { LoginDataType, NewPasswordType } from "../../types/types";
import { useResetPassword } from "../../states/query/ChangePassword_queries/changePasswordQueries";
import { enqueueSnackbar } from "notistack";

function ChangePassword({
  email,
  handleSetOtpVerified,
}: {
  email: string;
  handleSetOtpVerified: (value: boolean) => void;
}) {
  const [invalidError, setInvalidError] = useState("");
  const [componentLoading, setComponentLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [newAuthData, setNewAuthData] = useState<LoginDataType>({
    email: "",
    password: "",
  });
  const [newPasswordData, setNewPasswordData] = useState<NewPasswordType>({
    newPassword: "",
    confirmNewPassword: "",
  });

  useEffect(() => {
    if (email.length >= 5) {
      setNewAuthData({ ...newAuthData, email: email });
    } else {
      enqueueSnackbar({
        message: "Error in reset password! Try again",
        variant: "error",
      });
      handleSetOtpVerified(false);
    }
  }, []);

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInvalidError("");
    const { name, value } = e.target;
    setNewPasswordData({ ...newPasswordData, [name]: value });
    if (name === "newPassword") {
      setNewAuthData({ ...newAuthData, password: value });
    }
  };

  const bothPasswordValid = ({
    newPassword,
    confirmNewPassword,
  }: NewPasswordType) => {
    if (newPassword.length < 6) {
      return {
        message: "Password length must more then 6 digit",
        isValid: false,
      };
    } else if (/\s/.test(newPassword)) {
      return {
        message: "Password invalid, spaces not allowed",
        isValid: false,
      };
    } else if (newPassword !== confirmNewPassword) {
      return { message: "Password not match", isValid: false };
    }
    return { message: "", isValid: true };
  };

  const ResetPasswordMutationHandler = useResetPassword();
  const handleNewPasswordSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { message, isValid } = bothPasswordValid(newPasswordData);
    if (isValid) {
      setNewAuthData({ ...newAuthData, password: newPasswordData.newPassword });
      setInvalidError("");
      setComponentLoading(true);
      ResetPasswordMutationHandler.mutate(newAuthData, {
        onSuccess: () => {
          enqueueSnackbar({
            message: "Password changed successfully, login to proceed",
            variant: "success",
          });
          handleSetOtpVerified(false);
        },
        onError: () => {
          enqueueSnackbar({
            message: "Error in reset password! Try again.",
            variant: "error",
          });
        },
        onSettled: () => {
          setComponentLoading(false);
        },
      });
    } else {
      setInvalidError(message);
    }
  };
  return (
    <div className={styles.loginDiv}>
      <h1 className="text-3xl mb-5">Change Password</h1>
      <hr />
      <p className="text-slate-500 ">
        If you have an account, sign in with email address. In case of any
        signing issue, please use Forgot Password link.
      </p>

      <form
        onSubmit={(e) => {
          handleNewPasswordSubmit(e);
        }}
      >
        {invalidError.length > 0 ? (
          <Alert severity="error">{invalidError}</Alert>
        ) : null}
        {componentLoading ? <LinearProgress /> : null}
        <div className={styles.loginPasswordDiv}>
          <label htmlFor="newPassword">New Password:</label>
          <br />
          <input
            type={showPassword ? "text" : "password"}
            id="newPassword"
            placeholder="Enter new password"
            name="newPassword"
            required
            onChange={(e) => handleNewPasswordChange(e)}
          />
          <div
            className={styles.showPassEyeDiv}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
          </div>
        </div>
        <div className={styles.loginPasswordDiv}>
          <label htmlFor="confirmNewPassword">Confirm Password:</label>
          <br />
          <input
            type={showPassword ? "text" : "password"}
            id="confirmNewPassword"
            placeholder="Confirm password"
            name="confirmNewPassword"
            required
            onChange={(e) => handleNewPasswordChange(e)}
          />
          <div
            className={styles.showPassEyeDiv}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
          </div>
        </div>

        <button
          className="bg-thirdColor py-2 px-4 cursor-pointer text-[whitesmoke] border-none hover:bg-colorMediumDark "
          type="submit"
        >
          Change Password
        </button>
      </form>
      <button
        onClick={() => handleSetOtpVerified(false)}
        id={styles.forgetPasswordBtn}
      >
        Back to login.
      </button>
    </div>
  );
}

export default ChangePassword;
