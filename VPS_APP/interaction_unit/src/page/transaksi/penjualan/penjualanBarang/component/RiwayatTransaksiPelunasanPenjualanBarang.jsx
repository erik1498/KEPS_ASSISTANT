import { useEffect, useState } from "react"
import { parseToRupiahText } from "../../../../../helper/number.helper"
import { FaChevronDown, FaChevronUp } from "react-icons/fa"
import { convertTo12HoursFormat } from "../../../../../helper/date.helper"
import { apiPelunasanPenjualanBarangCRUD, apiRincianPelunasanPenjualanBarangCRUD } from "../../../../../service/endPointList.api"
import { showError } from "../../../../../helper/form.helper"

const RiwayatTransaksiPelunasanPenjualanBarang = ({
    riwayatPelunasanPenjualanBarang
}) => {

    const [dendaOpen, setDendaOpen] = useState(false)
    const [listPelunasanPenjualanBarang, setListPelunasanPenjualanBarang] = useState([])

    const [listRincian, setListRincian] = useState(false)
    const [detailOpen, setDetailOpen] = useState(false)

    const _cekDendaFakturPenjualan = () => {
        apiPelunasanPenjualanBarangCRUD
            .custom(`/cek_denda_pelunasan_penjualan/${riwayatPelunasanPenjualanBarang.uuid}`, "GET")
            .then(resData => {
                setDendaOpen(x => x = resData.data)
            }).catch(err => showError(err))
    }

    const _getRincianPesananPenjualanBarang = () => {
        apiRincianPelunasanPenjualanBarangCRUD
            .custom(`/pesanan/${riwayatPelunasanPenjualanBarang.uuid}`)
            .then(resData => {
                setListPelunasanPenjualanBarang(resData.data)
            }).catch(err => showError(err))
    }

    useEffect(() => {
        if (!dendaOpen && listRincian) {
            _getRincianPesananPenjualanBarang()
        }
    }, [dendaOpen])

    useEffect(() => {
        if (listRincian) {
            _cekDendaFakturPenjualan()
        }
    }, [listRincian])

    return <div className="border-b-2 py-2">
        <div
            className="cursor-pointer"
            onClick={() => {
                setDetailOpen(x => x = !x)
            }}
        >
            <div className="flex items-center gap-x-2 px-4">
                <p className="text-sm pr-2 font-medium">Pelunasan Penjualan Barang</p>
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
                            <table className="text-left text-sm">
                                <tr>
                                    <td>Waktu</td>
                                    <td className="px-5">:</td>
                                    <td>{convertTo12HoursFormat(riwayatPelunasanPenjualanBarang.tanggal.split("T")[1])}</td>
                                </tr>
                                <tr>
                                    <td>Nomor Pelunasan Penjualan Barang</td>
                                    <td className="px-5">:</td>
                                    <td>{riwayatPelunasanPenjualanBarang.nomor_transaksi}</td>
                                </tr>
                                <tr>
                                    <td>Bukti Transaksi</td>
                                    <td className="px-5">:</td>
                                    <td>{riwayatPelunasanPenjualanBarang.bukti_transaksi}</td>
                                </tr>
                                <tr>
                                    <td>Kode Akun</td>
                                    <td className="px-5">:</td>
                                    <td>{riwayatPelunasanPenjualanBarang.kode_akun_perkiraan_name}</td>
                                </tr>
                                <tr>
                                    <td>Total Pelunasan</td>
                                    <td className="px-5">:</td>
                                    <td>Rp. {parseToRupiahText(100000)}</td>
                                </tr>
                            </table>
                            <p className="text-sm mt-3">Keterangan</p>
                            <p className="text-sm mb-3">{riwayatPelunasanPenjualanBarang.keterangan}</p>
                            {
                                listRincian ? <>
                                    <button
                                        className="btn btn-sm border-red-500 text-red-500"
                                        onClick={() => setListRincian(x => x = !x)}
                                    >
                                        Tutup Daftar Pelunasan
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
                                                <th>Pelunasan</th>
                                                <th>Nilai Kembali Pelunasan</th>
                                            </thead>
                                            <tbody>
                                                {
                                                    listPelunasanPenjualanBarang.map((x, i) => {
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
                                        Lihat Daftar Pelunasan
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
export default RiwayatTransaksiPelunasanPenjualanBarang