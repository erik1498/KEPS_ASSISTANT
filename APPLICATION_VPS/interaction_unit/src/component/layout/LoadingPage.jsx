import { useState } from "react";
import { FaUndo } from "react-icons/fa";

const LoadingPage = () => {

    const [showReload, setShowReload] = useState(false);

    useState(() => {
        setTimeout(() => {
            setShowReload(true)
        }, 5000);
    }, [])

    return <div className="w-full h-screen flex flex-col items-center text-white justify-center bg-blue-900">
        <span className="loading loading-bars loading-lg"></span>
        <h1 className="mt-2">Harap Menunggu</h1>
        {
            showReload && <button
                onClick={() => document.location.reload()}
                className="btn btn-white btn-sm mt-6">
                <FaUndo /> Reload Halaman, Jika Anda Menunggu Terlalu Lama
            </button>
        }
    </div>
}
export default LoadingPage;