import React, { useContext, useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";

const PrivateRoutes = () => {
  const response = fetch("http://localhost:5000/verify", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  return response.status == 200 ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
