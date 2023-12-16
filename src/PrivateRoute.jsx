import React, { useContext, useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import URL from "../URL";
const PrivateRoutes = () => {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(URL + "/verify", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      setStatus(response.status);
    };

    fetchData();
  }, []);

  if (status === null) {
    return <div>Loading...</div>;
  }

  return status === 200 ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
