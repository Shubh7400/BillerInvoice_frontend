import React, { useContext } from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login/Login";
import Home from "../pages/Home/Home";
import PrivateRoute from "./PrivateRoute";
import Layout from "./Layout";
import ClientPage from "../components/Client_Component/ClientPage";
import ProjectPage from "../components/Project_Component/ProjectPage";
import InvoicePage from "../components/Invoice_Component/InvoicePage";
import ProfilePage from "../components/Profile_Components/ProfilePage";
import DashBoardPage from "../components/Dashboard_Component/DashBoardPage";
import AddClientPage from "../components/Client_Component/AddClientPage";
import AddProjectPage from "../components/Project_Component/AddProjectPage";
import { useSelector } from "react-redux";
import { AuthContext } from "../states/context/AuthContext/AuthContext";
import { RootState } from "../states/redux/store";

const AllRoutes = () => {
  const { isAuth, adminId } = useContext(AuthContext);
  const selectedClientState = useSelector(
    (state: RootState) => state.selectedClientState
  );
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <DashBoardPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/clients"
          element={
            <PrivateRoute>
              <ClientPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/add-client"
          element={
            <PrivateRoute>
              <AddClientPage forEditClient={false} clientToEdit={null} />
            </PrivateRoute>
          }
        />
        <Route
          path="/projects"
          element={
            <PrivateRoute>
              <ProjectPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/add-project"
          element={
            <PrivateRoute>
              <AddProjectPage
                clientId={selectedClientState.data._id}
                adminId={adminId}
                forAddProject={true}
              />
            </PrivateRoute>
          }
        />
        <Route
          path="/invoices"
          element={
            <PrivateRoute>
              <InvoicePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />
      </Route>
      <Route path="/login" element={<Login />} />
    </Routes>
  );
};

export default AllRoutes;
