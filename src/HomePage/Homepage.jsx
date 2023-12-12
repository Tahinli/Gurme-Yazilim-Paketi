import Navbar from "../Homepage/Navbar/Navbar";
import Footr from "../Homepage/Footer/Footr";
import SideNavbar from "../HomePage/Sidebar/SideNavbar";
import "../HomePage/Footer/footer.css";
import "../HomePage/Navbar/navbar.css";
import "../HomePage/Sidebar/sideNav.css";
import "../HomePage/Home/Home.css";

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
