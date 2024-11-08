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
import bg_image from "../../components/assets/home_bg.png";
import companylogo from "../../components/assets/cubexo_logo.png";
import modale from "../../components/assets/modal.png";
import invoice from "../../components/assets/bill.png";
import handshake from "../../components/assets/handshake.png"

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
    <div className="md:flex h-screen m-0 p-0  "
    style={{
      // background: 'linear-gradient(-45deg, #95b3bf, #c6cdd3, #e5d8d9, #f1e1d9, #f3e1cd)',
      // background: "#dce5e4",
      backgroundImage:`url(${bg_image})`,
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
      minHeight: "100vh",
      overflow: "hidden",
    }}>
      <div className="bg-[#ebebeb2b] shadow-md backdrop-blur-sm w-[80%] h-[90%] flex items-center m-auto rounded-[20px]">
        <div className="md:flex w-[100%] p-0 ">
          

          <div className={styles.loginSignupDiv}>
            
          {!otpVerified ? (
            <div className={styles.loginDiv}>
              <div>
              <img src={companylogo} alt=""  className={styles.logo}/>
            </div>
              <div className="mx-auto mt-5 w-[82%] shadow-[0px_7px_29px_0px_rgba(100,100,111,0.2)] rounded-[20px] border border-[#f1f1f1] p-4 bg-white">
              <h1 className="text-3xl mb-2.5 ">
                {startChangePassword ? "Verify Otp" : "Admin Login"}
              </h1>
              <hr />
              {!isAuth && startChangePassword ? (
                <p className="text-slate-500   ">
                  
                </p>
              ) : !isAuth ? (
                <p className="text-slate-500 ">
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
                          sx={{
                            "& input": {
                              height: "40px",
                              width: "40px",
                              padding:"0"
                            },
                          }}
                        />
                      </div>
                    </div>
                  )}
                  {!isAuth && startChangePassword ? (
                    <button
                      className="bg-[#d9a990] py-2 px-4 cursor-pointer text-[whitesmoke] border-none hover:bg-[#4a6180] "
                      type="submit"
                    >
                      Verify Otp
                    </button>
                  ) : !isAuth ? (
                    <button
                      className="bg-[#d9a990] w-[100%] py-2 px-5 cursor-pointer text-[whitesmoke] border-none hover:bg-[#4a6180] "
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
            </div>
          ) : (
            <ChangePassword
              email={otpData.email}
              handleSetOtpVerified={handleSetOtpVerified}
            />
          )}
          </div>
          <div className={`${styles.animated} md:w-2/3 h-[90vh] p-4 md:p-24 text-3xl md:text-6xl   `}>
            <div className={`${styles.billing_title}  flex flex-col gap-4 md:gap-8`}>
              <p>Your</p>
              <p>Personal</p>
              <div className={styles.wrapper}>
                <h1 className={styles.typing_demo}>
                  Billing
                </h1>
              </div>
              <p>Patner</p>
            </div>
           
              <img src={modale} alt=""  className={styles.modal}/>
              <img src={invoice} alt=""  className={styles.invoice}/>
              <img src={handshake} alt=""  className={styles.handshake}/>
           
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
