import Navbar from "../Homepage/Navbar/Navbar";
import Footr from "../Homepage/Footer/Footr";
import SideNavbar from "../Homepage/Sidebar/SideNavbar";

import "../HomePage/Footer/footer.css";
import "../HomePage/Navbar/navbar.css";
import "../HomePage/Sidebar/sideNav.css";
import "./Container/container.css";

const Homepage = () => {
  return (
    <div>
      <Navbar />
      <SideNavbar />
      <Footr />
    </div>
  );
};

export default Homepage;
