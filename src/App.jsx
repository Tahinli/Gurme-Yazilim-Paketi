import "./App.css";
import Login from "../src/Login/Login";

import HomePage from "../src/HomePage/Homepage";

import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/" element={<HomePage />} />

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
