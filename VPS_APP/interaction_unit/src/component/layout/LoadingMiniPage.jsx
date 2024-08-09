import { useState } from "react";
import { FaUndo } from "react-icons/fa";

const LoadingMiniPage = () => {

    const [showReload, setShowReload] = useState(false);

    useState(() => {
        setTimeout(() => {
            setShowReload(true)
        }, 5000);
    }, [])

    return <div className="w-max flex gap-x-2 items-center justify-center">
        <span className="loading loading-bars loading-xs"></span>
        <h1 className="ml-2">Harap Menunggu</h1>
        {
            showReload && <button
                onClick={() => document.location.reload()}
                className="btn btn-white btn-sm">
                <FaUndo /> Reload
            </button>
        }
    </div>
}
export default LoadingMiniPage;