import Navbar from "../HomePage/Navbar/Navbar";
import Footr from "../HomePage/Footer/Footr";
import SideNavbar from "../HomePage/Sidebar/SideNavbar";

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
