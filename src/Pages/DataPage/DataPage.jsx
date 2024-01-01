import React from "react";

import Navbar from "../HomePage/Navbar/Navbar";
import Footr from "../HomePage/Footer/Footr";
import DSide_Navbar from "./DataSidebar/DSide_Navbar";

import "../HomePage/Footer/footer.css";
import "../HomePage/Navbar/navbar.css";
import "./DataSidebar/dside_navbar.css";
import "./DContainer/dcontainer.css";

function datapage() {
  return (
  <div>
  <Navbar />
  <DSide_Navbar />
  <Footr />
</div>
)}

export default datapage;
