import { useEffect, useState } from "react"
import { parseRupiahToFloat, parseToRupiahText } from "../../../../../helper/number.helper"
import { FaCheck, FaChevronDown, FaChevronUp, FaTrash } from "react-icons/fa"
import { convertTo12HoursFormat } from "../../../../../helper/date.helper"
import { apiReturPenjualanJasaCRUD, apiRincianReturPenjualanJasaCRUD } from "../../../../../service/endPointList.api"
import { deleteAllFormMessage, formValidation, showAlert, showError } from "../../../../../helper/form.helper"
import FormInput from "../../../../../component/form/FormInput"
import { inputOnlyRupiah } from "../../../../../helper/actionEvent.helper"

const RiwayatTransaksiReturPenjualanJasa = ({
    riwayatReturPenjualanJasa,
    edited,
    _getDaftarRiwayatTransaksi = () => { },
}) => {

    const [nomorReturPenjualanJasa, setNomorReturPenjualanJasa] = useState(riwayatReturPenjualanJasa.nomor_transaksi != "EMPTY" ? riwayatReturPenjualanJasa.nomor_transaksi : "")
    const [buktiTransaksiReturPenjualanJasa, setBuktiTransaksiReturPenjualanJasa] = useState(riwayatReturPenjualanJasa.bukti_transaksi != "EMPTY" ? riwayatReturPenjualanJasa.bukti_transaksi : "")
    const [keteranganReturPenjualanJasa, setKeteranganReturPenjualanJasa] = useState(riwayatReturPenjualanJasa.keterangan != "EMPTY" ? riwayatReturPenjualanJasa.keterangan : "Tidak Ada")

    const [totalRetur, setTotalRetur] = useState(riwayatReturPenjualanJasa.total)
    const [listOpen, setListOpen] = useState(false)
    const [listReturPenjualanJasa, setListReturPenjualanJasa] = useState([])

    const [listRincian, setListRincian] = useState(false)
    const [detailOpen, setDetailOpen] = useState(edited)

    const _getRincianPesananPenjualanJasa = () => {
        apiRincianReturPenjualanJasaCRUD
            .custom(`/pesanan/${riwayatReturPenjualanJasa.uuid}`)
            .then(resData => {
                setListReturPenjualanJasa(resData.data)
            }).catch(err => showError(err))
    }

    const _updateNilaiRetur = (value, uuid) => {
        let listReturPenjualanJasaCopy = listReturPenjualanJasa

        let totalReturCopy = 0
        listReturPenjualanJasaCopy = listReturPenjualanJasaCopy.map(x => {
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
        setListReturPenjualanJasa(x => x = listReturPenjualanJasaCopy)
    }

    const _saveRincianReturPenjualanJasa = async () => {
        for (let index = 0; index < listReturPenjualanJasa.length; index++) {
            await apiRincianReturPenjualanJasaCRUD
                .custom(`${listReturPenjualanJasa[index].rincian_retur_penjualan_jasa ? `/${listReturPenjualanJasa[index].rincian_retur_penjualan_jasa}` : ""}`, listReturPenjualanJasa[index].rincian_retur_penjualan_jasa ? "PUT" : "POST", null, {
                    data: {
                        retur_penjualan_jasa: riwayatReturPenjualanJasa.uuid,
                        rincian_pesanan_penjualan_jasa: listReturPenjualanJasa[index].uuid,
                        jumlah: `${listReturPenjualanJasa[index].jumlah_fix}`,
                        denda_sudah_dibayar: `${listReturPenjualanJasa[index].denda_sudah_dibayar}`,
                        sudah_dibayar: `${listReturPenjualanJasa[index].sudah_dibayar_fix}`,
                        retur: `${listReturPenjualanJasa[index].retur}`,
                        nilai_retur: `${listReturPenjualanJasa[index].nilai_retur}`,
                        retur_sebelum: `${listReturPenjualanJasa[index].retur_sebelum}`,
                        nilai_retur_sebelum: `${listReturPenjualanJasa[index].nilai_retur_sebelum}`
                    }
                }).then(() => showAlert("Berhasil", "Data Berhasil Disimpan"))
                .catch(err => showError(err))
        }
        _getRincianPesananPenjualanJasa()
    }

    const _deleteRiwayatReturPenjualan = () => {
        apiReturPenjualanJasaCRUD
            .custom("/" + riwayatReturPenjualanJasa.uuid, "DELETE")
            .then(() => {
                _getDaftarRiwayatTransaksi()
            }).catch(err => showError(err))
    }

    const _updateRiwayatReturPenjualan = async () => {
        await deleteAllFormMessage()

        if (await formValidation()) {
            apiReturPenjualanJasaCRUD
                .custom("/" + riwayatReturPenjualanJasa.uuid, "PUT", null, {
                    data: {
                        nomor_retur_penjualan_jasa: nomorReturPenjualanJasa,
                        bukti_transaksi: buktiTransaksiReturPenjualanJasa,
                        keterangan: keteranganReturPenjualanJasa,
                        faktur_penjualan_jasa: riwayatReturPenjualanJasa.faktur_penjualan_jasa,
                        tanggal: riwayatReturPenjualanJasa.tanggal,
                        kode_akun_perkiraan: riwayatReturPenjualanJasa.kode_akun_perkiraan,
                    }
                }).then(() => showAlert("Berhasil", "Data Berhasil Disimpan"))
                .catch(err => showError(err))
        }
    }

    useEffect(() => {
        if (listRincian && !listOpen) {
            _getRincianPesananPenjualanJasa()
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
                    <p className="text-sm pr-2 font-medium">{convertTo12HoursFormat(riwayatReturPenjualanJasa.tanggal.split("T")[1])}</p>
                    <p className="text-sm pr-2 font-medium px-4 border-l-2 border-black">Retur Penjualan Jasa</p>
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
                        JSON.parse(riwayatReturPenjualanJasa.perintah_stok_opname_nomor_surat_perintah)?.hasil_stok_opname_count == 0 ? <></>
                            :
                            <p className="text-xs font-medium text-green-600 my-3">{JSON.parse(riwayatReturPenjualanJasa.perintah_stok_opname_nomor_surat_perintah)?.nomor_perintah_stok_opname ? `Telah Terdaftar Pada Surat Perintah Stok Opname ${JSON.parse(riwayatReturPenjualanJasa.perintah_stok_opname_nomor_surat_perintah)?.nomor_perintah_stok_opname}` : ""}</p>
                    }
                    {
                        detailOpen ? <>
                            <table className="text-left text-sm">
                                <tr>
                                    <td className={`${edited ? "pb-3" : ""}`}>Nomor Retur Penjualan Jasa</td>
                                    <td className={`px-5 ${edited ? "pb-3" : ""}`}>:</td>
                                    <td className={`${edited ? "pb-3" : ""}`}>
                                        {
                                            edited ? <FormInput
                                                addClass={"px-0"}
                                                name={"nomor_retur_penjualan_jasa"}
                                                value={nomorReturPenjualanJasa}
                                                onchange={(e) => setNomorReturPenjualanJasa(e.target.value)}
                                            /> : riwayatReturPenjualanJasa.nomor_transaksi
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
                                                value={buktiTransaksiReturPenjualanJasa}
                                                onchange={(e) => setBuktiTransaksiReturPenjualanJasa(e.target.value)}
                                            /> : riwayatReturPenjualanJasa.bukti_transaksi
                                        }
                                    </td>
                                </tr>
                                <tr>
                                    <td className={`${edited ? "pb-5" : ""}`}>Kode Akun</td>
                                    <td className={`px-5 ${edited ? "pb-5" : ""}`}>:</td>
                                    <td className={`${edited ? "pb-5" : ""}`}>{riwayatReturPenjualanJasa.kode_akun_perkiraan_code} - {riwayatReturPenjualanJasa.kode_akun_perkiraan_name}</td>
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
                                        value={keteranganReturPenjualanJasa}
                                        onchange={(e) => setKeteranganReturPenjualanJasa(e.target.value)}
                                    /> : riwayatReturPenjualanJasa.keterangan
                                }
                            </p>
                            <div className="my-2 flex justify-between">
                                <div>
                                    {
                                        edited ? <>
                                            <button
                                                className="mr-2 btn btn-sm bg-green-900 text-white"
                                                onClick={() => _updateRiwayatReturPenjualan()}
                                            >
                                                <FaCheck size={12} />
                                                Simpan
                                            </button>
                                            <button
                                                className="mr-2 btn btn-sm bg-red-500 text-white"
                                                onClick={() => _deleteRiwayatReturPenjualan()}
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
                                                <th>Kode Jasa</th>
                                                <th>Nama Jasa</th>
                                                <th>Satuan Jasa</th>
                                                <th>Gudang Asal</th>
                                                <th>Pelunasan Sudah Dibayar</th>
                                                <th width={150}>Retur Sebelumnya</th>
                                                <th width={150}>Retur</th>
                                                <th>Nilai Retur</th>
                                            </thead>
                                            <tbody>
                                                {
                                                    listReturPenjualanJasa.map((x, i) => {
                                                        return <>
                                                            <tr>
                                                                <td>{i + 1}.</td>
                                                                <td>{x.kategori_harga_jasa_kode_jasa}</td>
                                                                <td>{x.daftar_jasa_name}</td>
                                                                <td>{x.satuan_jasa_name}</td>
                                                                <td>{x.daftar_gudang_name}</td>
                                                                <td>Rp. {parseToRupiahText(x.sudah_dibayar_fix)}</td>
                                                                <td>{parseToRupiahText(x.retur_sebelum)} {x.satuan_jasa_name}</td>
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
                                                                            {parseToRupiahText(x.retur)} {x.satuan_jasa_name}
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
                                                        _saveRincianReturPenjualanJasa()
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
export default RiwayatTransaksiReturPenjualanJasa