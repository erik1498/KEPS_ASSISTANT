import { useEffect, useState } from "react"
import { parseRupiahToFloat, parseToRupiahText } from "../../../../../helper/number.helper"
import { FaCheck, FaChevronDown, FaChevronUp, FaTrash } from "react-icons/fa"
import { convertTo12HoursFormat } from "../../../../../helper/date.helper"
import { apiReturPembelianBarangCRUD, apiRincianReturPembelianBarangCRUD } from "../../../../../service/endPointList.api"
import { deleteAllFormMessage, formValidation, showError } from "../../../../../helper/form.helper"
import FormInput from "../../../../../component/form/FormInput"
import { inputOnlyRupiah } from "../../../../../helper/actionEvent.helper"

const RiwayatTransaksiReturPembelianBarang = ({
    riwayatReturPembelianBarang,
    edited,
    _getDaftarRiwayatTransaksi = () => { },
}) => {

    const [nomorReturPembelianBarang, setNomorReturPembelianBarang] = useState(riwayatReturPembelianBarang.nomor_transaksi != "EMPTY" ? riwayatReturPembelianBarang.nomor_transaksi : "")
    const [buktiTransaksiReturPembelianBarang, setBuktiTransaksiReturPembelianBarang] = useState(riwayatReturPembelianBarang.bukti_transaksi != "EMPTY" ? riwayatReturPembelianBarang.bukti_transaksi : "")
    const [keteranganReturPembelianBarang, setKeteranganReturPembelianBarang] = useState(riwayatReturPembelianBarang.keterangan != "EMPTY" ? riwayatReturPembelianBarang.keterangan : "Tidak Ada")

    const [totalRetur, setTotalRetur] = useState(riwayatReturPembelianBarang.total)
    const [listOpen, setListOpen] = useState(false)
    const [listReturPembelianBarang, setListReturPembelianBarang] = useState([])

    const [listRincian, setListRincian] = useState(false)
    const [detailOpen, setDetailOpen] = useState(edited)

    const _getRincianPesananPembelianBarang = () => {
        apiRincianReturPembelianBarangCRUD
            .custom(`/pesanan/${riwayatReturPembelianBarang.uuid}`)
            .then(resData => {
                setListReturPembelianBarang(resData.data)
            }).catch(err => showError(err))
    }

    const _updateNilaiRetur = (value, uuid) => {
        let listReturPembelianBarangCopy = listReturPembelianBarang

        let totalReturCopy = 0
        listReturPembelianBarangCopy = listReturPembelianBarangCopy.map(x => {
            if (x.uuid == uuid) {
                x.retur = value
                x.nilai_retur = (x.harga_setelah_diskon + x.ppn_setelah_diskon) * parseRupiahToFloat(value)

                if (x.nilai_retur > x.sudah_dibayar_fix) {
                    x.nilai_retur = x.sudah_dibayar_fix
                }
            }
            totalReturCopy += parseRupiahToFloat(x.nilai_retur)
            return x
        })
        setTotalRetur(x => x = totalReturCopy)
        setListReturPembelianBarang(x => x = listReturPembelianBarangCopy)
    }

    const _saveRincianReturPembelianBarang = async () => {
        for (let index = 0; index < listReturPembelianBarang.length; index++) {
            await apiRincianReturPembelianBarangCRUD
                .custom(`${listReturPembelianBarang[index].rincian_retur_Pembelian_barang ? `/${listReturPembelianBarang[index].rincian_retur_Pembelian_barang}` : ""}`, listReturPembelianBarang[index].rincian_retur_Pembelian_barang ? "PUT" : "POST", null, {
                    data: {
                        retur_Pembelian_barang: riwayatReturPembelianBarang.uuid,
                        rincian_pesanan_Pembelian_barang: listReturPembelianBarang[index].uuid,
                        jumlah: `${listReturPembelianBarang[index].jumlah_fix}`,
                        denda_sudah_dibayar: `${listReturPembelianBarang[index].denda_sudah_dibayar}`,
                        sudah_dibayar: `${listReturPembelianBarang[index].sudah_dibayar_fix}`,
                        retur: `${listReturPembelianBarang[index].retur}`,
                        nilai_retur: `${listReturPembelianBarang[index].nilai_retur}`,
                        retur_sebelum: `${listReturPembelianBarang[index].retur_sebelum}`,
                        nilai_retur_sebelum: `${listReturPembelianBarang[index].nilai_retur_sebelum}`
                    }
                })
        }
        _getRincianPesananPembelianBarang()
    }

    const _deleteRiwayatReturPembelian = () => {
        apiReturPembelianBarangCRUD
            .custom("/" + riwayatReturPembelianBarang.uuid, "DELETE")
            .then(() => {
                _getDaftarRiwayatTransaksi()
            }).catch(err => showError(err))
    }

    const _updateRiwayatReturPembelian = async () => {
        await deleteAllFormMessage()

        if (await formValidation()) {
            apiReturPembelianBarangCRUD
                .custom("/" + riwayatReturPembelianBarang.uuid, "PUT", null, {
                    data: {
                        nomor_retur_Pembelian_barang: nomorReturPembelianBarang,
                        bukti_transaksi: buktiTransaksiReturPembelianBarang,
                        keterangan: keteranganReturPembelianBarang,
                        faktur_Pembelian_barang: riwayatReturPembelianBarang.faktur_Pembelian_barang,
                        tanggal: riwayatReturPembelianBarang.tanggal,
                        kode_akun_perkiraan: riwayatReturPembelianBarang.kode_akun_perkiraan,
                    }
                }).catch(err => showError(err))
        }
    }

    useEffect(() => {
        if (listRincian && !listOpen) {
            _getRincianPesananPembelianBarang()
            setListOpen(x => x = true)
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
                    <p className="text-sm pr-2 font-medium">{convertTo12HoursFormat(riwayatReturPembelianBarang.tanggal.split("T")[1])}</p>
                    <p className="text-sm pr-2 font-medium px-4 border-l-2 border-black">Retur Pembelian Barang</p>
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
                                    <td className={`${edited ? "pb-3" : ""}`}>Nomor Retur Pembelian Barang</td>
                                    <td className={`px-5 ${edited ? "pb-3" : ""}`}>:</td>
                                    <td className={`${edited ? "pb-3" : ""}`}>
                                        {
                                            edited ? <FormInput
                                                addClass={"px-0"}
                                                name={"nomor_retur_Pembelian_barang"}
                                                value={nomorReturPembelianBarang}
                                                onchange={(e) => setNomorReturPembelianBarang(e.target.value)}
                                            /> : riwayatReturPembelianBarang.nomor_transaksi
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
                                                value={buktiTransaksiReturPembelianBarang}
                                                onchange={(e) => setBuktiTransaksiReturPembelianBarang(e.target.value)}
                                            /> : riwayatReturPembelianBarang.bukti_transaksi
                                        }
                                    </td>
                                </tr>
                                <tr>
                                    <td className={`${edited ? "pb-5" : ""}`}>Kode Akun</td>
                                    <td className={`px-5 ${edited ? "pb-5" : ""}`}>:</td>
                                    <td className={`${edited ? "pb-5" : ""}`}>{riwayatReturPembelianBarang.kode_akun_perkiraan_name}</td>
                                </tr>
                                <tr>
                                    <td className={`${edited ? "pb-3" : ""}`}>Total Retur</td>
                                    <td className={`px-5 ${edited ? "pb-3" : ""}`}>:</td>
                                    <td className={`${edited ? "pb-3" : ""}`}>Rp. {parseToRupiahText(totalRetur)}</td>
                                </tr>
                            </table>
                            <p className={`text-sm mt-3 ${edited ? "mt-5" : ""}`}>Keterangan</p>
                            <p className="text-sm mb-3">
                                {
                                    edited ? <FormInput
                                        addClass={"mt-5"}
                                        name={"keterangan"}
                                        value={keteranganReturPembelianBarang}
                                        onchange={(e) => setKeteranganReturPembelianBarang(e.target.value)}
                                    /> : riwayatReturPembelianBarang.keterangan
                                }
                            </p>
                            <div className="my-2 flex justify-between">
                                <div>
                                    {
                                        edited ? <>
                                            <button
                                                className="mr-2 btn btn-sm bg-green-900 text-white"
                                                onClick={() => _updateRiwayatReturPembelian()}
                                            >
                                                <FaCheck size={12} />
                                                Simpan
                                            </button>
                                            <button
                                                className="mr-2 btn btn-sm bg-red-500 text-white"
                                                onClick={() => _deleteRiwayatReturPembelian()}
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
                                            Tutup Daftar Retur
                                        </button>
                                    </> : <>
                                        <button
                                            className="btn btn-sm bg-white border-gray-400"
                                            onClick={() => setListRincian(x => x = !x)}
                                        >
                                            Lihat Daftar Retur
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
                                                <th width={150}>Retur Sebelumnya</th>
                                                <th width={150}>Retur</th>
                                                <th>Nilai Retur</th>
                                            </thead>
                                            <tbody>
                                                {
                                                    listReturPembelianBarang.map((x, i) => {
                                                        return <>
                                                            <tr>
                                                                <td>{i + 1}.</td>
                                                                <td>{x.kategori_harga_barang_kode_barang}</td>
                                                                <td>{x.daftar_barang_name}</td>
                                                                <td>{x.satuan_barang_name}</td>
                                                                <td>{x.daftar_gudang_name}</td>
                                                                <td>Rp. {parseToRupiahText(x.sudah_dibayar_fix)}</td>
                                                                <td>{parseToRupiahText(x.retur_sebelum)} {x.satuan_barang_name}</td>
                                                                <td>
                                                                    {
                                                                        edited ? <>
                                                                            <FormInput
                                                                                name={"retur"}
                                                                                type={"text"}
                                                                                other={{
                                                                                    defaultValue: 0
                                                                                }}
                                                                                onchange={(e) => {
                                                                                    inputOnlyRupiah(e, x.jumlah_fix)
                                                                                    _updateNilaiRetur(e.target.value, x.uuid)
                                                                                }}
                                                                                value={parseToRupiahText(x.retur)}
                                                                            />
                                                                        </> : <>
                                                                            {parseToRupiahText(x.retur)} {x.satuan_barang_name}
                                                                        </>
                                                                    }
                                                                </td>
                                                                <td>Rp. {parseToRupiahText(x.nilai_retur)}</td>
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
                                                        _saveRincianReturPembelianBarang()
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
export default RiwayatTransaksiReturPembelianBarang