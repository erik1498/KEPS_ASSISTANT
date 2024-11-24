import { useEffect, useState } from "react"
import DisplayNotCompatiblePage from "./DisplayNotCompatible";

const ContentWidthAllowed = ({ children }) => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        // Fungsi untuk menangani perubahan ukuran jendela
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        if (/Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
            setWindowWidth(500)
        }

        // Tambahkan event listener
        window.addEventListener('resize', handleResize);

        // Hapus event listener saat komponen unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);


    return <>{
        windowWidth < 1400 ? <DisplayNotCompatiblePage /> : <>{children}</>
    }</>
}
export default ContentWidthAllowed