import { useEffect, useState } from "react"
import { parseRupiahToFloat, parseToRupiahText } from "../../../../../helper/number.helper"
import { FaCheck, FaChevronDown, FaChevronUp, FaTrash } from "react-icons/fa"
import { convertTo12HoursFormat } from "../../../../../helper/date.helper"
import { apiPelunasanPenjualanJasaCRUD, apiRincianPelunasanPenjualanJasaCRUD, apiRincianPelunasanPenjualanDendaJasaCRUD } from "../../../../../service/endPointList.api"
import { deleteAllFormMessage, formValidation, showAlert, showError } from "../../../../../helper/form.helper"
import FormInput from "../../../../../component/form/FormInput"
import { inputOnlyRupiah } from "../../../../../helper/actionEvent.helper"

const RiwayatTransaksiPelunasanPenjualanJasa = ({
    riwayatPelunasanPenjualanJasa,
    edited,
    _getDaftarRiwayatTransaksi = () => { },
}) => {

    const [nomorPelunasanPenjualanJasa, setNomorPelunasanPenjualanJasa] = useState(riwayatPelunasanPenjualanJasa.nomor_transaksi != "EMPTY" ? riwayatPelunasanPenjualanJasa.nomor_transaksi : "")
    const [buktiTransaksiPelunasanPenjualanJasa, setBuktiTransaksiPelunasanPenjualanJasa] = useState(riwayatPelunasanPenjualanJasa.bukti_transaksi != "EMPTY" ? riwayatPelunasanPenjualanJasa.bukti_transaksi : "")
    const [keteranganPelunasanPenjualanJasa, setKeteranganPelunasanPenjualanJasa] = useState(riwayatPelunasanPenjualanJasa.keterangan != "EMPTY" ? riwayatPelunasanPenjualanJasa.keterangan : "Tidak Ada")

    const [totalPelunasan, setTotalPelunasan] = useState(riwayatPelunasanPenjualanJasa.total)
    const [dendaOpen, setDendaOpen] = useState(false)
    const [listPelunasanPenjualanJasa, setListPelunasanPenjualanJasa] = useState([])
    const [listPelunasanPenjualanDendaJasa, setListPelunasanPenjualanDendaJasa] = useState([])

    const [listRincian, setListRincian] = useState(false)
    const [detailOpen, setDetailOpen] = useState(edited)

    const _cekDendaFakturPenjualan = () => {
        apiPelunasanPenjualanJasaCRUD
            .custom(`/cek_denda_pelunasan_penjualan/${riwayatPelunasanPenjualanJasa.uuid}`, "GET")
            .then(resData => {
                setDendaOpen(x => x = resData.data)
            }).catch(err => showError(err))
    }

    const _getRincianPesananPenjualanJasa = () => {
        apiRincianPelunasanPenjualanJasaCRUD
            .custom(`/pesanan/${riwayatPelunasanPenjualanJasa.uuid}`)
            .then(resData => {
                setListPelunasanPenjualanJasa(resData.data)
            }).catch(err => showError(err))
    }

    const _getRincianPesananPenjualanDendaJasa = () => {
        apiRincianPelunasanPenjualanDendaJasaCRUD
            .custom(`/pesanan/${riwayatPelunasanPenjualanJasa.uuid}`)
            .then(resData => {
                setListPelunasanPenjualanDendaJasa(resData.data)
            }).catch(err => showError(err))
    }

    const _updateNilaiPelunasan = (value, uuid) => {
        let listPelunasanPenjualanJasaCopy = listPelunasanPenjualanJasa

        let totalPelunasanCopy = 0
        listPelunasanPenjualanJasaCopy = listPelunasanPenjualanJasaCopy.map(x => {
            if (x.uuid == uuid) {
                x.nilai_pelunasan = value
            }
            totalPelunasanCopy += parseRupiahToFloat(x.nilai_pelunasan)
            return x
        })
        setTotalPelunasan(x => x = totalPelunasanCopy)
        setListPelunasanPenjualanJasa(x => x = listPelunasanPenjualanJasaCopy)
    }

    const _updateNilaiPelunasanDenda = (value, uuid) => {
        let listPelunasanPenjualanDendaJasaCopy = listPelunasanPenjualanDendaJasa

        let totalPelunasanCopy = 0
        listPelunasanPenjualanDendaJasaCopy = listPelunasanPenjualanDendaJasaCopy.map(x => {
            if (x.uuid == uuid) {
                x.nilai_pelunasan = value
            }
            totalPelunasanCopy += parseRupiahToFloat(x.nilai_pelunasan)
            return x
        })
        setTotalPelunasan(x => x = totalPelunasanCopy)
        setListPelunasanPenjualanDendaJasa(x => x = listPelunasanPenjualanDendaJasaCopy)
    }

    const _saveRincianPelunasanPenjualanDendaJasa = async () => {
        for (let index = 0; index < listPelunasanPenjualanDendaJasa.length; index++) {
            await apiRincianPelunasanPenjualanDendaJasaCRUD
                .custom(`${listPelunasanPenjualanDendaJasa[index].rincian_pelunasan_penjualan_denda_jasa ? `/${listPelunasanPenjualanDendaJasa[index].rincian_pelunasan_penjualan_denda_jasa}` : ""}`, listPelunasanPenjualanDendaJasa[index].rincian_pelunasan_penjualan_denda_jasa ? "PUT" : "POST", null, {
                    data: {
                        pelunasan_penjualan_jasa: riwayatPelunasanPenjualanJasa.uuid,
                        rincian_pesanan_penjualan_jasa: listPelunasanPenjualanDendaJasa[index].uuid,
                        hari_terlewat: listPelunasanPenjualanDendaJasa[index].hari_terlewat,
                        total_denda: listPelunasanPenjualanDendaJasa[index].total_denda,
                        denda_sudah_dibayar: listPelunasanPenjualanDendaJasa[index].denda_sudah_dibayar,
                        piutang_denda: listPelunasanPenjualanDendaJasa[index].total_denda - listPelunasanPenjualanDendaJasa[index].denda_sudah_dibayar,
                        nilai_pelunasan: `${listPelunasanPenjualanDendaJasa[index].nilai_pelunasan}`,
                    }
                }).then(() => {
                    showAlert("Berhasil", "Data Berhasil Disimpan")
                })
                .catch(err => showError(err))
        }
        _getRincianPesananPenjualanDendaJasa()
    }

    const _saveRincianPelunasanPenjualanJasa = async () => {
        for (let index = 0; index < listPelunasanPenjualanJasa.length; index++) {
            await apiRincianPelunasanPenjualanJasaCRUD
                .custom(`${listPelunasanPenjualanJasa[index].rincian_pelunasan_penjualan_jasa ? `/${listPelunasanPenjualanJasa[index].rincian_pelunasan_penjualan_jasa}` : ""}`, listPelunasanPenjualanJasa[index].rincian_pelunasan_penjualan_jasa ? "PUT" : "POST", null, {
                    data: {
                        pelunasan_penjualan_jasa: riwayatPelunasanPenjualanJasa.uuid,
                        rincian_pesanan_penjualan_jasa: listPelunasanPenjualanJasa[index].uuid,
                        sudah_dibayar: listPelunasanPenjualanJasa[index].sudah_dibayar,
                        piutang: listPelunasanPenjualanJasa[index].piutang,
                        nilai_pelunasan: `${listPelunasanPenjualanJasa[index].nilai_pelunasan}`
                    }
                }).then(() => {
                    showAlert("Berhasil", "Data Berhasil Disimpan")
                }).catch(err => showError(err))
        }
        _getRincianPesananPenjualanJasa()
    }

    const _deleteRiwayatPelunasanPenjualan = () => {
        apiPelunasanPenjualanJasaCRUD
            .custom("/" + riwayatPelunasanPenjualanJasa.uuid, "DELETE")
            .then(() => {
                _getDaftarRiwayatTransaksi()
            }).catch(err => showError(err))
    }

    const _updateRiwayatPelunasanPenjualan = async () => {
        await deleteAllFormMessage()

        if (await formValidation()) {
            apiPelunasanPenjualanJasaCRUD
                .custom("/" + riwayatPelunasanPenjualanJasa.uuid, "PUT", null, {
                    data: {
                        nomor_pelunasan_penjualan_jasa: nomorPelunasanPenjualanJasa,
                        bukti_transaksi: buktiTransaksiPelunasanPenjualanJasa,
                        keterangan: keteranganPelunasanPenjualanJasa,
                        faktur_penjualan_jasa: riwayatPelunasanPenjualanJasa.faktur_penjualan_jasa,
                        tanggal: riwayatPelunasanPenjualanJasa.tanggal,
                        kode_akun_perkiraan: riwayatPelunasanPenjualanJasa.kode_akun_perkiraan,
                    }
                }).then(() => {
                    showAlert("Berhasil", "Data Berhasil Disimpan")
                }).catch(err => showError(err))
        }
    }

    useEffect(() => {
        if (dendaOpen == 0) {
            _getRincianPesananPenjualanJasa()
        } else {
            _getRincianPesananPenjualanDendaJasa()
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
                    <p className="text-sm pr-2 font-medium">{convertTo12HoursFormat(riwayatPelunasanPenjualanJasa.tanggal.split("T")[1])}</p>
                    <p className="text-sm pr-2 font-medium px-3 border-l-2 border-black">Pelunasan Penjualan Jasa</p>
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
                        JSON.parse(riwayatPelunasanPenjualanJasa.perintah_stok_opname_nomor_surat_perintah)?.hasil_stok_opname_count == 0 ? <></>
                            :
                            <p className="text-xs font-medium text-green-600 my-3">{JSON.parse(riwayatPelunasanPenjualanJasa.perintah_stok_opname_nomor_surat_perintah)?.nomor_perintah_stok_opname ? `Telah Terdaftar Pada Surat Perintah Stok Opname ${JSON.parse(riwayatPelunasanPenjualanJasa.perintah_stok_opname_nomor_surat_perintah)?.nomor_perintah_stok_opname}` : ""}</p>
                    }
                    {
                        detailOpen ? <>
                            <table className="text-left text-sm">
                                <tr>
                                    <td className={`${edited ? "pb-3" : ""}`}>Nomor Pelunasan Penjualan Jasa</td>
                                    <td className={`px-5 ${edited ? "pb-3" : ""}`}>:</td>
                                    <td className={`${edited ? "pb-3" : ""}`}>
                                        {
                                            edited ? <FormInput
                                                addClass={"px-0"}
                                                name={"nomor_pelunasan_penjualan_jasa"}
                                                value={nomorPelunasanPenjualanJasa}
                                                onchange={(e) => setNomorPelunasanPenjualanJasa(e.target.value)}
                                            /> : riwayatPelunasanPenjualanJasa.nomor_transaksi
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
                                                value={buktiTransaksiPelunasanPenjualanJasa}
                                                onchange={(e) => setBuktiTransaksiPelunasanPenjualanJasa(e.target.value)}
                                            /> : riwayatPelunasanPenjualanJasa.bukti_transaksi
                                        }
                                    </td>
                                </tr>
                                <tr>
                                    <td className={`${edited ? "pb-5" : ""}`}>Kode Akun</td>
                                    <td className={`px-5 ${edited ? "pb-5" : ""}`}>:</td>
                                    <td className={`${edited ? "pb-5" : ""}`}>{riwayatPelunasanPenjualanJasa.kode_akun_perkiraan_code} - {riwayatPelunasanPenjualanJasa.kode_akun_perkiraan_name}</td>
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
                                        value={keteranganPelunasanPenjualanJasa}
                                        onchange={(e) => setKeteranganPelunasanPenjualanJasa(e.target.value)}
                                    /> : riwayatPelunasanPenjualanJasa.keterangan
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
                                    {
                                        dendaOpen == 1 ?
                                            <>
                                                <div className="overflow-x-auto mt-5 max-h-[20vh] no-scrollbar pb-4">
                                                    <table className="table table-sm table-zebra rounded-xl">
                                                        <thead className="bg-blue-950 z-10 text-white sticky top-0">
                                                            <th>No.</th>
                                                            <th>Kode Jasa</th>
                                                            <th>Nama Jasa</th>
                                                            <th>Satuan Jasa</th>
                                                            <th>Gudang Asal</th>
                                                            <th>Hari Terlewat</th>
                                                            <th>Total Denda</th>
                                                            <th>Denda Sudah Dibayar</th>
                                                            <th>Piutang Denda</th>
                                                            <th width={200}>Nilai Pelunasan</th>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                listPelunasanPenjualanDendaJasa.map((x, i) => {
                                                                    return <>
                                                                        <tr>
                                                                            <td>{i + 1}.</td>
                                                                            <td>{x.kategori_harga_jasa_kode_jasa}</td>
                                                                            <td>{x.daftar_jasa_name}</td>
                                                                            <td>{x.satuan_jasa_name}</td>
                                                                            <td>{x.daftar_gudang_name}</td>
                                                                            <td>{x.hari_terlewat} Hari</td>
                                                                            <td>Rp. {parseToRupiahText(x.total_denda)}</td>
                                                                            <td>Rp. {parseToRupiahText(x.denda_sudah_dibayar)}</td>
                                                                            <td>Rp. {parseToRupiahText((x.piutang_denda))}</td>
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
                                                                                                inputOnlyRupiah(e, x.piutang_denda)
                                                                                                _updateNilaiPelunasanDenda(e.target.value, x.uuid)
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
                                                                    _saveRincianPelunasanPenjualanDendaJasa()
                                                                }}
                                                            >
                                                                Simpan
                                                            </button>
                                                        </div>
                                                    </> : <></>
                                                }
                                            </>
                                            :
                                            <>
                                                <div className="overflow-x-auto mt-5 max-h-[20vh] no-scrollbar pb-4">
                                                    <table className="table table-sm table-zebra rounded-xl">
                                                        <thead className="bg-blue-950 z-10 text-white sticky top-0">
                                                            <th>No.</th>
                                                            <th>Kode Jasa</th>
                                                            <th>Nama Jasa</th>
                                                            <th>Satuan Jasa</th>
                                                            <th>Gudang Asal</th>
                                                            <th>Pelunasan Sudah Dibayar</th>
                                                            <th>Piutang</th>
                                                            <th width={200}>Nilai Pelunasan</th>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                listPelunasanPenjualanJasa.map((x, i) => {
                                                                    return <>
                                                                        <tr>
                                                                            <td>{i + 1}.</td>
                                                                            <td>{x.kategori_harga_jasa_kode_jasa}</td>
                                                                            <td>{x.daftar_jasa_name}</td>
                                                                            <td>{x.satuan_jasa_name}</td>
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
                                                                    _saveRincianPelunasanPenjualanJasa()
                                                                }}
                                                            >
                                                                Simpan
                                                            </button>
                                                        </div>
                                                    </> : <></>
                                                }
                                            </>
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
export default RiwayatTransaksiPelunasanPenjualanJasa