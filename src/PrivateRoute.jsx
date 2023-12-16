import React, { useContext, useEffect } from "react";
import { AuthContext } from "./AuthProvider";
import { Outlet, Navigate } from "react-router-dom";

const PrivateRoutes = () => {
  const sessionValue = sessionStorage.getItem("auth");
  console.log(sessionValue);

  return sessionValue ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
