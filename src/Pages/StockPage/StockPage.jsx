import React from "react";

import Navbar from "../HomePage/Navbar/Navbar";
import Footr from "../HomePage/Footer/Footr";
import SSide_Navbar from "./StockSidebar/SSide_Navbar";

import "../HomePage/Footer/footer.css";
import "../HomePage/Navbar/navbar.css";
import "./StockSidebar/sside_navbar.css";
import "./SContainer/scontainer.css";

function datapage() {
  return (
  <div>
  <Navbar />
  <SSide_Navbar />
  <Footr />
</div>
)}

export default datapage;