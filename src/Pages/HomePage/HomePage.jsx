import Navbar from "./Navbar/Navbar";
import Footr from "./Footer/Footr";
import SideNavbar from "./Sidebar/SideNavbar";

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
