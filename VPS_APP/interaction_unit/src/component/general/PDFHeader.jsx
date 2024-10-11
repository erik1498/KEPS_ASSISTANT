import { getCookie } from "../../helper/cookies.helper"
import { formatDate, getHariTanggalFull } from "../../helper/date.helper"
import QRCode from "react-qr-code";

const PDFHeader = ({
    title,
    bulan,
    tahun,
    qrcode = false
}) => {
    const waktu = formatDate(getHariTanggalFull())
    return <>
        {
            qrcode ? <QRCode
                size={256}
                style={{ height: "10vh", width: "10vw", opacity: "0.85" }}
                value={waktu}
                viewBox={`0 0 256 256`}
            /> : <></>
        }
        <h1 className="text-2xl font-bold">{getCookie("perusahaan")}</h1>
        <h1 className="text-6xl font-bold uppercase mt-4">{title}</h1>
        <h1 className="text-2xl font-bold">{bulan} {tahun}</h1>
        <p className="mb-5 mt-3">Waktu Cetak - {waktu}</p>
    </>
}
export default PDFHeader