import React from "react";
import "./App.css";

import Login from "./LoginPage/Login";
import HomePage from "./HomePage/HomePage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import DataPage from "./DataPage/DataPage";
import StockPage from "./StockPage/StockPage";
import TransportationPage from "./TransportationPage/TransportationPage";
import PrivateRoutes from "./PrivateRoute";

import UserPage from "./UserControlPage/UserControlPage";
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/user" element={<UserPage />} />
          <Route element={<PrivateRoutes />}>
            <Route path="/data" element={<DataPage />} />
            <Route path="/stock" element={<StockPage />} />
            <Route path="/transportation" element={<TransportationPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
