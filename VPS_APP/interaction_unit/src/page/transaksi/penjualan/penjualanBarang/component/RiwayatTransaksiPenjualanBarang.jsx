import { useEffect, useState } from "react"
import RiwayatTransaksiPelunasanPenjualanBarang from "./RiwayatTransaksiPelunasanPenjualanBarang"
import { apiFakturPenjualanBarangCRUD, apiKodeAkunCRUD, apiPelunasanPenjualanBarangCRUD, apiReturPenjualanBarangCRUD } from "../../../../../service/endPointList.api"
import { getNormalizedByDate } from "../../../../../helper/jurnalUmum.helper"
import { formatDate, getHariTanggalFormated, getHariTanggalFull } from "../../../../../helper/date.helper"
import FormInputWithLabel from "../../../../../component/form/FormInputWithLabel"
import FormSelectWithLabel from "../../../../../component/form/FormSelectWithLabel"
import { FaSave } from "react-icons/fa"
import { formValidation } from "../../../../../helper/form.helper"
import RiwayatTransaksiReturPenjualanBarang from "./RiwayatTransaksiReturPenjualanBarang"

const RiwayatTransaksiPenjualanBarang = ({
    fakturPenjualanBarang,
    setFakturCancel = () => { }
}) => {

    const [tanggal, setTanggal] = useState(getHariTanggalFull())
    const [tipeTransaksi, setTipeTransaksi] = useState({
        label: "Pelunasan",
        value: "Pelunasan"
    })
    const tipeTransaksiPenjualanBarang = ["Pelunasan", "Retur", "Pengembalian_Denda"]
    const [kodeAkun, setKodeAkun] = useState()
    const [kodeAkunList, setKodeAkunList] = useState([])

    const [riwayatTransaksi, setRiwayatTransaksi] = useState([])
    const [reloadRiwayat, setReloadRiwayat] = useState(true)

    const _getDaftarRiwayatTransaksi = () => {
        setReloadRiwayat(x => x = false)
        setFakturCancel(x => x = true)
        if (fakturPenjualanBarang) {
            apiFakturPenjualanBarangCRUD
                .custom("/riwayat_transaksi/" + fakturPenjualanBarang.uuid)
                .then(resData => {
                    if (resData.data.length > 0) {
                        setFakturCancel(x => x = false)
                    }
                    setRiwayatTransaksi(x => x = getNormalizedByDate(resData.data))
                })
        }
    }

    const _saveRiwayatTransaksi = async (e) => {
        e.preventDefault()
        if (await formValidation(e.target)) {
            let apiCall = apiPelunasanPenjualanBarangCRUD

            if (tipeTransaksi.value == "Retur") {
                apiCall = apiReturPenjualanBarangCRUD
            }

            if (tipeTransaksi.value == "Pengembalian_Denda") {

            }

            const data = {
                faktur_penjualan_barang: fakturPenjualanBarang.uuid,
                tanggal: tanggal,
                bukti_transaksi: "EMPTY",
                kode_akun_perkiraan: kodeAkun.value,
                keterangan: "EMPTY"
            }

            data[`nomor_${tipeTransaksi.value.toLowerCase()}_penjualan_barang`] = "EMPTY"

            apiCall.custom("", "POST", null, {
                data
            }).then(() => {
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

    useEffect(() => {
        setReloadRiwayat(x => x = true)
    }, [riwayatTransaksi])

    useEffect(() => {
        _getDaftarRiwayatTransaksi()
        _getKodeAkunKasBank()
    }, [])

    return <>
        <div className="bg-white rounded-md mt-4 py-6 px-6 shadow-2xl">
            <h1 className="text-xl font-extrabold w-max text-white px-2 rounded-md bg-blue-900 mb-4">Riwayat Transaksi Penjualan Barang</h1>
            <form className="mb-5" onSubmit={(e) => _saveRiwayatTransaksi(e)}>
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
                        optionsDataList={tipeTransaksiPenjualanBarang.map(x => {
                            return {
                                label: x,
                                value: x
                            }
                        })}
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
                                    <p className="font-bold mb-3 sticky top-0 bg-gray-300 p-2 rounded-md z-40">{getHariTanggalFormated("/", formatDate(x.parent, false))}</p>
                                    <div className="flex flex-col">
                                        {
                                            x.data.map((y, j) => {
                                                return <>
                                                    {
                                                        y.type == "pelunasan_penjualan_barang" ? <>
                                                            <RiwayatTransaksiPelunasanPenjualanBarang
                                                                riwayatPelunasanPenjualanBarang={y}
                                                                edited={i == 0 && j == 0}
                                                                _getDaftarRiwayatTransaksi={_getDaftarRiwayatTransaksi}
                                                            />
                                                        </> : <></>
                                                    }{
                                                        y.type == "retur_penjualan_barang" ? <>
                                                            <RiwayatTransaksiReturPenjualanBarang
                                                                riwayatReturPenjualanBarang={y}
                                                                edited={i == 0 && j == 0}
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
export default RiwayatTransaksiPenjualanBarang