import React from "react";

import Navbar from "../Homepage/Navbar/Navbar";
import Footr from "../Homepage/Footer/Footr";
import SendSide_Navbar from "./SendingSidebar/SendSide_Navbar";

import "../HomePage/Footer/footer.css";
import "../HomePage/Navbar/navbar.css";
import "../SendingPage/SendingSidebar/sendside_navbar.css";
import "../SendingPage/SendContainer/scontainer.css";

function sendingpage() {
  return (
  <div>
  <Navbar />
  <SendSide_Navbar/>
  <Footr />
</div>
)}

export default sendingpage;
