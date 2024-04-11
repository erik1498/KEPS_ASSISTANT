import { useNavigate } from "react-router-dom";
import Navigasi from "./Navigasi";
import { getCookie } from "../../helper/cookies.helper";
import { useEffect } from "react";
import LoadingPage from "./LoadingPage";
import { useState } from "react";

const Wrap = ({
  children,
  isLoading = false,
}) => {
  const [loadingOpen, setLoadingOpen] = useState(isLoading)
  const navigate = useNavigate()
  useEffect(() => {
    if (!getCookie("login")) {
      navigate("/")
    }
  }, [])
  return (
    //  <div className="container">
    <div className="page-container">
      <div className="page-container-wp">
        <div>
          {
            loadingOpen ? <LoadingPage /> : <>
              <Navigasi setLoadingOpen={setLoadingOpen} />
              <div className="content px-8 relative">{children}</div>
            </>
          }
        </div>
      </div>
    </div>
    // </div>
  );
};

export default Wrap
