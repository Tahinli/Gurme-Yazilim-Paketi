import React from "react";
import "./App.css";

import Login from "./Pages/LoginPage/Login";
import HomePage from "./Pages/HomePage/HomePage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import DataPage from "./Pages/DataPage/DataPage";
import StockPage from "./Pages/StockPage/StockPage";
import TransportationPage from "./Pages/TransportationPage/TransportationPage";
import PrivateRoutes from "./PrivateRoute";
import ProductPage from "./Pages/ProductPage/ProductPage";
import ProductPageAnalyze from "./Charts/ProductAnalyzePage/ProductAnalyzePage";

import UserPage from "./Pages/UserControlPage/UserControlPage";
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/Products/*" element={ <ProductPageAnalyze/>}></Route>
          <Route element={<PrivateRoutes />}>
            <Route path="/user" element={<UserPage />} />
            <Route path="/data" element={<DataPage />} />
            <Route path="/product" element={<ProductPage />} />
            <Route path="/stock" element={<StockPage />} />
            <Route path="/transportation" element={<TransportationPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
