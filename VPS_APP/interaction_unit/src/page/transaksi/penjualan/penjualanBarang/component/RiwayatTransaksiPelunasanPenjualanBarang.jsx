import { useEffect, useState } from "react"
import { parseRupiahToFloat, parseToRupiahText } from "../../../../../helper/number.helper"
import { FaCheck, FaChevronDown, FaChevronUp, FaTrash } from "react-icons/fa"
import { convertTo12HoursFormat } from "../../../../../helper/date.helper"
import { apiPelunasanPenjualanBarangCRUD, apiRincianPelunasanPenjualanBarangCRUD } from "../../../../../service/endPointList.api"
import { deleteAllFormMessage, formValidation, showError } from "../../../../../helper/form.helper"
import FormInput from "../../../../../component/form/FormInput"
import { inputOnlyRupiah } from "../../../../../helper/actionEvent.helper"

const RiwayatTransaksiPelunasanPenjualanBarang = ({
    riwayatPelunasanPenjualanBarang,
    edited,
    _getDaftarRiwayatTransaksi = () => { },
}) => {

    const [nomorPelunasanPenjualanBarang, setNomorPelunasanPenjualanBarang] = useState(riwayatPelunasanPenjualanBarang.nomor_transaksi != "EMPTY" ? riwayatPelunasanPenjualanBarang.nomor_transaksi : "")
    const [buktiTransaksiPelunasanPenjualanBarang, setBuktiTransaksiPelunasanPenjualanBarang] = useState(riwayatPelunasanPenjualanBarang.bukti_transaksi != "EMPTY" ? riwayatPelunasanPenjualanBarang.bukti_transaksi : "")
    const [keteranganPelunasanPenjualanBarang, setKeteranganPelunasanPenjualanBarang] = useState(riwayatPelunasanPenjualanBarang.keterangan != "EMPTY" ? riwayatPelunasanPenjualanBarang.keterangan : "Tidak Ada")

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

    const _updateRiwayatPelunasanPenjualan = async () => {
        await deleteAllFormMessage()

        if (await formValidation()) {
            apiPelunasanPenjualanBarangCRUD
                .custom("/" + riwayatPelunasanPenjualanBarang.uuid, "PUT", null, {
                    data: {
                        nomor_pelunasan_penjualan_barang: nomorPelunasanPenjualanBarang,
                        bukti_transaksi: buktiTransaksiPelunasanPenjualanBarang,
                        keterangan: keteranganPelunasanPenjualanBarang,
                        faktur_penjualan_barang: riwayatPelunasanPenjualanBarang.faktur_penjualan_barang,
                        tanggal: riwayatPelunasanPenjualanBarang.tanggal,
                        kode_akun_perkiraan: riwayatPelunasanPenjualanBarang.kode_akun_perkiraan,
                    }
                }).catch(err => showError(err))
        }
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
            <div className="flex items-center justify-between gap-x-2 px-4">
                <div className="flex items-center gap-x-2">
                    <p className="text-sm pr-2 font-medium">{convertTo12HoursFormat(riwayatPelunasanPenjualanBarang.tanggal.split("T")[1])}</p>
                    <p className="text-sm pr-2 font-medium px-3 border-l-2 border-black">Pelunasan Penjualan Barang</p>
                </div>
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
                                    <td className={`${edited ? "pb-3" : ""}`}>Nomor Pelunasan Penjualan Barang</td>
                                    <td className={`px-5 ${edited ? "pb-3" : ""}`}>:</td>
                                    <td className={`${edited ? "pb-3" : ""}`}>
                                        {
                                            edited ? <FormInput
                                                addClass={"px-0"}
                                                name={"nomor_pelunasan_penjualan_barang"}
                                                value={nomorPelunasanPenjualanBarang}
                                                onchange={(e) => setNomorPelunasanPenjualanBarang(e.target.value)}
                                            /> : riwayatPelunasanPenjualanBarang.nomor_transaksi
                                        }
                                    </td>
                                </tr>
                                <tr>
                                    <td className={`${edited ? "pb-3" : ""}`}>Bukti Transaksi</td>
                                    <td className={`px-5 ${edited ? "pb-3" : ""}`}>:</td>
                                    <td className={`${edited ? "pb-3" : ""}`}>
                                        {
                                            edited ? <FormInput
                                                addClass={"px-0"}
                                                name={"bukti_transaksi"}
                                                value={buktiTransaksiPelunasanPenjualanBarang}
                                                onchange={(e) => setBuktiTransaksiPelunasanPenjualanBarang(e.target.value)}
                                            /> : riwayatPelunasanPenjualanBarang.bukti_transaksi
                                        }
                                    </td>
                                </tr>
                                <tr>
                                    <td className={`${edited ? "pb-5" : ""}`}>Kode Akun</td>
                                    <td className={`px-5 ${edited ? "pb-5" : ""}`}>:</td>
                                    <td className={`${edited ? "pb-5" : ""}`}>{riwayatPelunasanPenjualanBarang.kode_akun_perkiraan_name}</td>
                                </tr>
                                <tr>
                                    <td className={`${edited ? "pb-3" : ""}`}>Total Pelunasan</td>
                                    <td className={`px-5 ${edited ? "pb-3" : ""}`}>:</td>
                                    <td className={`${edited ? "pb-3" : ""}`}>Rp. {parseToRupiahText(totalPelunasan)}</td>
                                </tr>
                            </table>
                            <p className={`text-sm mt-3 ${edited ? "mt-5" : ""}`}>Keterangan</p>
                            <p className="text-sm mb-3">
                                {
                                    edited ? <FormInput
                                        addClass={"mt-5"}
                                        name={"keterangan"}
                                        value={keteranganPelunasanPenjualanBarang}
                                        onchange={(e) => setKeteranganPelunasanPenjualanBarang(e.target.value)}
                                    /> : riwayatPelunasanPenjualanBarang.keterangan
                                }
                            </p>
                            <div className="my-2 flex justify-between">
                                <div>
                                    {
                                        edited ? <>
                                            <button
                                                className="mr-2 btn btn-sm bg-green-900 text-white"
                                                onClick={() => _updateRiwayatPelunasanPenjualan()}
                                            >
                                                <FaCheck size={12} />
                                                Simpan
                                            </button>
                                            <button
                                                className="mr-2 btn btn-sm bg-red-500 text-white"
                                                onClick={() => _deleteRiwayatPelunasanPenjualan()}
                                            >
                                                <FaTrash size={12} />
                                                Hapus
                                            </button>
                                        </> : <></>
                                    }
                                </div>
                                {
                                    listRincian ? <>
                                        <button
                                            className="btn btn-sm border-red-500 text-red-500"
                                            onClick={() => setListRincian(x => x = !x)}
                                        >
                                            Tutup Daftar Pelunasan
                                        </button>
                                    </> : <>
                                        <button
                                            className="btn btn-sm bg-white border-gray-400"
                                            onClick={() => setListRincian(x => x = !x)}
                                        >
                                            Lihat Daftar Pelunasan
                                        </button>
                                    </>
                                }
                            </div>
                            {
                                listRincian ? <>
                                    <div className="overflow-x-auto mt-5 max-h-[20vh] no-scrollbar pb-4">
                                        <table className="table table-sm table-zebra rounded-xl">
                                            <thead className="bg-blue-950 z-10 text-white sticky top-0">
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
                                                                                    inputOnlyRupiah(e, x.piutang)
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
                                </> : <></>
                            }
                        </> : <></>
                    }
                </div>
            </> : <></>
        }
    </div>
}
export default RiwayatTransaksiPelunasanPenjualanBarang