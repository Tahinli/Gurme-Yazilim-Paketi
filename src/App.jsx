import "./App.css";
import Login from "../src/Login/Login";

import HomePage from "../src/HomePage/Homepage";


import { BrowserRouter, Route, Routes } from "react-router-dom";
import Datapage from "./Datapage/datapage";
import Stockpage from "./Stockpage/stockpage";
import Transportationpage from "./Transportationpage/transportationpage";
import { isVerified } from "./Login/Login";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/data" element={<Datapage />} />
          <Route path="/stock" element={<Stockpage />} />
          <Route path="/transportation" element={<Transportationpage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
