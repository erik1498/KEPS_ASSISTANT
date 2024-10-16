import { useEffect, useState } from "react"
import FormInputWithLabel from "../../../../../component/form/FormInputWithLabel"
import { apiFakturPenjualanBarangCRUD, apiSyaratPembayaranCRUD, apiTipePembayaranCRUD } from "../../../../../service/endPointList.api"
import FormSelectWithLabel from "../../../../../component/form/FormSelectWithLabel"
import { getHariTanggalFull } from "../../../../../helper/date.helper"
import { FaSave, FaTimes } from "react-icons/fa"
import { formValidation, showError } from "../../../../../helper/form.helper"
import RiwayatTransaksiPenjualanBarang from "./RiwayatTransaksiPenjualanBarang"

const FakturPenjualanBarangForm = ({
    pesananPenjualanBarang,
    setFakturStatus = () => { },
    fakturStatus,
    ppnStatus,
    setTanggalTransaksiAkhir = () => { }
}) => {
    const [fakturPenjualanBarang, setFakturPenjualanBarang] = useState()
    const [fakturCancel, setFakturCancel] = useState(true)

    const [tipePembayaranList, setTipePembayaranList] = useState([])
    const [syaratPembayaranList, setSyaratPembayaranList] = useState([])

    const [tanggalFakturPenjualanBarang, setTanggalFakturPenjualanBarang] = useState(getHariTanggalFull())
    const [nomorFakturPenjualanBarang, setNomorFakturPenjualanBarang] = useState()
    const [buktiTransaksi, setBuktiTransaksi] = useState()
    const [tipePembayaran, setTipePembayaran] = useState()
    const [syaratPembayaran, setSyaratPembayaran] = useState()
    const [keteranganFakturPenjualanBarang, setKeteranganFakturPenjualanBarang] = useState()
    const [nomorFakturPajakFakturPenjualanBarang, setNomorFakturPajakFakturPenjualanBarang] = useState("")

    const _getDataTipePembayaran = () => {
        apiTipePembayaranCRUD
            .custom("", "GET")
            .then(resData => {
                setTipePembayaranList(x => x = resData.data.entry)
                if (resData.data.entry.length > 0) {
                    setTipePembayaran(x => x = {
                        label: resData.data.entry[0].name,
                        value: resData.data.entry[0].uuid,
                    })
                }
            })
    }

    const _getDataSyaratPembayaran = () => {
        apiSyaratPembayaranCRUD
            .custom("/type/" + tipePembayaran.value, "GET")
            .then(resData => {
                setSyaratPembayaranList(x => x = resData.data)
                if (resData.data.length > 0) {
                    setSyaratPembayaran(x => x = {
                        label: resData.data[0].name,
                        value: resData.data[0].uuid,
                    })
                }
            })
    }

    const _saveFakturPenjualanBarang = async (e) => {
        e.preventDefault()
        if (await formValidation(e.target)) {
            apiFakturPenjualanBarangCRUD
                .custom("", "POST", null, {
                    data: {
                        pesanan_penjualan_barang: pesananPenjualanBarang.uuid,
                        tanggal: tanggalFakturPenjualanBarang,
                        nomor_faktur_penjualan_barang: nomorFakturPenjualanBarang,
                        bukti_transaksi: buktiTransaksi,
                        tipe_pembayaran: tipePembayaran.value,
                        syarat_pembayaran: syaratPembayaran.value,
                        keterangan: keteranganFakturPenjualanBarang,
                        nomor_faktur_pajak_penjualan_barang: nomorFakturPajakFakturPenjualanBarang ? nomorFakturPajakFakturPenjualanBarang : "EMPTY"
                    }
                }).then(resData => {
                    setFakturStatus(x => x = resData.data.uuid)
                }).catch(err => showError(err))
        }
    }

    const _deleteFakturPenjualanBarang = () => {
        apiFakturPenjualanBarangCRUD
            .custom(`/${fakturStatus}`, "DELETE")
            .then(() => {
                setFakturStatus(x => x = null)
            }).catch(err => showError(err))
    }

    useEffect(() => {
        if (tipePembayaran?.value) {
            _getDataSyaratPembayaran()
        }
    }, [tipePembayaran])

    const _getFakturPenjualan = () => {
        apiFakturPenjualanBarangCRUD
            .custom(`/pesanan_penjualan_barang/${pesananPenjualanBarang.uuid}`, "GET")
            .then(resData => {
                if (resData.data) {
                    setFakturPenjualanBarang(x => x = resData.data)
                    setNomorFakturPenjualanBarang(x => x = resData.data.nomor_faktur_penjualan_barang)
                    setBuktiTransaksi(x => x = resData.data.bukti_transaksi)
                    setTanggalFakturPenjualanBarang(x => x = resData.data.tanggal)
                    setTipePembayaran(x => x = resData.data.tipe_pembayaran_name)
                    setSyaratPembayaran(x => x = resData.data.syarat_pembayaran_name)
                    setKeteranganFakturPenjualanBarang(x => x = resData.data.keterangan)
                    setFakturStatus(x => x = resData.data.uuid)
                    setNomorFakturPajakFakturPenjualanBarang(x => x = resData.data.nomor_faktur_pajak_penjualan_barang != "EMPTY" ? resData.data.nomor_faktur_pajak_penjualan_barang : "")
                }
            }).catch(err => {
                setFakturStatus(x => x = null)
            })
    }

    useEffect(() => {
        if (fakturStatus != null) {
            _getFakturPenjualan()
        } else {
            _getDataTipePembayaran()
        }
    }, [fakturStatus])

    return <>
        <div className="bg-white rounded-md py-6 px-6 shadow-2xl">
            <h1 className="text-xl font-extrabold w-max text-white px-2 rounded-md bg-blue-900 mb-4">Faktur Penjualan Barang</h1>
            <form onSubmit={e => _saveFakturPenjualanBarang(e)}>
                <div className="flex gap-x-2">
                    <FormInputWithLabel
                        label={"Tanggal Faktur Penjualan Barang"}
                        type={"datetime-local"}
                        onchange={(e) => {
                            setTanggalFakturPenjualanBarang(e.target.value)
                        }}
                        disabled={fakturStatus}
                        addClassInput={fakturStatus ? "border-none px-1" : ""}
                        others={
                            {
                                value: tanggalFakturPenjualanBarang,
                                name: "tanggalFakturPenjualanBarang",
                                disabled: fakturStatus
                            }
                        }
                    />
                    <FormInputWithLabel
                        label={"Nomor Faktur Penjualan Barang"}
                        type={"text"}
                        onchange={(e) => {
                            setNomorFakturPenjualanBarang(e.target.value)
                        }}
                        disabled={fakturStatus}
                        addClassInput={fakturStatus ? "border-none px-1" : ""}
                        others={
                            {
                                value: nomorFakturPenjualanBarang,
                                name: "nomorFakturPenjualanBarang",
                                disabled: fakturStatus
                            }
                        }
                    />
                    <FormInputWithLabel
                        label={"Bukti Transaksi"}
                        type={"text"}
                        disabled={fakturStatus}
                        addClassInput={fakturStatus ? "border-none px-1" : ""}
                        onchange={(e) => {
                            setBuktiTransaksi(e.target.value)
                        }}
                        others={
                            {
                                value: buktiTransaksi,
                                name: "buktiTransaksi",
                                disabled: fakturStatus
                            }
                        }
                    />
                    {
                        fakturStatus ? <>
                            <FormInputWithLabel
                                label={"Tipe Pembayaran"}
                                type={"text"}
                                disabled={fakturStatus}
                                addClassInput={fakturStatus ? "border-none px-1" : ""}
                                others={
                                    {
                                        value: tipePembayaran,
                                        name: "tipePembayaran",
                                        disabled: fakturStatus
                                    }
                                }
                            />
                            <FormInputWithLabel
                                label={"Syarat Pembayaran"}
                                type={"text"}
                                disabled={fakturStatus}
                                addClassInput={fakturStatus ? "border-none px-1" : ""}
                                others={
                                    {
                                        value: syaratPembayaran,
                                        name: "syaratPembayaran",
                                        disabled: fakturStatus
                                    }
                                }
                            />
                        </> : <>
                            <FormSelectWithLabel
                                label={"Tipe Pembayaran"}
                                optionsDataList={tipePembayaranList}
                                optionsLabel={"name"}
                                optionsValue={"uuid"}
                                selectValue={tipePembayaran}
                                onchange={(e) => {
                                    setTipePembayaran(e)
                                }}
                                selectName={`tipePembayaran`}
                            />
                            <FormSelectWithLabel
                                label={"Syarat Pembayaran"}
                                optionsDataList={syaratPembayaranList}
                                optionsLabel={"name"}
                                optionsValue={"uuid"}
                                selectValue={syaratPembayaran}
                                onchange={(e) => {
                                    setSyaratPembayaran(e)
                                }}
                                selectName={`syaratPembayaran`}
                            />
                        </>
                    }
                </div>
                <div className="flex gap-x-2">
                    <FormInputWithLabel
                        label={"Keterangan"}
                        type={"text"}
                        disabled={fakturStatus}
                        addClassInput={fakturStatus ? "border-none px-1" : ""}
                        onchange={(e) => {
                            setKeteranganFakturPenjualanBarang(e.target.value)
                        }}
                        others={
                            {
                                value: keteranganFakturPenjualanBarang,
                                name: "keteranganFakturPenjualanBarang",
                                disabled: fakturStatus
                            }
                        }
                    />
                </div>
                {
                    ppnStatus ? <>
                        <div className="flex gap-x-2">
                            <FormInputWithLabel
                                label={"Nomor Faktur Pajak"}
                                type={"text"}
                                disabled={fakturStatus}
                                addClassInput={fakturStatus ? "border-none px-1" : ""}
                                onchange={(e) => {
                                    setNomorFakturPajakFakturPenjualanBarang(e.target.value)
                                }}
                                others={
                                    {
                                        value: nomorFakturPajakFakturPenjualanBarang,
                                        name: "nomorFakturPajakFakturPenjualanBarang",
                                        disabled: fakturStatus
                                    }
                                }
                            />
                        </div>
                    </> : <></>
                }
                {
                    fakturStatus ? <>
                        {
                            fakturCancel ? <>
                                <button
                                    className="btn btn-sm bg-red-800 mt-4 text-white"
                                    type="button"
                                    onClick={() => _deleteFakturPenjualanBarang()}
                                >
                                    <FaTimes /> Batalkan Faktur
                                </button>
                            </> : <></>
                        }
                    </> : <>
                        <button className="btn btn-sm bg-green-800 mt-4 text-white"><FaSave /> Simpan</button>
                    </>
                }
            </form>
        </div>
        {
            fakturStatus ? <>
                <RiwayatTransaksiPenjualanBarang
                    fakturPenjualanBarang={fakturPenjualanBarang}
                    setFakturCancel={setFakturCancel}
                    setTanggalTransaksiAkhir={setTanggalTransaksiAkhir}
                />
            </> : <></>
        }
    </>
}
export default FakturPenjualanBarangForm