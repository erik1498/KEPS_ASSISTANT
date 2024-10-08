import { getCookie } from "../../helper/cookies.helper"
import { formatDate, getHariTanggalFull } from "../../helper/date.helper"

const PDFHeader = ({
    title,
    bulan,
    tahun
}) => {
    return <>
        <h1 className="text-2xl font-bold">{getCookie("perusahaan")}</h1>
        <h1 className="text-6xl font-bold uppercase mt-4">{title}</h1>
        <h1 className="text-2xl font-bold">{bulan} {tahun}</h1>
        <p className="mb-5 mt-3">Waktu Cetak - {formatDate(getHariTanggalFull())}</p>
    </>
}
export default PDFHeader