import Navbar from "../Homepage/Navbar/Navbar";
import Footr from "../Homepage/Footer/Footr";
import SideNavbar from "../Homepage/Sidebar/SideNavbar";
import "../src/HomePage/Sidebar/SideNavbar.css";
import "../src/HomePage/Navbar/navbar.css";
import "../src/HomePage/Footer/footer.css";
import "../src/HomePage/Home/home.css";

const Homepage = () => {
  return (
    <div>
      <Navbar />
      <SideNavbar />
      <div className="content"></div>
      <Footr />
    </div>
  );
};

export default Homepage;
