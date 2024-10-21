import React, { useEffect } from "react";
import styles from "./Login.module.css";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AiOutlineEyeInvisible } from "react-icons/ai";
import { AiOutlineEye } from "react-icons/ai";
import { useLoginMutation } from "../../states/query/Login_queries/loginQueries";
import { AuthContext } from "../../states/context/AuthContext/AuthContext";
import { validateToken } from "../../states/context/AuthContext/validateToken";
import { Alert, LinearProgress } from "@mui/material";
import { MuiOtpInput } from "mui-one-time-password-input";
import {
  useVerifyEmailToGenerateOtp,
  useVerifyOtp,
} from "../../states/query/ChangePassword_queries/changePasswordQueries";
import { enqueueSnackbar } from "notistack";
import ChangePassword from "../../components/Login_Components/ChangePassword";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [logoutExecuted, setLogoutExecuted] = useState(false);
  const [startChangePassword, setStartChangePassword] = useState(false);
  const [otpData, setOtpData] = useState({ email: "", otp: "" });
  const [otp, setOtp] = useState("");
  const [requestLiteral, setRequestLiteral] = useState("Send Otp");
  const [startTimer, setStartTimer] = useState(false);
  const [invalidError, setInvalidError] = useState("");
  const [timer, setTimer] = useState(180);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const { isAuth, setIsAuth, adminId, setAdminId, setAdminData, logoutAdmin } =
    useContext(AuthContext);
  const [authData, setAuthData] = useState({ email: "", password: "" });

  useEffect(() => {
    const validateTokenFunction = async () => {
      const result = await validateToken();
      if (result.validation && result.adminId) {
        setIsAuth(true);
        setAdminId(result.adminId);
      }
    };
    validateTokenFunction();
  }, []);

  useEffect(() => {
    const validateTokenFunction = async () => {
      const result = await validateToken();
      if (result.validation && result.adminId) {
        setIsAuth(true);
        setAdminId(result.adminId);
      }
    };
    validateTokenFunction();
  }, [isAuth]);

  useEffect(() => {
    let interval: any;

    if (startTimer) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [startTimer]);

  useEffect(() => {
    if (timer === 0) {
      setStartTimer(false);
      setRequestLiteral("Resend Otp");
    }
  }, [timer]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("changeing authData-login", authData);
    setInvalidError("");
    const { name, value } = e.target;
    setAuthData({ ...authData, [name]: value });
  };

  const LoginMutationHandler = useLoginMutation();
  const { isLoading, isError, isSuccess, data } = LoginMutationHandler;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    LoginMutationHandler.mutate(authData, {
      onSuccess: (data) => {
        setAdminData(data.userDto);
        // setAdminId(data.uerDto.id) say yashraj to send id as well
        setIsAuth(true);
      },
      onError: (error) => {
        console.log("Error in login", error);
      },
    });
  };

  const handleLogout = () => {
    setLogoutExecuted(true);
    logoutAdmin();
  };

  const handleOtpDataChange = (
    e: React.ChangeEvent<HTMLInputElement> | string
  ) => {
    setInvalidError("");
    if (typeof e == "string") {
      setOtpData({ ...otpData, otp: e });
      setOtp(e);
    } else {
      setOtpData({ ...otpData, email: e.target.value });
    }
  };
  console.log("otpData--->", otpData);

  const handleStartChangePassword = () => {
    setOtpData({ ...otpData, email: "", otp: "" });
    setAuthData({ ...authData, email: "", password: "" });
    setOtp("");
    setRequestLiteral("Send Otp");
    setStartChangePassword(!startChangePassword);
  };

  function isValidEmail(email: string) {
    const pattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (email.length <= 0 || email.length > 50) {
      return false;
    } else if (/\s/.test(email)) {
      // check for white space
      return false;
    } else if (!pattern.test(email)) {
      return false;
    }
    return true;
  }

  const GenerateOtpMutationHandler = useVerifyEmailToGenerateOtp();
  const handleSentOtpCommand = () => {
    if (isValidEmail(otpData.email)) {
      setOtpLoading(true);
      console.log(otpData.email);
      GenerateOtpMutationHandler.mutate(otpData.email, {
        onSuccess: () => {
          enqueueSnackbar({
            message: "Otp sent successfully check email",
            variant: "success",
          });
          setTimer(180);
          setStartTimer(true);
        },
        onError: () => {
          enqueueSnackbar({
            message: "Error in sending otp try again!",
            variant: "error",
          });
        },
        onSettled: () => {
          setOtpLoading(false);
        },
      });
    } else {
      setInvalidError("Email format not valid");
    }
  };

  const VerifyOtpMutationHandler = useVerifyOtp();
  const handleOtpComplete = (
    e: React.FormEvent<HTMLFormElement>,
    otpData: { email: string; otp: string }
  ) => {
    e.preventDefault();
    if (isValidEmail(otpData.email) && otp.length === 6) {
      setStartTimer(false);
      setRequestLiteral("Resend Otp");
      setOtpLoading(true);
      VerifyOtpMutationHandler.mutate(otpData, {
        onSuccess: () => {
          enqueueSnackbar({
            message: "Otp verified successfully",
            variant: "success",
          });
          setOtpVerified(true);
        },
        onError: () => {
          enqueueSnackbar({
            message: "Error in verifying otp, try again!",
            variant: "error",
          });
        },
        onSettled: () => {
          setOtpLoading(false);
        },
      });
    } else {
      setInvalidError("Email or otp length invalid");
    }
  };

  const handleSetOtpVerified = (value: boolean) => {
    setOtpVerified(value);
    // setOtpData({ ...otpData, email: "", otp: "" });
    // setAuthData({ ...authData, email: "", password: "" });
    // setOtp("");
    // setRequestLiteral("Send Otp");
    // setStartChangePassword(false);
    window.location.reload();
  };

  if (isAuth) {
    return <Navigate to={"/"} />;
  }

  return (
    <div className="md:flex h-screen m-0 p-0  ">
      <div className={styles.loginSignupDiv}>
        {!otpVerified ? (
          <div className={styles.loginDiv}>
            <h1 className="text-3xl mb-5">
              {startChangePassword ? "Verify Otp" : "Admin Login"}
            </h1>
            <hr />
            {!isAuth && startChangePassword ? (
              <p className="text-slate-500   ">
                Verify your registered email address to receive otp, and proceed
                to create new password.
              </p>
            ) : !isAuth ? (
              <p className="text-slate-500 ">
                If you have an account, sign in with email address. In case of
                any signing issue, please use Forgot Password link.
              </p>
            ) : (
              <p>Contact developer to add new admin</p>
            )}
            {isAuth ? (
              <button id={styles.logoutBtn} onClick={() => handleLogout()}>
                Logout
              </button>
            ) : (
              <form
                onSubmit={(e) => {
                  !startChangePassword
                    ? handleSubmit(e)
                    : handleOtpComplete(e, otpData);
                }}
              >
                {invalidError.length > 0 ? (
                  <Alert severity="error">{invalidError}</Alert>
                ) : null}
                {otpLoading ? <LinearProgress /> : null}
                {isError && !startChangePassword ? (
                  <Alert severity="error">
                    User with give email or password not found! Try using right
                    email and password.
                  </Alert>
                ) : null}
                {isLoading ? <LinearProgress /> : null}
                <label htmlFor="email">Email:</label>
                <br />
                {!startChangePassword ? (
                  <input
                    type="email"
                    id="email"
                    placeholder="Enter email"
                    name="email"
                    required
                    value={authData.email}
                    onChange={(e) => handleChange(e)}
                  />
                ) : (
                  <>
                    <input
                      type="email"
                      id="otpEmail"
                      placeholder="Enter email"
                      name="otpEmail"
                      required
                      value={otpData.email}
                      onChange={(e) => handleOtpDataChange(e)}
                    />
                    {!startTimer && !otpLoading ? (
                      <div
                        onClick={handleSentOtpCommand}
                        className="text-sm cursor-pointer text-indigo-700 mb-4 "
                      >
                        {requestLiteral}
                      </div>
                    ) : (
                      <div className="text-sm text-red-600 mb-4">
                        {timer} sec.
                      </div>
                    )}
                  </>
                )}
                {!startChangePassword ? (
                  <div className={styles.loginPasswordDiv}>
                    <label htmlFor="password">Password:</label>
                    <br />
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      placeholder="Enter password"
                      name="password"
                      required
                      onChange={(e) => handleChange(e)}
                    />
                    <div
                      className={styles.showPassEyeDiv}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <AiOutlineEye />
                      ) : (
                        <AiOutlineEyeInvisible />
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="sm:w-[70%]">
                    <label htmlFor="otpBoxes">Enter Otp:</label>
                    <div className=" mt-2 mb-8 ">
                      <MuiOtpInput
                        id="otpBoxes"
                        length={6}
                        onComplete={(e) => handleOtpComplete}
                        value={otp}
                        onChange={(e) => handleOtpDataChange(e)}
                      />
                    </div>
                  </div>
                )}
                {!isAuth && startChangePassword ? (
                  <button
                    className="bg-thirdColor py-2 px-4 cursor-pointer text-[whitesmoke] border-none hover:bg-colorMediumDark "
                    type="submit"
                  >
                    Verify Otp
                  </button>
                ) : !isAuth ? (
                  <button
                    className="bg-thirdColor py-2 px-5 cursor-pointer text-[whitesmoke] border-none hover:bg-colorMediumDark "
                    type="submit"
                  >
                    Login
                  </button>
                ) : null}
              </form>
            )}
            <div className=" mt-4">
              {!startChangePassword ? (
                <button
                  onClick={handleStartChangePassword}
                  id={styles.forgetPasswordBtn}
                >
                  Forget password ?
                </button>
              ) : (
                <button
                  onClick={handleStartChangePassword}
                  id={styles.forgetPasswordBtn}
                >
                  Back to login.
                </button>
              )}
            </div>
          </div>
        ) : (
          <ChangePassword
            email={otpData.email}
            handleSetOtpVerified={handleSetOtpVerified}
          />
        )}
      </div>
      <div className=" bg-[#989fce] text-colorDarkFont dark:text-colorLightFont dark:bg-slate-800 md:w-2/3 sm:h-40 md:h-auto p-4 md:p-24 text-3xl md:text-6xl flex justify-start items-center md:flex-col m-0  ">
        <div className="flex flex-col gap-4 md:gap-8">
          <p>Your</p>
          <p>Personal</p>
          <p>
            <mark className="p-1 px-8 rounded-md bg-thirdColor ">Billing</mark>
          </p>
          <p>Patner</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
