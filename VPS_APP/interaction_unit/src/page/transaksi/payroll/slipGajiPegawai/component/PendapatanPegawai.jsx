import { parseToRupiahText } from "../../../../../helper/number.helper"

const PendapatanPegawai = ({
    _getDataBySumber = () => { },
    total,
    forPrint
}) => {
    return <div className={`bg-white rounded-md col-span-6`}>
        <div className={`mt-7 flex flex-col justify-between pb-6 h-full ${forPrint ? "" : "px-6"}`}>
            <div>
                <h1 className="text-xl font-extrabold w-max text-white px-2 rounded-md bg-blue-900 mb-4">Rincian Pendapatan Pegawai</h1>
                <div className={`${forPrint ? "" : "px-3"}`}>

                    <div className="flex justify-between border-b-2 py-1">
                        <p>Gaji</p>
                        <p>{parseToRupiahText(_getDataBySumber("gaji", "pendapatan"))}</p>
                    </div>
                    <div className="flex justify-between border-b-2 py-1">
                        <p>Bonus</p>
                        <p>{parseToRupiahText(_getDataBySumber("bonus", "pendapatan"))}</p>
                    </div>
                    <div className="flex justify-between border-b-2 py-1">
                        <p>Insentif</p>
                        <p>{parseToRupiahText(_getDataBySumber("insentif", "pendapatan"))}</p>
                    </div>
                    <div className="flex justify-between border-b-2 py-1">
                        <p>THR</p>
                        <p>{parseToRupiahText(_getDataBySumber("thr", "pendapatan"))}</p>
                    </div>
                    <div className="flex justify-between border-b-2 py-1">
                        <p>BPJS Kesehatan ( Perusahaan )</p>
                        <p>{parseToRupiahText(_getDataBySumber("bpjs_kesehatan", "pendapatan"))}</p>
                    </div>
                    <div className="flex justify-between border-b-2 py-1">
                        <p>JKK ( Perusahaan )</p>
                        <p>{parseToRupiahText(_getDataBySumber("jkk", "pendapatan"))}</p>
                    </div>
                    <div className="flex justify-between border-b-2 py-1">
                        <p>JKM ( Perusahaan )</p>
                        <p>{parseToRupiahText(_getDataBySumber("jkm", "pendapatan"))}</p>
                    </div>
                    <div className="flex justify-between border-b-2 py-1">
                        <p>JHT ( Perusahaan )</p>
                        <p>{parseToRupiahText(_getDataBySumber("jht", "pendapatan"))}</p>
                    </div>
                    <div className="flex justify-between border-b-2 py-1">
                        <p>JP ( Perusahaan )</p>
                        <p>{parseToRupiahText(_getDataBySumber("jp", "pendapatan"))}</p>
                    </div>
                    <div className="flex justify-between border-b-2 py-1">
                        <p>Lembur</p>
                        <p>{parseToRupiahText(_getDataBySumber("lembur", "pendapatan"))}</p>
                    </div>
                    <div className="flex justify-between border-b-2 py-1">
                        <p>Hadiah</p>
                        <p>{parseToRupiahText(_getDataBySumber("hadiah", "pendapatan"))}</p>
                    </div>
                    <div className="flex justify-between border-b-2 py-1">
                        <p>Tunjangan Uang</p>
                        <p>{parseToRupiahText(_getDataBySumber("tunjangan_uang", "pendapatan"))}</p>
                    </div>
                </div>
            </div>
            <div className={`flex text-xl font-bold justify-between items-end gap-x-4 ${forPrint ? "" : "px-3"} pb-6`}>
                <p>Total Pendapatan</p>
                <p>{parseToRupiahText(total.pendapatan)}</p>
            </div>
        </div>
    </div>
}
export default PendapatanPegawai