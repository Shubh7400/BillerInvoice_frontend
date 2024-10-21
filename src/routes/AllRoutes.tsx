import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Login from "../pages/Login/Login";
import Home from "../pages/Home/Home";
import PrivateRoute from "./PrivateRoute";

const AllRoutes = () => {
  return (
    <Routes>
      <Route element={<Navbar />}>
        <Route
          index
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route path="login" element={<Login />} />
      </Route>
    </Routes>
  );
};

export default AllRoutes;
