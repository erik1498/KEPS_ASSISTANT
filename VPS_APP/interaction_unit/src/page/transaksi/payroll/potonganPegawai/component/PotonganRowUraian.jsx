import { convertTo12HoursFormat, formatDate } from "../../../../../helper/date.helper"
import { parseToRupiahText } from "../../../../../helper/number.helper"

const PotonganRowUraian = ({
    data
}) => {
    return <>
        <p>{data?.uraian}</p>
        {
            data?.waktu_mulai && data?.waktu_selesai && data?.transaksi == 0 ? <>
                <b>{data?.deskripsi_kerja}</b>
                <p className="mb-2">{data?.keterangan_kerja}</p>
                <p>{`${formatDate(data?.waktu_mulai.split("T")[0], false)} ${convertTo12HoursFormat(data?.waktu_mulai.split("T")[1])}`} Hingga {`${formatDate(data?.waktu_selesai.split("T")[0], false)} ${convertTo12HoursFormat(data?.waktu_selesai.split("T")[1])}`}</p>
                <p className="font-semibold">Detail</p>
                <p>{parseToRupiahText(data?.total_jam)} Jam, {parseToRupiahText(data?.total_menit)} Menit. Dengan Nilai Lembur Per Menit {parseToRupiahText(data?.nilai_lembur_per_menit)}</p>
            </> : <></>
        }
    </>
}
export default PotonganRowUraian