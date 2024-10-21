import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import AuthContextProvider from "./states/context/AuthContext/AuthContext";
import { ThemeContextProvider } from "./states/context/ThemeContext/ThemeContext";
import { WindowWidthContextProvider } from "./states/context/WindowWidthContext/WindowWidthContext";
import { Provider } from "react-redux";
import { store } from "./states/redux/store";
import { SnackbarProvider } from "notistack";
import { ThemeProvider, createTheme } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
export const queryClient = new QueryClient();
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
const theme = createTheme({
  palette: {
    primary: {
      main: "#7873C9",
    },
    secondary: {
      main: "#6761cc",
    },
  },
});

root.render(
  <Provider store={store}>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <WindowWidthContextProvider>
          <ThemeContextProvider>
            <AuthContextProvider>
              <SnackbarProvider maxSnack={3}>
                <ThemeProvider theme={theme}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <App />
                  </LocalizationProvider>
                </ThemeProvider>
              </SnackbarProvider>
            </AuthContextProvider>
          </ThemeContextProvider>
        </WindowWidthContextProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
