import Navbar from "../Homepage/Navbar/Navbar";
import Footr from "../Homepage/Footer/Footr";
import SideNavbar from "../HomePage/Sidebar/SideNavbar"

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
