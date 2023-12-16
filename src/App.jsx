import React from "react";
import "./App.css";

import Login from "../src/Login/Login";
import HomePage from "./HomePage/HomePage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import DataPage from "./DataPage/DataPage";
import Stockpage from "./Stockpage/stockpage";
import Transportationpage from "./Transportationpage/transportationpage";
import PrivateRoutes from "./PrivateRoute";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/data" element={<DataPage />} />
          <Route path="/stock" element={<Stockpage />} />
          <Route path="/transportation" element={<Transportationpage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
