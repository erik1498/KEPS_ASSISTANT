import { useEffect, useState } from "react"
import { parseRupiahToFloat, parseToRupiahText } from "../../../../../helper/number.helper"
import { FaChevronDown, FaChevronUp, FaTrash } from "react-icons/fa"
import { convertTo12HoursFormat } from "../../../../../helper/date.helper"
import { apiPelunasanPenjualanBarangCRUD, apiRincianPelunasanPenjualanBarangCRUD } from "../../../../../service/endPointList.api"
import { showError } from "../../../../../helper/form.helper"
import FormInput from "../../../../../component/form/FormInput"
import { inputOnlyRupiah } from "../../../../../helper/actionEvent.helper"

const RiwayatTransaksiPelunasanPenjualanBarang = ({
    riwayatPelunasanPenjualanBarang,
    edited,
    _getDaftarRiwayatTransaksi = () => { }
}) => {

    const [totalPelunasan, setTotalPelunasan] = useState(riwayatPelunasanPenjualanBarang.total)
    const [dendaOpen, setDendaOpen] = useState(false)
    const [listPelunasanPenjualanBarang, setListPelunasanPenjualanBarang] = useState([])

    const [listRincian, setListRincian] = useState(false)
    const [detailOpen, setDetailOpen] = useState(edited)

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

    const _updateNilaiPelunasan = (value, uuid) => {
        let listPelunasanPenjualanBarangCopy = listPelunasanPenjualanBarang

        let totalPelunasanCopy = 0
        listPelunasanPenjualanBarangCopy = listPelunasanPenjualanBarangCopy.map(x => {
            if (x.uuid == uuid) {
                x.nilai_pelunasan = value
            }
            totalPelunasanCopy += parseRupiahToFloat(x.nilai_pelunasan)
            return x
        })
        setTotalPelunasan(x => x = totalPelunasanCopy)
        setListPelunasanPenjualanBarang(x => x = listPelunasanPenjualanBarangCopy)
    }

    const _saveRincianPelunasanPenjualanBarang = async () => {
        for (let index = 0; index < listPelunasanPenjualanBarang.length; index++) {
            await apiRincianPelunasanPenjualanBarangCRUD
                .custom(`${listPelunasanPenjualanBarang[index].rincian_pelunasan_penjualan_barang ? `/${listPelunasanPenjualanBarang[index].rincian_pelunasan_penjualan_barang}` : ""}`, listPelunasanPenjualanBarang[index].rincian_pelunasan_penjualan_barang ? "PUT" : "POST", null, {
                    data: {
                        pelunasan_penjualan_barang: riwayatPelunasanPenjualanBarang.uuid,
                        rincian_pesanan_penjualan_barang: listPelunasanPenjualanBarang[index].uuid,
                        sudah_dibayar: listPelunasanPenjualanBarang[index].sudah_dibayar,
                        piutang: listPelunasanPenjualanBarang[index].piutang,
                        nilai_pelunasan: `${listPelunasanPenjualanBarang[index].nilai_pelunasan}`
                    }
                })
        }
        _getRincianPesananPenjualanBarang()
    }

    const _deleteRiwayatPelunasanPenjualan = () => {
        apiPelunasanPenjualanBarangCRUD
            .custom("/" + riwayatPelunasanPenjualanBarang.uuid, "DELETE")
            .then(() => {
                _getDaftarRiwayatTransaksi()
            }).catch(err => showError(err))
    }

    useEffect(() => {
        if (!dendaOpen) {
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
                                    <td>Rp. {parseToRupiahText(totalPelunasan)}</td>
                                </tr>
                            </table>
                            <p className="text-sm mt-3">Keterangan</p>
                            <p className="text-sm mb-3">{riwayatPelunasanPenjualanBarang.keterangan}</p>
                            <button
                                className="mr-2 btn btn-sm border-red-500 text-red-500"
                                onClick={() => _deleteRiwayatPelunasanPenjualan()}
                            >
                                <FaTrash size={12} />
                            </button>
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
                                                <th>Piutang</th>
                                                <th width={200}>Nilai Pelunasan</th>
                                            </thead>
                                            <tbody>
                                                {
                                                    listPelunasanPenjualanBarang.map((x, i) => {
                                                        return <>
                                                            <tr>
                                                                <td>{i + 1}.</td>
                                                                <td>{x.kategori_harga_barang_kode_barang}</td>
                                                                <td>{x.daftar_barang_name}</td>
                                                                <td>{x.satuan_barang_name}</td>
                                                                <td>{x.daftar_gudang_name}</td>
                                                                <td>Rp. {parseToRupiahText(x.sudah_dibayar)}</td>
                                                                <td>Rp. {parseToRupiahText(x.piutang)}</td>
                                                                <td>
                                                                    {
                                                                        edited ? <>
                                                                            <FormInput
                                                                                name={"nilai_pelunasan"}
                                                                                type={"text"}
                                                                                other={{
                                                                                    defaultValue: 0
                                                                                }}
                                                                                onchange={(e) => {
                                                                                    inputOnlyRupiah(e)
                                                                                    _updateNilaiPelunasan(e.target.value, x.uuid)
                                                                                }}
                                                                                value={parseToRupiahText(x.nilai_pelunasan)}
                                                                            />
                                                                        </> : <>
                                                                            Rp. {parseToRupiahText(x.nilai_pelunasan)}
                                                                        </>
                                                                    }
                                                                </td>
                                                            </tr>
                                                        </>
                                                    })
                                                }
                                            </tbody>
                                        </table>
                                    </div>

                                    {
                                        edited ? <>
                                            <div className="flex justify-end">
                                                <button
                                                    className="btn btn-sm bg-green-900 text-white"
                                                    onClick={() => {
                                                        _saveRincianPelunasanPenjualanBarang()
                                                    }}
                                                >
                                                    Simpan
                                                </button>
                                            </div>
                                        </> : <></>
                                    }
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