import { useEffect, useState } from "react"
import { parseRupiahToFloat, parseToRupiahText } from "../../../../../helper/number.helper"
import { FaCheck, FaChevronDown, FaChevronUp, FaTrash } from "react-icons/fa"
import { convertTo12HoursFormat } from "../../../../../helper/date.helper"
import { apiPelunasanPembelianBarangCRUD, apiRincianPelunasanPembelianBarangCRUD, apiRincianPelunasanPembelianDendaBarangCRUD } from "../../../../../service/endPointList.api"
import { deleteAllFormMessage, formValidation, showError } from "../../../../../helper/form.helper"
import FormInput from "../../../../../component/form/FormInput"
import { inputOnlyRupiah } from "../../../../../helper/actionEvent.helper"

const RiwayatTransaksiPelunasanPembelianBarang = ({
    riwayatPelunasanPembelianBarang,
    edited,
    _getDaftarRiwayatTransaksi = () => { },
}) => {

    const [nomorPelunasanPembelianBarang, setNomorPelunasanPembelianBarang] = useState(riwayatPelunasanPembelianBarang.nomor_transaksi != "EMPTY" ? riwayatPelunasanPembelianBarang.nomor_transaksi : "")
    const [buktiTransaksiPelunasanPembelianBarang, setBuktiTransaksiPelunasanPembelianBarang] = useState(riwayatPelunasanPembelianBarang.bukti_transaksi != "EMPTY" ? riwayatPelunasanPembelianBarang.bukti_transaksi : "")
    const [keteranganPelunasanPembelianBarang, setKeteranganPelunasanPembelianBarang] = useState(riwayatPelunasanPembelianBarang.keterangan != "EMPTY" ? riwayatPelunasanPembelianBarang.keterangan : "Tidak Ada")

    const [totalPelunasan, setTotalPelunasan] = useState(riwayatPelunasanPembelianBarang.total)
    const [dendaOpen, setDendaOpen] = useState(false)
    const [listPelunasanPembelianBarang, setListPelunasanPembelianBarang] = useState([])
    const [listPelunasanPembelianDendaBarang, setListPelunasanPembelianDendaBarang] = useState([])

    const [listRincian, setListRincian] = useState(false)
    const [detailOpen, setDetailOpen] = useState(edited)

    const _cekDendaFakturPembelian = () => {
        apiPelunasanPembelianBarangCRUD
            .custom(`/cek_denda_pelunasan_pembelian/${riwayatPelunasanPembelianBarang.uuid}`, "GET")
            .then(resData => {
                setDendaOpen(x => x = resData.data)
            }).catch(err => showError(err))
    }

    const _getRincianPesananPembelianBarang = () => {
        apiRincianPelunasanPembelianBarangCRUD
            .custom(`/pesanan/${riwayatPelunasanPembelianBarang.uuid}`)
            .then(resData => {
                setListPelunasanPembelianBarang(resData.data)
            }).catch(err => showError(err))
    }

    const _getRincianPesananPembelianDendaBarang = () => {
        apiRincianPelunasanPembelianDendaBarangCRUD
            .custom(`/pesanan/${riwayatPelunasanPembelianBarang.uuid}`)
            .then(resData => {
                setListPelunasanPembelianDendaBarang(resData.data)
            }).catch(err => showError(err))
    }

    const _updateNilaiPelunasan = (value, uuid) => {
        let listPelunasanPembelianBarangCopy = listPelunasanPembelianBarang

        let totalPelunasanCopy = 0
        listPelunasanPembelianBarangCopy = listPelunasanPembelianBarangCopy.map(x => {
            if (x.uuid == uuid) {
                x.nilai_pelunasan = value
            }
            totalPelunasanCopy += parseRupiahToFloat(x.nilai_pelunasan)
            return x
        })
        setTotalPelunasan(x => x = totalPelunasanCopy)
        setListPelunasanPembelianBarang(x => x = listPelunasanPembelianBarangCopy)
    }

    const _updateNilaiPelunasanDenda = (value, uuid) => {
        let listPelunasanPembelianDendaBarangCopy = listPelunasanPembelianDendaBarang

        let totalPelunasanCopy = 0
        listPelunasanPembelianDendaBarangCopy = listPelunasanPembelianDendaBarangCopy.map(x => {
            if (x.uuid == uuid) {
                x.nilai_pelunasan = value
            }
            totalPelunasanCopy += parseRupiahToFloat(x.nilai_pelunasan)
            return x
        })
        setTotalPelunasan(x => x = totalPelunasanCopy)
        setListPelunasanPembelianDendaBarang(x => x = listPelunasanPembelianDendaBarangCopy)
    }

    const _saveRincianPelunasanPembelianDendaBarang = async () => {
        for (let index = 0; index < listPelunasanPembelianDendaBarang.length; index++) {
            await apiRincianPelunasanPembelianDendaBarangCRUD
                .custom(`${listPelunasanPembelianDendaBarang[index].rincian_pelunasan_pembelian_denda_barang ? `/${listPelunasanPembelianDendaBarang[index].rincian_pelunasan_pembelian_denda_barang}` : ""}`, listPelunasanPembelianDendaBarang[index].rincian_pelunasan_pembelian_denda_barang ? "PUT" : "POST", null, {
                    data: {
                        pelunasan_pembelian_barang: riwayatPelunasanPembelianBarang.uuid,
                        rincian_pesanan_pembelian_barang: listPelunasanPembelianDendaBarang[index].uuid,
                        hari_terlewat: listPelunasanPembelianDendaBarang[index].hari_terlewat,
                        total_denda: listPelunasanPembelianDendaBarang[index].total_denda,
                        denda_sudah_dibayar: listPelunasanPembelianDendaBarang[index].denda_sudah_dibayar,
                        piutang_denda: listPelunasanPembelianDendaBarang[index].total_denda - listPelunasanPembelianDendaBarang[index].denda_sudah_dibayar,
                        nilai_pelunasan: `${listPelunasanPembelianDendaBarang[index].nilai_pelunasan}`,
                    }
                })
        }
        _getRincianPesananPembelianDendaBarang()
    }

    const _saveRincianPelunasanPembelianBarang = async () => {
        for (let index = 0; index < listPelunasanPembelianBarang.length; index++) {
            await apiRincianPelunasanPembelianBarangCRUD
                .custom(`${listPelunasanPembelianBarang[index].rincian_pelunasan_pembelian_barang ? `/${listPelunasanPembelianBarang[index].rincian_pelunasan_pembelian_barang}` : ""}`, listPelunasanPembelianBarang[index].rincian_pelunasan_pembelian_barang ? "PUT" : "POST", null, {
                    data: {
                        pelunasan_pembelian_barang: riwayatPelunasanPembelianBarang.uuid,
                        rincian_pesanan_pembelian_barang: listPelunasanPembelianBarang[index].uuid,
                        sudah_dibayar: listPelunasanPembelianBarang[index].sudah_dibayar,
                        piutang: listPelunasanPembelianBarang[index].piutang,
                        nilai_pelunasan: `${listPelunasanPembelianBarang[index].nilai_pelunasan}`
                    }
                })
        }
        _getRincianPesananPembelianBarang()
    }

    const _deleteRiwayatPelunasanPembelian = () => {
        apiPelunasanPembelianBarangCRUD
            .custom("/" + riwayatPelunasanPembelianBarang.uuid, "DELETE")
            .then(() => {
                _getDaftarRiwayatTransaksi()
            }).catch(err => showError(err))
    }

    const _updateRiwayatPelunasanPembelian = async () => {
        await deleteAllFormMessage()

        if (await formValidation()) {
            apiPelunasanPembelianBarangCRUD
                .custom("/" + riwayatPelunasanPembelianBarang.uuid, "PUT", null, {
                    data: {
                        nomor_pelunasan_pembelian_barang: nomorPelunasanPembelianBarang,
                        bukti_transaksi: buktiTransaksiPelunasanPembelianBarang,
                        keterangan: keteranganPelunasanPembelianBarang,
                        faktur_pembelian_barang: riwayatPelunasanPembelianBarang.faktur_pembelian_barang,
                        tanggal: riwayatPelunasanPembelianBarang.tanggal,
                        kode_akun_perkiraan: riwayatPelunasanPembelianBarang.kode_akun_perkiraan,
                    }
                }).catch(err => showError(err))
        }
    }

    useEffect(() => {
        if (dendaOpen == 0) {
            _getRincianPesananPembelianBarang()
        } else {
            _getRincianPesananPembelianDendaBarang()
        }
    }, [dendaOpen])

    useEffect(() => {
        if (listRincian) {
            _cekDendaFakturPembelian()
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
                    <p className="text-sm pr-2 font-medium">{convertTo12HoursFormat(riwayatPelunasanPembelianBarang.tanggal.split("T")[1])}</p>
                    <p className="text-sm pr-2 font-medium px-3 border-l-2 border-black">Pelunasan Pembelian Barang</p>
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
                                    <td className={`${edited ? "pb-3" : ""}`}>Nomor Pelunasan Pembelian Barang</td>
                                    <td className={`px-5 ${edited ? "pb-3" : ""}`}>:</td>
                                    <td className={`${edited ? "pb-3" : ""}`}>
                                        {
                                            edited ? <FormInput
                                                addClass={"px-0"}
                                                name={"nomor_pelunasan_pembelian_barang"}
                                                value={nomorPelunasanPembelianBarang}
                                                onchange={(e) => setNomorPelunasanPembelianBarang(e.target.value)}
                                            /> : riwayatPelunasanPembelianBarang.nomor_transaksi
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
                                                value={buktiTransaksiPelunasanPembelianBarang}
                                                onchange={(e) => setBuktiTransaksiPelunasanPembelianBarang(e.target.value)}
                                            /> : riwayatPelunasanPembelianBarang.bukti_transaksi
                                        }
                                    </td>
                                </tr>
                                <tr>
                                    <td className={`${edited ? "pb-5" : ""}`}>Kode Akun</td>
                                    <td className={`px-5 ${edited ? "pb-5" : ""}`}>:</td>
                                    <td className={`${edited ? "pb-5" : ""}`}>{riwayatPelunasanPembelianBarang.kode_akun_perkiraan_name}</td>
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
                                        value={keteranganPelunasanPembelianBarang}
                                        onchange={(e) => setKeteranganPelunasanPembelianBarang(e.target.value)}
                                    /> : riwayatPelunasanPembelianBarang.keterangan
                                }
                            </p>
                            <div className="my-2 flex justify-between">
                                <div>
                                    {
                                        edited ? <>
                                            <button
                                                className="mr-2 btn btn-sm bg-green-900 text-white"
                                                onClick={() => _updateRiwayatPelunasanPembelian()}
                                            >
                                                <FaCheck size={12} />
                                                Simpan
                                            </button>
                                            <button
                                                className="mr-2 btn btn-sm bg-red-500 text-white"
                                                onClick={() => _deleteRiwayatPelunasanPembelian()}
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
                                                            <th>Kode Barang</th>
                                                            <th>Nama Barang</th>
                                                            <th>Satuan Barang</th>
                                                            <th>Gudang Asal</th>
                                                            <th>Hari Terlewat</th>
                                                            <th>Total Denda</th>
                                                            <th>Denda Sudah Dibayar</th>
                                                            <th>Piutang Denda</th>
                                                            <th width={200}>Nilai Pelunasan</th>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                listPelunasanPembelianDendaBarang.map((x, i) => {
                                                                    return <>
                                                                        <tr>
                                                                            <td>{i + 1}.</td>
                                                                            <td>{x.kategori_harga_barang_kode_barang}</td>
                                                                            <td>{x.daftar_barang_name}</td>
                                                                            <td>{x.satuan_barang_name}</td>
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
                                                                    _saveRincianPelunasanPembelianDendaBarang()
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
                                                                listPelunasanPembelianBarang.map((x, i) => {
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
                                                                    _saveRincianPelunasanPembelianBarang()
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
export default RiwayatTransaksiPelunasanPembelianBarang