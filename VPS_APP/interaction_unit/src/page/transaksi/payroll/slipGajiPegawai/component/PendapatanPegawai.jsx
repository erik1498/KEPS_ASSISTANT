import { parseToRupiahText } from "../../../../../helper/number.helper"

const PendapatanPegawai = ({
    _getDataBySumber = () => { },
    total
}) => {
    return <div className="bg-white rounded-md py-6 px-6 col-span-6">
        <h1 className="text-xl font-extrabold w-max text-white px-2 rounded-md bg-blue-900 mb-4">Rincian Pendapatan Pegawai</h1>
        <div className="mt-7 px-3">
            <div className="flex justify-between border-b-2 py-1">
                <p>Gaji</p>
                <p>Rp. {parseToRupiahText(_getDataBySumber("gaji", "pendapatan"))}</p>
            </div>
            <div className="flex justify-between border-b-2 py-1">
                <p>Jumlah Lembur</p>
                <p>Rp. {parseToRupiahText(_getDataBySumber("lembur", "pendapatan"))}</p>
            </div>
            <div className="flex justify-between border-b-2 py-1">
                <p>BPJS Kesehatan</p>
                <p>Rp. {parseToRupiahText(_getDataBySumber("bpjs_kesehatan", "pendapatan"))}</p>
            </div>
            <div className="flex justify-between border-b-2 py-1">
                <p>JKK</p>
                <p>Rp. {parseToRupiahText(_getDataBySumber("jkk", "pendapatan"))}</p>
            </div>
            <div className="flex justify-between border-b-2 py-1">
                <p>JKM</p>
                <p>Rp. {parseToRupiahText(_getDataBySumber("jkm", "pendapatan"))}</p>
            </div>
            <div className="flex justify-between border-b-2 py-1">
                <p>JHT</p>
                <p>Rp. {parseToRupiahText(_getDataBySumber("jht", "pendapatan"))}</p>
            </div>
            <div className="flex justify-between border-b-2 py-1">
                <p>JP</p>
                <p>Rp. {parseToRupiahText(_getDataBySumber("jp", "pendapatan"))}</p>
            </div>
            <div className="flex justify-between border-b-2 py-1">
                <p>Bonus</p>
                <p>Rp. {parseToRupiahText(_getDataBySumber("bonus", "pendapatan"))}</p>
            </div>
            <div className="flex justify-between border-b-2 py-1">
                <p>Insentif</p>
                <p>Rp. {parseToRupiahText(_getDataBySumber("insentiif", "pendapatan"))}</p>
            </div>
            <div className="flex justify-between border-b-2 py-1">
                <p>THR</p>
                <p>Rp. {parseToRupiahText(_getDataBySumber("thr", "pendapatan"))}</p>
            </div>
            <div className="flex justify-between border-b-2 py-1">
                <p>Tunjangan Barang</p>
                <p>Rp. {parseToRupiahText(_getDataBySumber("gaji", "pendapatan"))}</p>
            </div>
            <div className="flex justify-between border-b-2 py-1">
                <p>Hadiah</p>
                <p>Rp. {parseToRupiahText(_getDataBySumber("gaji", "pendapatan"))}</p>
            </div>

            <div className="flex text-xl font-bold justify-end items-end gap-x-4 py-6">
                <p>Total</p>
                <p>Rp. {parseToRupiahText(total.pendapatan)}</p>
            </div>
        </div>
    </div>
}
export default PendapatanPegawai