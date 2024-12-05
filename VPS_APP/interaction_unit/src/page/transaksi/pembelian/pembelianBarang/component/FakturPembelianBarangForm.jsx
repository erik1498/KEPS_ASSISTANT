import { useEffect, useState } from "react"
import FormInputWithLabel from "../../../../../component/form/FormInputWithLabel"
import { apiFakturPembelianBarangCRUD, apiTipePembayaranCRUD } from "../../../../../service/endPointList.api"
import FormSelectWithLabel from "../../../../../component/form/FormSelectWithLabel"
import { getHariTanggalFull } from "../../../../../helper/date.helper"
import { FaSave, FaTimes } from "react-icons/fa"
import { formValidation, showError } from "../../../../../helper/form.helper"
import RiwayatTransaksiPembelianBarang from "./RiwayatTransaksiPembelianBarang"

const FakturPembelianBarangForm = ({
    pesananPembelianBarang,
    setFakturStatus = () => { },
    fakturStatus,
    ppnStatus,
    setTanggalTransaksiAkhir = () => { }
}) => {
    const [fakturPembelianBarang, setFakturPembelianBarang] = useState()
    const [fakturCancel, setFakturCancel] = useState(true)

    const [tipePembayaranList, setTipePembayaranList] = useState([])

    const [tanggalFakturPembelianBarang, setTanggalFakturPembelianBarang] = useState(getHariTanggalFull())
    const [nomorFakturPembelianBarang, setNomorFakturPembelianBarang] = useState()
    const [buktiTransaksi, setBuktiTransaksi] = useState()
    const [tipePembayaran, setTipePembayaran] = useState()
    const [syaratPembayaran, setSyaratPembayaran] = useState()
    const [keteranganFakturPembelianBarang, setKeteranganFakturPembelianBarang] = useState()
    const [nomorFakturPajakFakturPembelianBarang, setNomorFakturPajakFakturPembelianBarang] = useState("")

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

    const _saveFakturPembelianBarang = async (e) => {
        e.preventDefault()
        if (await formValidation(e.target)) {
            apiFakturPembelianBarangCRUD
                .custom("", "POST", null, {
                    data: {
                        pesanan_pembelian_barang: pesananPembelianBarang.uuid,
                        tanggal: tanggalFakturPembelianBarang,
                        nomor_faktur_pembelian_barang: nomorFakturPembelianBarang,
                        bukti_transaksi: buktiTransaksi,
                        tipe_pembayaran: tipePembayaran.value,
                        syarat_pembayaran: syaratPembayaran,
                        keterangan: keteranganFakturPembelianBarang,
                        nomor_faktur_pajak_pembelian_barang: nomorFakturPajakFakturPembelianBarang ? nomorFakturPajakFakturPembelianBarang : "EMPTY"
                    }
                }).then(resData => {
                    _getFakturPembelian()
                }).catch(err => showError(err))
        }
    }

    const _deleteFakturPembelianBarang = () => {
        apiFakturPembelianBarangCRUD
            .custom(`/${fakturStatus}`, "DELETE")
            .then(() => {
                setFakturStatus(x => x = null)
            }).catch(err => showError(err))
    }

    const _getFakturPembelian = () => {
        apiFakturPembelianBarangCRUD
            .custom(`/pesanan_pembelian_barang/${pesananPembelianBarang.uuid}`, "GET")
            .then(resData => {
                if (resData.data) {
                    setFakturPembelianBarang(x => x = resData.data)
                    setNomorFakturPembelianBarang(x => x = resData.data.nomor_faktur_pembelian_barang)
                    setBuktiTransaksi(x => x = resData.data.bukti_transaksi)
                    setTanggalFakturPembelianBarang(x => x = resData.data.tanggal)
                    setTipePembayaran(x => x = resData.data.tipe_pembayaran_name)
                    setSyaratPembayaran(x => x = resData.data.syarat_pembayaran)
                    setKeteranganFakturPembelianBarang(x => x = resData.data.keterangan)
                    setFakturStatus(x => x = resData.data.uuid)
                    setNomorFakturPajakFakturPembelianBarang(x => x = resData.data.nomor_faktur_pajak_pembelian_barang != "EMPTY" ? resData.data.nomor_faktur_pajak_pembelian_barang : "")
                } else {
                    _getDataTipePembayaran()
                }
            }).catch(err => {
                setFakturStatus(x => x = null)
            })
    }

    useEffect(() => {
        if (fakturStatus != null) {
            _getFakturPembelian()
        }
    }, [fakturStatus])

    return <>
        <div className="bg-white mt-4 rounded-md py-6 px-6 shadow-2xl">
            <h1 className="text-xl font-extrabold w-max text-white px-2 rounded-md bg-blue-900 mb-4">Faktur Pembelian Barang</h1>
            <form onSubmit={e => _saveFakturPembelianBarang(e)}>
                <div className="flex gap-x-2">
                    <FormInputWithLabel
                        label={"Tanggal Faktur Pembelian Barang"}
                        type={"datetime-local"}
                        onchange={(e) => {
                            setTanggalFakturPembelianBarang(e.target.value)
                        }}
                        disabled={fakturStatus}
                        addClassInput={fakturStatus ? "border-none px-1" : ""}
                        others={
                            {
                                value: tanggalFakturPembelianBarang,
                                name: "tanggalFakturPembelianBarang",
                                disabled: fakturStatus
                            }
                        }
                    />
                    <FormInputWithLabel
                        label={"Nomor Faktur Pembelian Barang"}
                        type={"text"}
                        onchange={(e) => {
                            setNomorFakturPembelianBarang(e.target.value)
                        }}
                        disabled={fakturStatus}
                        addClassInput={fakturStatus ? "border-none px-1" : ""}
                        others={
                            {
                                value: nomorFakturPembelianBarang,
                                name: "nomorFakturPembelianBarang",
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
                        </>
                    }
                    <FormInputWithLabel
                        label={"Syarat Pembayaran"}
                        type={"text"}
                        disabled={fakturStatus}
                        addClassInput={fakturStatus ? "border-none px-1" : ""}
                        onchange={(e) => {
                            setSyaratPembayaran(e.target.value)
                        }}
                        others={
                            {
                                value: syaratPembayaran,
                                name: "syaratPembayaran",
                                disabled: fakturStatus
                            }
                        }
                    />
                </div>
                <div className="flex gap-x-2">
                    <FormInputWithLabel
                        label={"Keterangan"}
                        type={"text"}
                        disabled={fakturStatus}
                        addClassInput={fakturStatus ? "border-none px-1" : ""}
                        onchange={(e) => {
                            setKeteranganFakturPembelianBarang(e.target.value)
                        }}
                        others={
                            {
                                value: keteranganFakturPembelianBarang,
                                name: "keteranganFakturPembelianBarang",
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
                                    setNomorFakturPajakFakturPembelianBarang(e.target.value)
                                }}
                                others={
                                    {
                                        value: nomorFakturPajakFakturPembelianBarang,
                                        name: "nomorFakturPajakFakturPembelianBarang",
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
                                    onClick={() => _deleteFakturPembelianBarang()}
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
                <RiwayatTransaksiPembelianBarang
                    fakturPembelianBarang={fakturPembelianBarang}
                    setFakturCancel={setFakturCancel}
                    setTanggalTransaksiAkhir={setTanggalTransaksiAkhir}
                />
            </> : <></>
        }
    </>
}
export default FakturPembelianBarangForm