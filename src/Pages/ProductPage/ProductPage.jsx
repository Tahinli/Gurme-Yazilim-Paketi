import React from "react";

import Navbar from "../HomePage/Navbar/Navbar";
import Footr from "../HomePage/Footer/Footr";
import PSide_Navbar from "./ProductSidebar/PSide_Navbar";

import "../HomePage/Footer/footer.css";
import "../HomePage/Navbar/navbar.css";
import "./PContainer/pcontainer.css";
import '../Responsive/mobile.css';
import '../Responsive/tablet.css';

const ProductPage = () => {
    return (
    <div>
        <Navbar />
        <PSide_Navbar/>
        <Footr />
      </div> 
      );
}
 
export default ProductPage;