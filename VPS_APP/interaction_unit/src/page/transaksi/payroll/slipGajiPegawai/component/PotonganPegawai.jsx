import { parseToRupiahText } from "../../../../../helper/number.helper"

const PotonganPegawai = ({
    _getDataBySumber = () => { },
    total,
    forPrint
}) => {
    return <div className={`bg-white rounded-md py-6 ${forPrint ? "px-3" : "px-6"} col-span-6`}>
        <h1 className="text-xl font-extrabold w-max text-white px-2 rounded-md bg-blue-900 mb-4">Rincian Potongan Pegawai</h1>
        <div className={`mt-7 ${forPrint ? "" : "px-3"}`}>
            <div className="flex justify-between border-b-2 py-1">
                <p>Piutang Karyawan</p>
                <p>Rp. {parseToRupiahText(_getDataBySumber("piutang_karyawan", "potongan"))}</p>
            </div>
            <div className="flex justify-between border-b-2 py-1">
                <p>BPJS Karyawan</p>
                <p>Rp. {parseToRupiahText(_getDataBySumber("bpjs_karyawan", "potongan"))}</p>
            </div>
            <div className="flex justify-between border-b-2 py-1">
                <p>JHT Karyawan</p>
                <p>Rp. {parseToRupiahText(_getDataBySumber("jht_karyawan", "potongan"))}</p>
            </div>
            <div className="flex justify-between border-b-2 py-1">
                <p>JP Karyawan</p>
                <p>Rp. {parseToRupiahText(_getDataBySumber("jp_karyawan", "potongan"))}</p>
            </div>
            <div className="flex justify-between border-b-2 py-1">
                <p>Kerugian</p>
                <p>Rp. {parseToRupiahText(_getDataBySumber("kerugian_karyawan", "potongan"))}</p>
            </div>
            <div className="flex justify-between border-b-2 py-1">
                <p>Lain - Lain</p>
                <p>Rp. {parseToRupiahText(_getDataBySumber("lain_lain", "potongan"))}</p>
            </div>
            <div className="flex justify-between border-b-2 py-1">
                <p>PPH 21/26</p>
                <p>Rp. {parseToRupiahText(_getDataBySumber("pph2126", "potongan"))}</p>
            </div>
            <div className="flex text-xl font-bold justify-end items-end gap-x-4 py-6">
                <p>Total</p>
                <p>Rp. {parseToRupiahText(total.potongan)}</p>
            </div>
        </div>
    </div>
}
export default PotonganPegawai