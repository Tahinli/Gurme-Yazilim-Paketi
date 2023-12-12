import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

const Footr = () => {
  return (
    <div className="footer">
      <footer className="ftr">
        <ul>
          <li>
            <a href="https://www.cemens.com.tr/" target="_blanck">
              <img
                className="footer_img"
                src="src/assets/img/cemens_resmi.jpg"
                width={35}
                height={25}
              ></img>
            </a>
          </li>
          <li>
            <a href="https://www.instagram.com/cemensgurme/" target="_blanck">
              <InstagramIcon />
            </a>
          </li>
          <li>
            <a href="https://www.facebook.com/cemensgurme/" target="_blanck">
              <FacebookIcon />
            </a>
          </li>
          <li>
            <a href="https://tr.linkedin.com/company/cemens" target="_blanck">
              <LinkedInIcon />{" "}
            </a>
          </li>
        </ul>

        <p className="footer_text">
          &copy; 2023 Çemen's Gurme, Telif Hakları Saklıdır.
        </p>
      </footer>
    </div>
  );
};

export default Footr;
