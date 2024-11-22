import { useEffect, useState } from "react"
import { parseRupiahToFloat, parseToRupiahText } from "../../../../../helper/number.helper"
import { FaCheck, FaChevronDown, FaChevronUp, FaTrash } from "react-icons/fa"
import { convertTo12HoursFormat } from "../../../../../helper/date.helper"
import { apiPengembalianDendaPenjualanBarangCRUD, apiRincianPengembalianDendaPenjualanBarangCRUD } from "../../../../../service/endPointList.api"
import { deleteAllFormMessage, formValidation, showAlert, showError } from "../../../../../helper/form.helper"
import FormInput from "../../../../../component/form/FormInput"

const RiwayatTransaksiPengembalianDendaPenjualanBarang = ({
    riwayatPengembalianDendaPenjualanBarang,
    edited,
    _getDaftarRiwayatTransaksi = () => { },
}) => {

    const [nomorPengembalianDendaPenjualanBarang, setNomorPengembalianDendaPenjualanBarang] = useState(riwayatPengembalianDendaPenjualanBarang.nomor_transaksi != "EMPTY" ? riwayatPengembalianDendaPenjualanBarang.nomor_transaksi : "")
    const [buktiTransaksiPengembalianDendaPenjualanBarang, setBuktiTransaksiPengembalianDendaPenjualanBarang] = useState(riwayatPengembalianDendaPenjualanBarang.bukti_transaksi != "EMPTY" ? riwayatPengembalianDendaPenjualanBarang.bukti_transaksi : "")
    const [keteranganPengembalianDendaPenjualanBarang, setKeteranganPengembalianDendaPenjualanBarang] = useState(riwayatPengembalianDendaPenjualanBarang.keterangan != "EMPTY" ? riwayatPengembalianDendaPenjualanBarang.keterangan : "Tidak Ada")

    const [totalPengembalianDenda, setTotalPengembalianDenda] = useState(riwayatPengembalianDendaPenjualanBarang.total)
    const [listPengembalianDendaPenjualanBarang, setListPengembalianDendaPenjualanBarang] = useState([])

    const [listRincian, setListRincian] = useState(edited)
    const [detailOpen, setDetailOpen] = useState(edited)

    const _getRincianPengembalianDendaPenjualanBarang = () => {
        apiRincianPengembalianDendaPenjualanBarangCRUD
            .custom(`/pesanan/${riwayatPengembalianDendaPenjualanBarang.uuid}`)
            .then(resData => {
                setListPengembalianDendaPenjualanBarang(resData.data)
                setTotalPengembalianDenda(x => x = resData.data.reduce((c, p) => { return p.denda_yang_dikembalikan + c }, 0))
            }).catch(err => showError(err))
    }

    const _saveRincianPengembalianDendaPenjualanBarang = async () => {
        for (let index = 0; index < listPengembalianDendaPenjualanBarang.length; index++) {
            await apiRincianPengembalianDendaPenjualanBarangCRUD
                .custom(`${listPengembalianDendaPenjualanBarang[index].rincian_pengembalian_denda_penjualan_barang ? `/${listPengembalianDendaPenjualanBarang[index].rincian_pengembalian_denda_penjualan_barang}` : ""}`, listPengembalianDendaPenjualanBarang[index].rincian_pengembalian_denda_penjualan_barang ? "PUT" : "POST", null, {
                    data: {
                        pengembalian_denda_penjualan_barang: riwayatPengembalianDendaPenjualanBarang.uuid,
                        rincian_pesanan_penjualan_barang: listPengembalianDendaPenjualanBarang[index].uuid,
                        denda_yang_dikembalikan: `${listPengembalianDendaPenjualanBarang[index].denda_yang_dikembalikan}`,
                    }
                }).then(() => {
                    showAlert("Berhasil", "Data Berhasil Disimpan")
                })
        }
        _getRincianPengembalianDendaPenjualanBarang()
    }

    const _deleteRiwayatPengembalianDendaPenjualan = () => {
        apiPengembalianDendaPenjualanBarangCRUD
            .custom("/" + riwayatPengembalianDendaPenjualanBarang.uuid, "DELETE")
            .then(() => {
                _getDaftarRiwayatTransaksi()
            }).catch(err => showError(err))
    }

    const _updateRiwayatPengembalianDendaPenjualan = async () => {
        await deleteAllFormMessage()

        if (await formValidation()) {
            apiPengembalianDendaPenjualanBarangCRUD
                .custom("/" + riwayatPengembalianDendaPenjualanBarang.uuid, "PUT", null, {
                    data: {
                        nomor_pengembalian_denda_penjualan_barang: nomorPengembalianDendaPenjualanBarang,
                        bukti_transaksi: buktiTransaksiPengembalianDendaPenjualanBarang,
                        keterangan: keteranganPengembalianDendaPenjualanBarang,
                        faktur_penjualan_barang: riwayatPengembalianDendaPenjualanBarang.faktur_penjualan_barang,
                        tanggal: riwayatPengembalianDendaPenjualanBarang.tanggal,
                        kode_akun_perkiraan: riwayatPengembalianDendaPenjualanBarang.kode_akun_perkiraan,
                    }
                })
                .then(() => {
                    _saveRincianPengembalianDendaPenjualanBarang()
                })
                .catch(err => showError(err))
        }
    }

    useEffect(() => {
        if (listRincian) {
            _getRincianPengembalianDendaPenjualanBarang()
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
                    <p className="text-sm pr-2 font-medium">{convertTo12HoursFormat(riwayatPengembalianDendaPenjualanBarang.tanggal.split("T")[1])}</p>
                    <p className="text-sm pr-2 font-medium px-3 border-l-2 border-black">Pengembalian Denda Penjualan Barang</p>
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
                        JSON.parse(riwayatPengembalianDendaPenjualanBarang.perintah_stok_opname_nomor_surat_perintah)?.hasil_stok_opname_count == 0 ? <></>
                            :
                            <p className="text-xs font-medium text-green-600 my-3">{JSON.parse(riwayatPengembalianDendaPenjualanBarang.perintah_stok_opname_nomor_surat_perintah)?.nomor_perintah_stok_opname ? `Telah Terdaftar Pada Surat Perintah Stok Opname ${JSON.parse(riwayatPengembalianDendaPenjualanBarang.perintah_stok_opname_nomor_surat_perintah)?.nomor_perintah_stok_opname}` : ""}</p>
                    }
                    {
                        detailOpen ? <>
                            <table className="text-left text-sm">
                                <tr>
                                    <td className={`${edited ? "pb-3" : ""}`}>Nomor Pengembalian Denda Penjualan Barang</td>
                                    <td className={`px-5 ${edited ? "pb-3" : ""}`}>:</td>
                                    <td className={`${edited ? "pb-3" : ""}`}>
                                        {
                                            edited ? <FormInput
                                                addClass={"px-0"}
                                                name={"nomor_pengembalian_denda_penjualan_barang"}
                                                value={nomorPengembalianDendaPenjualanBarang}
                                                onchange={(e) => setNomorPengembalianDendaPenjualanBarang(e.target.value)}
                                            /> : riwayatPengembalianDendaPenjualanBarang.nomor_transaksi
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
                                                value={buktiTransaksiPengembalianDendaPenjualanBarang}
                                                onchange={(e) => setBuktiTransaksiPengembalianDendaPenjualanBarang(e.target.value)}
                                            /> : riwayatPengembalianDendaPenjualanBarang.bukti_transaksi
                                        }
                                    </td>
                                </tr>
                                <tr>
                                    <td className={`${edited ? "pb-5" : ""}`}>Kode Akun</td>
                                    <td className={`px-5 ${edited ? "pb-5" : ""}`}>:</td>
                                    <td className={`${edited ? "pb-5" : ""}`}>{riwayatPengembalianDendaPenjualanBarang.kode_akun_perkiraan_code} - {riwayatPengembalianDendaPenjualanBarang.kode_akun_perkiraan_name}</td>
                                </tr>
                                <tr>
                                    <td className={`${edited ? "pb-3" : ""}`}>Total PengembalianDenda</td>
                                    <td className={`px-5 ${edited ? "pb-3" : ""}`}>:</td>
                                    <td className={`${edited ? "pb-3" : ""}`}>Rp. {parseToRupiahText(totalPengembalianDenda)}</td>
                                </tr>
                            </table>
                            <p className={`text-sm mt-3 ${edited ? "mt-5" : ""}`}>Keterangan</p>
                            <p className="text-sm mb-3">
                                {
                                    edited ? <FormInput
                                        addClass={"mt-5"}
                                        name={"keterangan"}
                                        value={keteranganPengembalianDendaPenjualanBarang}
                                        onchange={(e) => setKeteranganPengembalianDendaPenjualanBarang(e.target.value)}
                                    /> : riwayatPengembalianDendaPenjualanBarang.keterangan
                                }
                            </p>
                            <div className="my-2 flex justify-between">
                                <div>
                                    {
                                        edited ? <>
                                            <button
                                                className="mr-2 btn btn-sm bg-green-900 text-white"
                                                onClick={() => _updateRiwayatPengembalianDendaPenjualan()}
                                            >
                                                <FaCheck size={12} />
                                                Simpan
                                            </button>
                                            <button
                                                className="mr-2 btn btn-sm bg-red-500 text-white"
                                                onClick={() => _deleteRiwayatPengembalianDendaPenjualan()}
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
                                            Tutup Daftar PengembalianDenda
                                        </button>
                                    </> : <>
                                        <button
                                            className="btn btn-sm bg-white border-gray-400"
                                            onClick={() => setListRincian(x => x = !x)}
                                        >
                                            Lihat Daftar PengembalianDenda
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
                                                <th>Denda Yang Dikembalikan</th>
                                            </thead>
                                            <tbody>
                                                {
                                                    listPengembalianDendaPenjualanBarang.map((x, i) => {
                                                        return <>
                                                            <tr>
                                                                <td>{i + 1}.</td>
                                                                <td>{x.kategori_harga_barang_kode_barang}</td>
                                                                <td>{x.daftar_barang_name}</td>
                                                                <td>{x.satuan_barang_name}</td>
                                                                <td>{x.daftar_gudang_name}</td>
                                                                <td>Rp. {parseToRupiahText(x.denda_yang_dikembalikan)}</td>
                                                            </tr>
                                                        </>
                                                    })
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                </> : <></>
                            }
                        </> : <></>
                    }
                </div>
            </> : <></>
        }
    </div>
}
export default RiwayatTransaksiPengembalianDendaPenjualanBarang