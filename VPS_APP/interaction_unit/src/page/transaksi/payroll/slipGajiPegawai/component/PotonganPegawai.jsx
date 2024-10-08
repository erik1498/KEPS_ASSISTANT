import { parseToRupiahText } from "../../../../../helper/number.helper"

const PotonganPegawai = ({
    _getDataBySumber = () => { },
    total,
    forPrint
}) => {
    return <div className={`bg-white rounded-md col-span-6`}>
        <div className={`mt-7 flex flex-col justify-between pb-6 h-full ${forPrint ? "px-3" : "px-6"}`}>
            <div>
                <h1 className="text-xl font-extrabold w-max text-white px-2 rounded-md bg-blue-900 mb-4">Rincian Potongan Pegawai</h1>
                <div className={`${forPrint ? "" : "px-3"}`}>
                    <div className="flex justify-between border-b-2 py-1">
                        <p>Piutang Karyawan</p>
                        <p>{parseToRupiahText(_getDataBySumber("piutang_karyawan", "potongan"))}</p>
                    </div>
                    <div className="flex justify-between border-b-2 py-1">
                        <p>BPJS Karyawan</p>
                        <p>{parseToRupiahText(_getDataBySumber("bpjs_karyawan", "potongan"))}</p>
                    </div>
                    <div className="flex justify-between border-b-2 py-1">
                        <p>JHT Karyawan</p>
                        <p>{parseToRupiahText(_getDataBySumber("jht_karyawan", "potongan"))}</p>
                    </div>
                    <div className="flex justify-between border-b-2 py-1">
                        <p>JP Karyawan</p>
                        <p>{parseToRupiahText(_getDataBySumber("jp_karyawan", "potongan"))}</p>
                    </div>
                    <div className="flex justify-between border-b-2 py-1">
                        <p>Kerugian</p>
                        <p>{parseToRupiahText(_getDataBySumber("kerugian_karyawan", "potongan"))}</p>
                    </div>
                    <div className="flex justify-between border-b-2 py-1">
                        <p>Lain - Lain</p>
                        <p>{parseToRupiahText(_getDataBySumber("lain_lain", "potongan"))}</p>
                    </div>
                    <div className="flex justify-between border-b-2 py-1">
                        <p>PPH 21/26</p>
                        <p>{parseToRupiahText(_getDataBySumber("pph2126", "potongan"))}</p>
                    </div>
                </div>
            </div>
            <div className={`flex text-xl font-bold justify-between items-end gap-x-4 ${forPrint ? "" : "px-3"} pb-6`}>
                <p>Total Potongan</p>
                <p>{parseToRupiahText(total.potongan)}</p>
            </div>
        </div>
    </div>
}
export default PotonganPegawai