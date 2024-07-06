import { useNavigate } from "react-router-dom";
import Navigasi from "./Navigasi";
import { getCookie } from "../../helper/cookies.helper";
import { useEffect } from "react";
import LoadingPage from "./LoadingPage";
import { useState } from "react";
import DisplayNotCompatiblePage from "./DisplayNotCompatible";

const Wrap = ({
  children,
  isLoading = false,
}) => {
  const navigate = useNavigate()
  useEffect(() => {
    if (!getCookie("login")) {
      navigate("/")
    }
  }, [])

  const [displayNotCompatible, setDisplayNotCompatible] = useState(false)

  useEffect(() => {
    window.addEventListener("resize", () => {
      if (window.innerWidth < 1680 || window.innerHeight < 900) {
        setDisplayNotCompatible(true)
      }else{
        setDisplayNotCompatible(false)
      }
    })
  }, [])

  return displayNotCompatible ? <DisplayNotCompatiblePage /> : <div className="page-container">
    <div className="page-container-wp">
      <div>
        {
          isLoading ? <LoadingPage /> : <>
            <Navigasi />
            <div className="content px-8 relative">{children}</div>
          </>
        }
      </div>
    </div>
  </div>
};

export default Wrap
