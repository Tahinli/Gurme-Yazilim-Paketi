import React from "react";

import Navbar from "../Homepage/Navbar/Navbar";
import Footr from "../Homepage/Footer/Footr";
import DSide_Navbar from "./DataSidebar/DSide_Navbar";

import "../HomePage/Footer/footer.css";
import "../HomePage/Navbar/navbar.css";
import "../Datapage/DataSidebar/dside_navbar.css";
import "../Datapage/DContainer/dcontainer.css";

function datapage() {
  return (
  <div>
  <Navbar />
  <DSide_Navbar />
  <Footr />
</div>
)}

export default datapage;
