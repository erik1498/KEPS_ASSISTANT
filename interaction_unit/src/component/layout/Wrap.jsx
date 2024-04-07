import { useNavigate } from "react-router-dom";
import Navigasi from "./Navigasi";
import { getCookie } from "../../helper/cookies.helper";
import { useEffect } from "react";

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
  return (
    //  <div className="container">
    <div className="page-container">
      <div className="page-container-wp">
        <div>
          {
            isLoading ? <>
              <div className="w-full h-screen flex flex-col items-center text-white justify-center bg-blue-900">
                <span className="loading loading-bars loading-lg"></span>
                <h1 className="mt-2">Harap Menunggu</h1>
              </div>
            </> : <>
              <Navigasi />
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
