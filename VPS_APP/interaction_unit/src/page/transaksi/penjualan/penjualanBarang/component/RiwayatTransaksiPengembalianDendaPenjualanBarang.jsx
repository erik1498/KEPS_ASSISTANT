import { useState } from "react"
import { parseToRupiahText } from "../../../../../helper/number.helper"
import { FaChevronDown, FaChevronUp } from "react-icons/fa"

const RiwayatTransaksiPengembalianDendaPenjualanBarang = () => {

    const [listRincian, setListRincian] = useState(false)
    const [detailOpen, setDetailOpen] = useState(false)

    return <div className="border-b-2 py-2">
        <div
            className="cursor-pointer"
            onClick={() => {
                setDetailOpen(x => x = !x)
            }}
        >
            <div className="flex items-center gap-x-2 px-4">
                <p className="text-sm pr-2 font-medium">Pengembalian Denda Penjualan Barang</p>
                {
                    detailOpen ? <FaChevronUp size={15} /> : <FaChevronDown size={15} />
                }
            </div>
        </div>
        {
            detailOpen ? <>
                <div className="ml-4 py-4 px-4">
                    {
                        detailOpen ? <>
                            <table className="w-4/12 text-left text-sm">
                                <tr>
                                    <td>Waktu</td>
                                    <td>:</td>
                                    <td>04:15:35 PM</td>
                                </tr>
                                <tr>
                                    <td>Nomor Pengembalian Denda Penjualan Barang</td>
                                    <td>:</td>
                                    <td>PPB1290890</td>
                                </tr>
                                <tr>
                                    <td>Bukti Transaksi</td>
                                    <td>:</td>
                                    <td>BTPA01893</td>
                                </tr>
                                <tr>
                                    <td>Kode Akun</td>
                                    <td>:</td>
                                    <td>Kas Besar</td>
                                </tr>
                                <tr>
                                    <td>Total Pengembalian Denda</td>
                                    <td>:</td>
                                    <td>Rp. {parseToRupiahText(100000)}</td>
                                </tr>
                            </table>
                            <p className="text-sm mt-3">Keterangan</p>
                            <p className="text-sm mb-3">Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita libero ad quisquam labore beatae aperiam omnis laborum voluptas? Illum, sequi.</p>
                            {
                                listRincian ? <>
                                    <button
                                        className="btn btn-sm border-red-500 text-red-500"
                                        onClick={() => setListRincian(x => x = !x)}
                                    >
                                        Tutup Daftar Pengembalian Denda
                                    </button>
                                    <div className="overflow-x-auto mt-5 max-h-[20vh] no-scrollbar pb-4">
                                        <table className="table table-sm table-zebra rounded-xl">
                                            <thead className="bg-blue-950 text-white sticky top-0">
                                                <th>No.</th>
                                                <th>Kode Barang</th>
                                                <th>Nama Barang</th>
                                                <th>Satuan Barang</th>
                                                <th>Gudang Asal</th>
                                                <th>Pelunasan Sudah Dibayar</th>
                                                <th>Pengembalian Denda</th>
                                                <th>Nilai Kembali Pengembalian Denda</th>
                                            </thead>
                                            <tbody>
                                                {
                                                    new Array(50).fill(10).map((x, i) => {
                                                        return <>
                                                            <tr>
                                                                <td>{i + 1}.</td>
                                                                <td>BRG00003</td>
                                                                <td>KERUPUK PANDA BESAR</td>
                                                                <td>Pcs</td>
                                                                <td>Gudang Oepura</td>
                                                                <td>Rp. 7,814,400</td>
                                                                <td>1</td>
                                                                <td>Rp. 7,814,400</td>
                                                            </tr>
                                                        </>
                                                    })
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                </> : <>
                                    <button
                                        className="btn btn-sm bg-white border-gray-400"
                                        onClick={() => setListRincian(x => x = !x)}
                                    >
                                        Lihat Daftar Pengembalian Denda
                                    </button>
                                </>
                            }
                        </> : <></>
                    }
                </div>
            </> : <></>
        }
    </div>
}
export default RiwayatTransaksiPengembalianDendaPenjualanBarang