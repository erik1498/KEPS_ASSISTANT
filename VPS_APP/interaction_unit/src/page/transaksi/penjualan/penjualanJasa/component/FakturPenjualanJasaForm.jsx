import { useEffect, useRef, useState } from "react"
import FormInputWithLabel from "../../../../../component/form/FormInputWithLabel"
import { apiFakturPenjualanJasaCRUD, apiSyaratPembayaranCRUD, apiTipePembayaranCRUD } from "../../../../../service/endPointList.api"
import FormSelectWithLabel from "../../../../../component/form/FormSelectWithLabel"
import { getDataFromTanggal, getHariTanggalFull } from "../../../../../helper/date.helper"
import { FaPrint, FaSave, FaTimes } from "react-icons/fa"
import { formValidation, showError } from "../../../../../helper/form.helper"
import RiwayatTransaksiPenjualanJasa from "./RiwayatTransaksiPenjualanJasa"
import { useReactToPrint } from "react-to-print"
import { FakturPenjualanJasaPrint } from "./FakturPenjualanJasaPrint"

const FakturPenjualanJasaForm = ({
    pesananPenjualanJasa,
    rincianPesananPenjualanJasa,
    customer,
    setFakturStatus = () => { },
    fakturStatus,
    ppnStatus,
    setTanggalTransaksiAkhir = () => { }
}) => {
    const [fakturPenjualanJasa, setFakturPenjualanJasa] = useState()
    const [fakturCancel, setFakturCancel] = useState(true)

    const [tipePembayaranList, setTipePembayaranList] = useState([])
    const [syaratPembayaranList, setSyaratPembayaranList] = useState([])

    const [tanggalFakturPenjualanJasa, setTanggalFakturPenjualanJasa] = useState(getHariTanggalFull())
    const [nomorFakturPenjualanJasa, setNomorFakturPenjualanJasa] = useState()
    const [buktiTransaksi, setBuktiTransaksi] = useState()
    const [tipePembayaran, setTipePembayaran] = useState()
    const [syaratPembayaran, setSyaratPembayaran] = useState()
    const [keteranganFakturPenjualanJasa, setKeteranganFakturPenjualanJasa] = useState()
    const [nomorFakturPajakFakturPenjualanJasa, setNomorFakturPajakFakturPenjualanJasa] = useState("")

    const fakturPenjualanJasaPrintRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => fakturPenjualanJasaPrintRef.current,
    });

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

    const _saveFakturPenjualanJasa = async (e) => {
        e.preventDefault()
        if (await formValidation(e.target)) {
            apiFakturPenjualanJasaCRUD
                .custom("", "POST", null, {
                    data: {
                        pesanan_penjualan_jasa: pesananPenjualanJasa.uuid,
                        tanggal: tanggalFakturPenjualanJasa,
                        nomor_faktur_penjualan_jasa: nomorFakturPenjualanJasa,
                        bukti_transaksi: buktiTransaksi,
                        tipe_pembayaran: tipePembayaran.value,
                        syarat_pembayaran: syaratPembayaran.value,
                        keterangan: keteranganFakturPenjualanJasa,
                        nomor_faktur_pajak_penjualan_jasa: nomorFakturPajakFakturPenjualanJasa ? nomorFakturPajakFakturPenjualanJasa : "EMPTY"
                    }
                }).then(resData => {
                    _getFakturPenjualan()
                    // setFakturStatus(x => x = resData.data.uuid)
                }).catch(err => showError(err))
        }
    }

    const _deleteFakturPenjualanJasa = () => {
        apiFakturPenjualanJasaCRUD
            .custom(`/${fakturStatus}`, "DELETE")
            .then(() => {
                setFakturStatus(x => x = null)
            }).catch(err => showError(err))
    }

    useEffect(() => {
        if (tipePembayaran?.value && !fakturStatus) {
            _getDataSyaratPembayaran()
        }
    }, [tipePembayaran])

    const _getFakturPenjualan = () => {
        apiFakturPenjualanJasaCRUD
            .custom(`/pesanan_penjualan_jasa/${pesananPenjualanJasa.uuid}`, "GET")
            .then(resData => {
                if (resData.data) {
                    setFakturPenjualanJasa(x => x = resData.data)
                    setNomorFakturPenjualanJasa(x => x = resData.data.nomor_faktur_penjualan_jasa)
                    setBuktiTransaksi(x => x = resData.data.bukti_transaksi)
                    setTanggalFakturPenjualanJasa(x => x = resData.data.tanggal)
                    setTipePembayaran(x => x = resData.data.tipe_pembayaran_name)
                    setSyaratPembayaran(x => x = resData.data.syarat_pembayaran_name)
                    setKeteranganFakturPenjualanJasa(x => x = resData.data.keterangan)
                    setFakturStatus(x => x = resData.data.uuid)
                    setNomorFakturPajakFakturPenjualanJasa(x => x = resData.data.nomor_faktur_pajak_penjualan_jasa != "EMPTY" ? resData.data.nomor_faktur_pajak_penjualan_jasa : "")
                }
            }).catch(err => {
                setFakturStatus(x => x = null)
            })
    }

    useEffect(() => {
        if (fakturStatus != null) {
            _getFakturPenjualan()
        }
        else{
            _getDataTipePembayaran()
        }
    }, [fakturStatus])

    return <>
        <div className="bg-white rounded-md py-6 px-6 shadow-2xl">
            <h1 className="text-xl font-extrabold w-max text-white px-2 rounded-md bg-blue-900 mb-4">Faktur Penjualan Jasa</h1>
            <form onSubmit={e => _saveFakturPenjualanJasa(e)}>
                <div className="flex gap-x-2">
                    <FormInputWithLabel
                        label={"Tanggal Faktur Penjualan Jasa"}
                        type={"datetime-local"}
                        onchange={(e) => {
                            setTanggalFakturPenjualanJasa(e.target.value)
                        }}
                        disabled={fakturStatus}
                        addClassInput={fakturStatus ? "border-none px-1" : ""}
                        others={
                            {
                                value: tanggalFakturPenjualanJasa,
                                name: "tanggalFakturPenjualanJasa",
                                disabled: fakturStatus
                            }
                        }
                    />
                    <FormInputWithLabel
                        label={"Nomor Faktur Penjualan Jasa"}
                        type={"text"}
                        onchange={(e) => {
                            setNomorFakturPenjualanJasa(e.target.value)
                        }}
                        disabled={fakturStatus}
                        addClassInput={fakturStatus ? "border-none px-1" : ""}
                        others={
                            {
                                value: nomorFakturPenjualanJasa,
                                name: "nomorFakturPenjualanJasa",
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
                            setKeteranganFakturPenjualanJasa(e.target.value)
                        }}
                        others={
                            {
                                value: keteranganFakturPenjualanJasa,
                                name: "keteranganFakturPenjualanJasa",
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
                                    setNomorFakturPajakFakturPenjualanJasa(e.target.value)
                                }}
                                others={
                                    {
                                        value: nomorFakturPajakFakturPenjualanJasa,
                                        name: "nomorFakturPajakFakturPenjualanJasa",
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
                                    onClick={() => _deleteFakturPenjualanJasa()}
                                >
                                    <FaTimes /> Batalkan Faktur
                                </button>
                                <div className="hidden">
                                    <FakturPenjualanJasaPrint
                                        customer={customer}
                                        ref={fakturPenjualanJasaPrintRef}
                                        rincianPesananPenjualanJasa={rincianPesananPenjualanJasa}
                                        pesananPenjualanJasa={pesananPenjualanJasa}
                                        nomorFakturPenjualanJasa={nomorFakturPenjualanJasa}
                                        tanggalFakturPenjualanJasa={tanggalFakturPenjualanJasa}
                                        keteranganFakturPenjualanJasa={keteranganFakturPenjualanJasa}
                                        tipePembayaran={tipePembayaran}
                                        syaratPembayaran={syaratPembayaran}
                                    />
                                </div>
                                <button
                                    className="btn btn-sm bg-red-800 mt-4 text-white"
                                    type="button"
                                    onClick={handlePrint}
                                >
                                    <FaPrint /> Cetak Faktur
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
                <RiwayatTransaksiPenjualanJasa
                    fakturPenjualanJasa={fakturPenjualanJasa}
                    setFakturCancel={setFakturCancel}
                    setTanggalTransaksiAkhir={setTanggalTransaksiAkhir}
                />
            </> : <></>
        }
    </>
}
export default FakturPenjualanJasaForm