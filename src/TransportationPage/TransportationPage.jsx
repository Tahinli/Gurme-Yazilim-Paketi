import React from "react";

import Navbar from "../HomePage/Navbar/Navbar";
import Footr from "../HomePage/Footer/Footr";
import TSide_Navbar from "./TransportationSidebar/TSide_Navbar";

import "../HomePage/Footer/footer.css";
import "../HomePage/Navbar/navbar.css";
import "./TransportationSidebar/tside_navbar.css";
import "./TContainer/tcontainer.css";

function datapage() {
  return (
  <div>
  <Navbar />
  <TSide_Navbar />
  <Footr />
</div>
)}

export default datapage;