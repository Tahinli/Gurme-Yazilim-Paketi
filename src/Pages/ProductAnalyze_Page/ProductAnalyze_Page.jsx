import Navbar from "../HomePage/Navbar/Navbar";
import Footr from "../HomePage/Footer/Footr";
import ASide_Navbar from "./AnalyzeSide_Navbar/aside_navbar";

import "../HomePage/Footer/footer.css";
import "../HomePage/Navbar/navbar.css";

export default function ProductAnalyze_Page() {
  return (
    <div>
      <Navbar />
      <ASide_Navbar />
      <Footr />
    </div>
  );
}
