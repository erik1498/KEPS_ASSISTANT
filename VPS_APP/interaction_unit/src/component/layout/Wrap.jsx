import { useNavigate } from "react-router-dom";
import Navigasi from "./Navigasi";
import { getCookie } from "../../helper/cookies.helper";
import LoadingPage from "./LoadingPage";
import { useEffect, useState } from "react";
import ContentWidthAllowed from "./ContentWidthAllowed";

const Wrap = ({
  children,
  isLoading = false,
}) => {
  const [tokenStatus, setTokenStatus] = useState(getCookie("token"))
  const navigate = useNavigate()

  useEffect(() => {
    if (!tokenStatus) {
      navigate("/")
    }
  }, [])

  const [navigateOpen, setNavigateOpen] = useState(false)

  const _closeAllDetailByParent = () => {
    const details = document.getElementsByTagName("details")
    for (let index = 0; index < details.length; index++) {
      const element = details[index];
      element.open = false
    }
    setNavigateOpen(x => x = false)
  }

  return <ContentWidthAllowed>
    <div className="page-container">
      <div className="page-container-wp">
        <div className="relative">
          {
            isLoading ? <LoadingPage /> : <>
              <Navigasi
                setNavigateOpen={setNavigateOpen}
                navigateOpen={navigateOpen}
                closeAllDetailByParent={_closeAllDetailByParent}
              />
              {
                navigateOpen ? <>
                  <div
                    className="fixed top-0 left-0 right-0 bottom-0 bg-black z-[99] opacity-60 cursor-pointer"
                    onClick={() => _closeAllDetailByParent()}
                  ></div>
                </> : <></>
              }
              <div className="content px-8 relative">{children}</div>
            </>
          }
        </div>
      </div>
    </div>
  </ContentWidthAllowed>
};

export default Wrap
