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
import ProjectDetailPage from "../components/Project_Component/ProjectDetailPage";
import InvoiceMainPage from "../components/Invoice_Component/InvoiceMainPage";
import InvoiceListPage from "../components/Invoice_Component/InvoiceListPage";
import InvoiceClientPage from "../components/Invoice_Component/InvoiceClientPage";

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
          path="/edit-client"
          element={
            <PrivateRoute>
            selectedClientState  <AddClientPage forEditClient={true} clientToEdit={selectedClientState.data} />
            </PrivateRoute>
          }
        />
        <Route
          path="/client/details"
          element={
            <PrivateRoute>
              <ProjectPage projectTableforClient={true} />
            </PrivateRoute>
          }
        />
        <Route
          path="/projects"
          element={
            <PrivateRoute>
              <ProjectPage projectTableforClient={false} />
            </PrivateRoute>
          }
        />
        <Route
          path="/project/details"
          element={
            <PrivateRoute>
              <ProjectDetailPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/client/invoices"
          element={
            <PrivateRoute>
              <InvoiceClientPage />
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
          path="/edit-project"
          element={
            <PrivateRoute>
              <AddProjectPage
                clientId={selectedClientState.data._id}
                adminId={adminId}
                forAddProject={false}
              />
            </PrivateRoute>
          }
        />
        <Route
          path="/invoices"
          element={
            <PrivateRoute>
              <InvoiceMainPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/invoice/details"
          element={
            <PrivateRoute>
              <InvoiceListPage />
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
