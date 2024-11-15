import { useEffect, useState } from "react"
import RiwayatTransaksiPelunasanPembelianBarang from "./RiwayatTransaksiPelunasanPembelianBarang"
import { apiFakturPembelianBarangCRUD, apiKodeAkunCRUD, apiPelunasanPembelianBarangCRUD, apiPengembalianDendaPembelianBarangCRUD, apiReturPembelianBarangCRUD } from "../../../../../service/endPointList.api"
import { getNormalizedByDate } from "../../../../../helper/jurnalUmum.helper"
import { formatDate, getHariTanggalFormated, getHariTanggalFull } from "../../../../../helper/date.helper"
import FormInputWithLabel from "../../../../../component/form/FormInputWithLabel"
import FormSelectWithLabel from "../../../../../component/form/FormSelectWithLabel"
import { FaSave } from "react-icons/fa"
import { formValidation, showAlert, showError } from "../../../../../helper/form.helper"
import RiwayatTransaksiReturPembelianBarang from "./RiwayatTransaksiReturPembelianBarang"
import RiwayatTransaksiPengembalianDendaPembelianBarang from "./RiwayatTransaksiPengembalianDendaPembelianBarang"

const RiwayatTransaksiPembelianBarang = ({
    fakturPembelianBarang,
    setFakturCancel = () => { },
    setTanggalTransaksiAkhir = () => { }
}) => {

    const [tanggal, setTanggal] = useState(getHariTanggalFull())
    const [tipeTransaksi, setTipeTransaksi] = useState({
        label: "Pelunasan",
        value: "Pelunasan"
    })
    const tipeTransaksiPembelianBarang = ["Pelunasan", "Retur", "Pengembalian_Denda"]
    const [kodeAkun, setKodeAkun] = useState()
    const [kodeAkunList, setKodeAkunList] = useState([])

    const [riwayatTransaksi, setRiwayatTransaksi] = useState([])
    const [reloadRiwayat, setReloadRiwayat] = useState(true)

    const [tipeTransaksiList, setTipeTransaksiList] = useState([])

    const _getDaftarRiwayatTransaksi = () => {
        setReloadRiwayat(x => x = false)
        setFakturCancel(x => x = true)
        setTipeTransaksiList(x => x = tipeTransaksiPembelianBarang.filter(x => x != "Pengembalian_Denda").map(x => {
            return {
                label: x.replace("_", " "),
                value: x
            }
        }))
        if (fakturPembelianBarang) {
            apiFakturPembelianBarangCRUD
                .custom("/riwayat_transaksi/" + fakturPembelianBarang.uuid)
                .then(resData => {
                    if (resData.data.length > 0) {
                        setFakturCancel(x => x = false)
                        setTanggalTransaksiAkhir(x => x = resData.data[0].tanggal)
                        if (resData.data.filter(x => x.type == "retur_pembelian_barang").length > 0) {
                            setTipeTransaksiList(x => x = tipeTransaksiPembelianBarang.map(x => {
                                return {
                                    label: x.replace("_", " "),
                                    value: x
                                }
                            }))
                        }
                    }
                    setRiwayatTransaksi(x => x = getNormalizedByDate(resData.data))
                })
        }
    }

    const _saveRiwayatTransaksi = async (e) => {
        e.preventDefault()
        if (await formValidation(e.target)) {
            let apiCall = apiPelunasanPembelianBarangCRUD

            if (tipeTransaksi.value == "Retur") {
                apiCall = apiReturPembelianBarangCRUD
            }

            if (tipeTransaksi.value == "Pengembalian_Denda") {
                apiCall = apiPengembalianDendaPembelianBarangCRUD
            }

            const data = {
                faktur_pembelian_barang: fakturPembelianBarang.uuid,
                tanggal: tanggal,
                bukti_transaksi: "EMPTY",
                kode_akun_perkiraan: kodeAkun.value,
                keterangan: "EMPTY"
            }

            data[`nomor_${tipeTransaksi.value.toLowerCase()}_pembelian_barang`] = "EMPTY"

            apiCall.custom("", "POST", null, {
                data
            }).then(() => {
                showAlert("Berhasil", "Data Berhasil Disimpan")
                _getDaftarRiwayatTransaksi()
                setTanggal(getHariTanggalFull())
            }).catch(err => showError(err))
        }
    }

    const _getKodeAkunKasBank = () => {
        apiKodeAkunCRUD
            .custom("/kas_bank", "GET")
            .then(resData => {
                setKodeAkunList(x => x = resData.data)
                if (resData.data.length > 0) {
                    setKodeAkun({
                        label: `${resData.data[0].code} - ${resData.data[0].name}`,
                        value: resData.data[0].uuid
                    })
                }
            })
    }

    const _getKodeAkunHutangUsaha = () => {
        apiKodeAkunCRUD
            .custom("/hutang_usaha", "GET")
            .then(resData => {
                const data = [resData.data]
                setKodeAkunList(x => x = data)
                if (data.length > 0) {
                    setKodeAkun({
                        label: `${data[0].code} - ${data[0].name}`,
                        value: data[0].uuid
                    })
                }
            })
    }

    useEffect(() => {
        setReloadRiwayat(x => x = true)
    }, [riwayatTransaksi])

    useEffect(() => {
        setKodeAkunList(x => x = [])
        setKodeAkun(x => x = null)
        _getKodeAkunKasBank()
        if (tipeTransaksi.value == "Retur") {
            _getKodeAkunHutangUsaha()

            if (riwayatTransaksi.length > 0) {

                const pelunasanPembelianBarangGet = riwayatTransaksi.filter(x => {
                    return x.data.filter(y => y.type == "pelunasan_pembelian_barang").length > 0
                })


                if (pelunasanPembelianBarangGet.length > 0) {
                    const pelunasanPembelianBarangGetData = pelunasanPembelianBarangGet[0].data.filter(x => x.type == "pelunasan_pembelian_barang")

                    if (pelunasanPembelianBarangGetData.length > 0) {

                        apiPelunasanPembelianBarangCRUD
                            .custom(`/cek_denda_pelunasan_pembelian/${pelunasanPembelianBarangGetData[0].uuid}`, "GET")
                            .then(resData => {
                                if (resData.data == 0) {
                                    _getKodeAkunKasBank()
                                }
                            }).catch(err => showError(err))
                    }
                }
            }
        }
    }, [tipeTransaksi])

    useEffect(() => {
        _getDaftarRiwayatTransaksi()
        _getKodeAkunKasBank()
    }, [])

    return <>
        <div className="bg-white rounded-md mt-4 py-6 px-6 shadow-2xl">
            <h1 className="text-xl font-extrabold w-max text-white px-2 rounded-md bg-blue-900 mb-4">Riwayat Transaksi Pembelian Barang</h1>
            <form className="mb-5 border-[3px] rounded-md py-2 px-3" onSubmit={(e) => _saveRiwayatTransaksi(e)}>
                <div className="flex gap-x-2">
                    <FormInputWithLabel
                        label={"Tanggal"}
                        type={"datetime-local"}
                        onchange={(e) => {
                            setTanggal(e.target.value)
                        }}
                        others={
                            {
                                value: tanggal,
                                name: "tanggal",
                            }
                        }
                    />
                    <FormSelectWithLabel
                        label={"Tipe Transaksi"}
                        addClass={"z-50"}
                        optionsDataList={tipeTransaksiList}
                        onchange={(e) => {
                            setTipeTransaksi(e)
                        }}
                        optionsLabel={"label"}
                        optionsValue={"value"}
                        selectName={"tipe_transaksi"}
                        selectValue={tipeTransaksi}
                    />
                    <FormSelectWithLabel
                        label={"Kode Akun"}
                        optionsDataList={kodeAkunList}
                        optionsLabel={["code", "name"]}
                        optionsValue={"uuid"}
                        addClass={"z-50"}
                        optionsLabelIsArray={true}
                        optionsDelimiter={"-"}
                        selectValue={kodeAkun}
                        onchange={(e) => {
                            setKodeAkun(e)
                        }}
                        selectName={`kodeAkun`}
                    />
                </div>
                <button className="btn btn-sm bg-green-800 mt-4 text-white">
                    <FaSave /> Simpan
                </button>
            </form>
            <div className="flex flex-col max-h-[60vh] overflow-scroll no-scrollbar relative">
                {
                    reloadRiwayat ? <>
                        {
                            riwayatTransaksi.map((x, i) => {
                                return <div className="mb-5">
                                    <p className="font-bold mb-3 sticky top-0 bg-gray-300 p-2 z-20">{getHariTanggalFormated("/", formatDate(x.parent, false))}</p>
                                    <div className="flex flex-col">
                                        {
                                            x.data.map((y, j) => {
                                                return <>
                                                    {
                                                        y.type == "pelunasan_pembelian_barang" ? <>
                                                            <RiwayatTransaksiPelunasanPembelianBarang
                                                                riwayatPelunasanPembelianBarang={y}
                                                                edited={JSON.parse(y.perintah_stok_opname_nomor_surat_perintah).hasil_stok_opname_count > 0 ? false : i == 0 && j == 0}
                                                                _getDaftarRiwayatTransaksi={_getDaftarRiwayatTransaksi}
                                                            />
                                                        </> : <></>
                                                    }
                                                    {
                                                        y.type == "retur_pembelian_barang" ? <>
                                                            <RiwayatTransaksiReturPembelianBarang
                                                                riwayatReturPembelianBarang={y}
                                                                edited={JSON.parse(y.perintah_stok_opname_nomor_surat_perintah).hasil_stok_opname_count > 0 ? false : i == 0 && j == 0}
                                                                _getDaftarRiwayatTransaksi={_getDaftarRiwayatTransaksi}
                                                            />
                                                        </> : <></>
                                                    }
                                                    {
                                                        y.type == "pengembalian_denda_pembelian_barang" ? <>
                                                            <RiwayatTransaksiPengembalianDendaPembelianBarang
                                                                riwayatPengembalianDendaPembelianBarang={y}
                                                                edited={JSON.parse(y.perintah_stok_opname_nomor_surat_perintah).hasil_stok_opname_count > 0 ? false : i == 0 && j == 0}
                                                                _getDaftarRiwayatTransaksi={_getDaftarRiwayatTransaksi}
                                                            />
                                                        </> : <></>
                                                    }
                                                </>
                                            })
                                        }
                                    </div>
                                </div>
                            })
                        }
                    </> : <>
                        <p className="font-bold">Riwayat Transaksi Belum Ada.</p>
                    </>
                }
            </div>
        </div>
    </>
}
export default RiwayatTransaksiPembelianBarang