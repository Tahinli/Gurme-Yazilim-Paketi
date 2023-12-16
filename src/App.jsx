import React from "react";
import "./App.css";
import Login from "./Login/Login";
import HomePage from "./HomePage/Homepage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Datapage from "./Datapage/datapage";
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
          <Route element={<PrivateRoutes />}>
            <Route path="/data" element={<Datapage />} />
            <Route path="/stock" element={<Stockpage />} />
            <Route path="/transportation" element={<Transportationpage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
