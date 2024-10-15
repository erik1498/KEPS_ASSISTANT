import { useEffect, useState } from "react"
import { parseRupiahToFloat, parseToRupiahText } from "../../../../../helper/number.helper"
import { FaCheck, FaChevronDown, FaChevronUp, FaTrash } from "react-icons/fa"
import { convertTo12HoursFormat } from "../../../../../helper/date.helper"
import { apiPengembalianDendaPembelianBarangCRUD, apiRincianPengembalianDendaPembelianBarangCRUD } from "../../../../../service/endPointList.api"
import { deleteAllFormMessage, formValidation, showError } from "../../../../../helper/form.helper"
import FormInput from "../../../../../component/form/FormInput"

const RiwayatTransaksiPengembalianDendaPembelianBarang = ({
    riwayatPengembalianDendaPembelianBarang,
    edited,
    _getDaftarRiwayatTransaksi = () => { },
}) => {

    const [nomorPengembalianDendaPembelianBarang, setNomorPengembalianDendaPembelianBarang] = useState(riwayatPengembalianDendaPembelianBarang.nomor_transaksi != "EMPTY" ? riwayatPengembalianDendaPembelianBarang.nomor_transaksi : "")
    const [buktiTransaksiPengembalianDendaPembelianBarang, setBuktiTransaksiPengembalianDendaPembelianBarang] = useState(riwayatPengembalianDendaPembelianBarang.bukti_transaksi != "EMPTY" ? riwayatPengembalianDendaPembelianBarang.bukti_transaksi : "")
    const [keteranganPengembalianDendaPembelianBarang, setKeteranganPengembalianDendaPembelianBarang] = useState(riwayatPengembalianDendaPembelianBarang.keterangan != "EMPTY" ? riwayatPengembalianDendaPembelianBarang.keterangan : "Tidak Ada")

    const [totalPengembalianDenda, setTotalPengembalianDenda] = useState(riwayatPengembalianDendaPembelianBarang.total)
    const [listPengembalianDendaPembelianBarang, setListPengembalianDendaPembelianBarang] = useState([])

    const [listRincian, setListRincian] = useState(edited)
    const [detailOpen, setDetailOpen] = useState(edited)

    const _getRincianPengembalianDendaPembelianBarang = () => {
        apiRincianPengembalianDendaPembelianBarangCRUD
            .custom(`/pesanan/${riwayatPengembalianDendaPembelianBarang.uuid}`)
            .then(resData => {
                setListPengembalianDendaPembelianBarang(resData.data)
            }).catch(err => showError(err))
    }

    const _saveRincianPengembalianDendaPembelianBarang = async () => {
        for (let index = 0; index < listPengembalianDendaPembelianBarang.length; index++) {
            await apiRincianPengembalianDendaPembelianBarangCRUD
                .custom(`${listPengembalianDendaPembelianBarang[index].rincian_pengembalian_denda_Pembelian_barang ? `/${listPengembalianDendaPembelianBarang[index].rincian_pengembalian_denda_Pembelian_barang}` : ""}`, listPengembalianDendaPembelianBarang[index].rincian_pengembalian_denda_Pembelian_barang ? "PUT" : "POST", null, {
                    data: {
                        pengembalian_denda_Pembelian_barang: riwayatPengembalianDendaPembelianBarang.uuid,
                        rincian_pesanan_Pembelian_barang: listPengembalianDendaPembelianBarang[index].uuid,
                        denda_yang_dikembalikan: `${listPengembalianDendaPembelianBarang[index].denda_yang_dikembalikan}`,
                    }
                })
        }
        _getRincianPengembalianDendaPembelianBarang()
    }

    const _deleteRiwayatPengembalianDendaPembelian = () => {
        apiPengembalianDendaPembelianBarangCRUD
            .custom("/" + riwayatPengembalianDendaPembelianBarang.uuid, "DELETE")
            .then(() => {
                _getDaftarRiwayatTransaksi()
            }).catch(err => showError(err))
    }

    const _updateRiwayatPengembalianDendaPembelian = async () => {
        await deleteAllFormMessage()

        if (await formValidation()) {
            apiPengembalianDendaPembelianBarangCRUD
                .custom("/" + riwayatPengembalianDendaPembelianBarang.uuid, "PUT", null, {
                    data: {
                        nomor_pengembalian_denda_Pembelian_barang: nomorPengembalianDendaPembelianBarang,
                        bukti_transaksi: buktiTransaksiPengembalianDendaPembelianBarang,
                        keterangan: keteranganPengembalianDendaPembelianBarang,
                        faktur_Pembelian_barang: riwayatPengembalianDendaPembelianBarang.faktur_Pembelian_barang,
                        tanggal: riwayatPengembalianDendaPembelianBarang.tanggal,
                        kode_akun_perkiraan: riwayatPengembalianDendaPembelianBarang.kode_akun_perkiraan,
                    }
                })
                .then(() => {
                    _saveRincianPengembalianDendaPembelianBarang()
                })
                .catch(err => showError(err))
        }
    }

    useEffect(() => {
        if (listRincian) {
            _getRincianPengembalianDendaPembelianBarang()
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
                    <p className="text-sm pr-2 font-medium">{convertTo12HoursFormat(riwayatPengembalianDendaPembelianBarang.tanggal.split("T")[1])}</p>
                    <p className="text-sm pr-2 font-medium px-3 border-l-2 border-black">Pengembalian Denda Pembelian Barang</p>
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
                                    <td className={`${edited ? "pb-3" : ""}`}>Nomor Pengembalian Denda Pembelian Barang</td>
                                    <td className={`px-5 ${edited ? "pb-3" : ""}`}>:</td>
                                    <td className={`${edited ? "pb-3" : ""}`}>
                                        {
                                            edited ? <FormInput
                                                addClass={"px-0"}
                                                name={"nomor_pengembalian_denda_Pembelian_barang"}
                                                value={nomorPengembalianDendaPembelianBarang}
                                                onchange={(e) => setNomorPengembalianDendaPembelianBarang(e.target.value)}
                                            /> : riwayatPengembalianDendaPembelianBarang.nomor_transaksi
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
                                                value={buktiTransaksiPengembalianDendaPembelianBarang}
                                                onchange={(e) => setBuktiTransaksiPengembalianDendaPembelianBarang(e.target.value)}
                                            /> : riwayatPengembalianDendaPembelianBarang.bukti_transaksi
                                        }
                                    </td>
                                </tr>
                                <tr>
                                    <td className={`${edited ? "pb-5" : ""}`}>Kode Akun</td>
                                    <td className={`px-5 ${edited ? "pb-5" : ""}`}>:</td>
                                    <td className={`${edited ? "pb-5" : ""}`}>{riwayatPengembalianDendaPembelianBarang.kode_akun_perkiraan_name}</td>
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
                                        value={keteranganPengembalianDendaPembelianBarang}
                                        onchange={(e) => setKeteranganPengembalianDendaPembelianBarang(e.target.value)}
                                    /> : riwayatPengembalianDendaPembelianBarang.keterangan
                                }
                            </p>
                            <div className="my-2 flex justify-between">
                                <div>
                                    {
                                        edited ? <>
                                            <button
                                                className="mr-2 btn btn-sm bg-green-900 text-white"
                                                onClick={() => _updateRiwayatPengembalianDendaPembelian()}
                                            >
                                                <FaCheck size={12} />
                                                Simpan
                                            </button>
                                            <button
                                                className="mr-2 btn btn-sm bg-red-500 text-white"
                                                onClick={() => _deleteRiwayatPengembalianDendaPembelian()}
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
                                                    listPengembalianDendaPembelianBarang.map((x, i) => {
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
export default RiwayatTransaksiPengembalianDendaPembelianBarang