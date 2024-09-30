import { useState } from "react"
import { parseToRupiahText } from "../../../../../helper/number.helper"

const RiwayatTransaksiPelunasanPenjualanBarang = () => {

    const [listRincian, setListRincian] = useState(false)

    return <>
        <p className="text-sm px-3 bg-blue-800 text-white w-max rounded-md font-bold py-1">Pelunasan Penjualan Barang</p>
        <div className="px-4 py-4 text-xs">
            <table className="w-4/12 text-left text-sm font-bold">
                <tr>
                    <td>Nomor Pesanan Penjualan Barang</td>
                    <td className="font-normal">:</td>
                    <td className="font-normal">PPB1290890</td>
                </tr>
                <tr>
                    <td>Bukti Transaksi</td>
                    <td className="font-normal">:</td>
                    <td className="font-normal">BTPA01893</td>
                </tr>
                <tr>
                    <td>Kode Akun</td>
                    <td className="font-normal">:</td>
                    <td className="font-normal">Kas Besar</td>
                </tr>
                <tr>
                    <td>Total Pelunasan</td>
                    <td className="font-normal">:</td>
                    <td className="font-normal">Rp. {parseToRupiahText(100000)}</td>
                </tr>
            </table>
            <p className="text-sm mt-3 font-bold">Keterangan</p>
            <p className="text-sm mb-3">Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita libero ad quisquam labore beatae aperiam omnis laborum voluptas? Illum, sequi.</p>
            {
                listRincian ? <>
                    <button
                        className="btn btn-sm border-red-500 text-red-500"
                        onClick={() => setListRincian(x => x = !x)}
                    >
                        Tutup Rincian
                    </button>
                    <table className="table table-sm table-zebra mt-2 rounded-xl">
                        <thead className="bg-blue-950 text-white">
                            <th>No.</th>
                            <th>Kode Barang</th>
                            <th>Nama Barang</th>
                            <th>Satuan Barang</th>
                            <th>Gudang Asal</th>
                            <th>Sudah Dibayar</th>
                            <th>Piutang</th>
                            <th>Nilai Pelunasan</th>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1.</td>
                                <td>BRG00003</td>
                                <td>KERUPUK PANDA BESAR</td>
                                <td>Pcs</td>
                                <td>Gudang Oepura</td>
                                <td>0</td>
                                <td>Rp. 7,814,400</td>
                                <td>Rp. 7,814,400</td>
                            </tr>
                        </tbody>
                    </table>
                </> : <>
                    <button
                        className="btn btn-sm bg-white border-gray-400"
                        onClick={() => setListRincian(x => x = !x)}
                    >
                        Lihat Rincian
                    </button>
                </>
            }
        </div>
    </>
}
export default RiwayatTransaksiPelunasanPenjualanBarang