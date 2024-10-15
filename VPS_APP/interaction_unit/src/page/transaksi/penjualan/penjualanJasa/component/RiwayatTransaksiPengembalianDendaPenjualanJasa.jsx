import { useEffect, useState } from "react"
import { parseToRupiahText } from "../../../../../helper/number.helper"
import { FaCheck, FaChevronDown, FaChevronUp, FaTrash } from "react-icons/fa"
import { convertTo12HoursFormat } from "../../../../../helper/date.helper"
import { apiPengembalianDendaPenjualanJasaCRUD, apiRincianPengembalianDendaPenjualanJasaCRUD } from "../../../../../service/endPointList.api"
import { deleteAllFormMessage, formValidation, showError } from "../../../../../helper/form.helper"
import FormInput from "../../../../../component/form/FormInput"

const RiwayatTransaksiPengembalianDendaPenjualanJasa = ({
    riwayatPengembalianDendaPenjualanJasa,
    edited,
    _getDaftarRiwayatTransaksi = () => { },
}) => {

    const [nomorPengembalianDendaPenjualanJasa, setNomorPengembalianDendaPenjualanJasa] = useState(riwayatPengembalianDendaPenjualanJasa.nomor_transaksi != "EMPTY" ? riwayatPengembalianDendaPenjualanJasa.nomor_transaksi : "")
    const [buktiTransaksiPengembalianDendaPenjualanJasa, setBuktiTransaksiPengembalianDendaPenjualanJasa] = useState(riwayatPengembalianDendaPenjualanJasa.bukti_transaksi != "EMPTY" ? riwayatPengembalianDendaPenjualanJasa.bukti_transaksi : "")
    const [keteranganPengembalianDendaPenjualanJasa, setKeteranganPengembalianDendaPenjualanJasa] = useState(riwayatPengembalianDendaPenjualanJasa.keterangan != "EMPTY" ? riwayatPengembalianDendaPenjualanJasa.keterangan : "Tidak Ada")

    const [totalPengembalianDenda, setTotalPengembalianDenda] = useState(riwayatPengembalianDendaPenjualanJasa.total)
    const [listPengembalianDendaPenjualanJasa, setListPengembalianDendaPenjualanJasa] = useState([])

    const [listRincian, setListRincian] = useState(edited)
    const [detailOpen, setDetailOpen] = useState(edited)

    const _getRincianPengembalianDendaPenjualanJasa = () => {
        apiRincianPengembalianDendaPenjualanJasaCRUD
            .custom(`/pesanan/${riwayatPengembalianDendaPenjualanJasa.uuid}`)
            .then(resData => {
                setListPengembalianDendaPenjualanJasa(resData.data)
            }).catch(err => showError(err))
    }

    const _saveRincianPengembalianDendaPenjualanJasa = async () => {
        for (let index = 0; index < listPengembalianDendaPenjualanJasa.length; index++) {
            await apiRincianPengembalianDendaPenjualanJasaCRUD
                .custom(`${listPengembalianDendaPenjualanJasa[index].rincian_pengembalian_denda_penjualan_jasa ? `/${listPengembalianDendaPenjualanJasa[index].rincian_pengembalian_denda_penjualan_jasa}` : ""}`, listPengembalianDendaPenjualanJasa[index].rincian_pengembalian_denda_penjualan_jasa ? "PUT" : "POST", null, {
                    data: {
                        pengembalian_denda_penjualan_jasa: riwayatPengembalianDendaPenjualanJasa.uuid,
                        rincian_pesanan_penjualan_jasa: listPengembalianDendaPenjualanJasa[index].uuid,
                        denda_yang_dikembalikan: `${listPengembalianDendaPenjualanJasa[index].denda_yang_dikembalikan}`,
                    }
                })
        }
        _getRincianPengembalianDendaPenjualanJasa()
    }

    const _deleteRiwayatPengembalianDendaPenjualan = () => {
        apiPengembalianDendaPenjualanJasaCRUD
            .custom("/" + riwayatPengembalianDendaPenjualanJasa.uuid, "DELETE")
            .then(() => {
                _getDaftarRiwayatTransaksi()
            }).catch(err => showError(err))
    }

    const _updateRiwayatPengembalianDendaPenjualan = async () => {
        await deleteAllFormMessage()

        if (await formValidation()) {
            apiPengembalianDendaPenjualanJasaCRUD
                .custom("/" + riwayatPengembalianDendaPenjualanJasa.uuid, "PUT", null, {
                    data: {
                        nomor_pengembalian_denda_penjualan_jasa: nomorPengembalianDendaPenjualanJasa,
                        bukti_transaksi: buktiTransaksiPengembalianDendaPenjualanJasa,
                        keterangan: keteranganPengembalianDendaPenjualanJasa,
                        faktur_penjualan_jasa: riwayatPengembalianDendaPenjualanJasa.faktur_penjualan_jasa,
                        tanggal: riwayatPengembalianDendaPenjualanJasa.tanggal,
                        kode_akun_perkiraan: riwayatPengembalianDendaPenjualanJasa.kode_akun_perkiraan,
                    }
                })
                .then(() => {
                    _saveRincianPengembalianDendaPenjualanJasa()
                })
                .catch(err => showError(err))
        }
    }

    useEffect(() => {
        if (listRincian) {
            _getRincianPengembalianDendaPenjualanJasa()
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
                    <p className="text-sm pr-2 font-medium">{convertTo12HoursFormat(riwayatPengembalianDendaPenjualanJasa.tanggal.split("T")[1])}</p>
                    <p className="text-sm pr-2 font-medium px-3 border-l-2 border-black">Pengembalian Denda Penjualan Jasa</p>
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
                                    <td className={`${edited ? "pb-3" : ""}`}>Nomor Pengembalian Denda Penjualan Jasa</td>
                                    <td className={`px-5 ${edited ? "pb-3" : ""}`}>:</td>
                                    <td className={`${edited ? "pb-3" : ""}`}>
                                        {
                                            edited ? <FormInput
                                                addClass={"px-0"}
                                                name={"nomor_pengembalian_denda_penjualan_jasa"}
                                                value={nomorPengembalianDendaPenjualanJasa}
                                                onchange={(e) => setNomorPengembalianDendaPenjualanJasa(e.target.value)}
                                            /> : riwayatPengembalianDendaPenjualanJasa.nomor_transaksi
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
                                                value={buktiTransaksiPengembalianDendaPenjualanJasa}
                                                onchange={(e) => setBuktiTransaksiPengembalianDendaPenjualanJasa(e.target.value)}
                                            /> : riwayatPengembalianDendaPenjualanJasa.bukti_transaksi
                                        }
                                    </td>
                                </tr>
                                <tr>
                                    <td className={`${edited ? "pb-5" : ""}`}>Kode Akun</td>
                                    <td className={`px-5 ${edited ? "pb-5" : ""}`}>:</td>
                                    <td className={`${edited ? "pb-5" : ""}`}>{riwayatPengembalianDendaPenjualanJasa.kode_akun_perkiraan_name}</td>
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
                                        value={keteranganPengembalianDendaPenjualanJasa}
                                        onchange={(e) => setKeteranganPengembalianDendaPenjualanJasa(e.target.value)}
                                    /> : riwayatPengembalianDendaPenjualanJasa.keterangan
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
                                                <th>Kode Jasa</th>
                                                <th>Nama Jasa</th>
                                                <th>Satuan Jasa</th>
                                                <th>Gudang Asal</th>
                                                <th>Denda Yang Dikembalikan</th>
                                            </thead>
                                            <tbody>
                                                {
                                                    listPengembalianDendaPenjualanJasa.map((x, i) => {
                                                        return <>
                                                            <tr>
                                                                <td>{i + 1}.</td>
                                                                <td>{x.kategori_harga_jasa_kode_jasa}</td>
                                                                <td>{x.daftar_jasa_name}</td>
                                                                <td>{x.satuan_jasa_name}</td>
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
export default RiwayatTransaksiPengembalianDendaPenjualanJasa