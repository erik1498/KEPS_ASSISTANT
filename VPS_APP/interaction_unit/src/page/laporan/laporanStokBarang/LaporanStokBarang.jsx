import { useState, useEffect } from "react"
import Wrap from "../../../component/layout/Wrap"
import PageTitle from "../../../component/general/PageTitle"
import { showError } from "../../../helper/form.helper"
import { parseToRupiahText } from "../../../helper/number.helper"
import { formatDate } from "../../../helper/date.helper"
import { apiFakturPenjualanBarangCRUD } from "../../../service/endPointList.api"
import FormSelectWithLabel from "../../../component/form/FormSelectWithLabel"
import { FaCheck, FaPager, FaTimes } from "react-icons/fa"
import FormCheckBox from "../../../component/form/FormCheckBox"

const LaporanStokBarangPage = () => {

    const [isLoading, setIsLoading] = useState(false)

    const [chekcAll, setCheckAll] = useState({
        check: false
    })

    const [riwayatLaporan, setRiwayatLaporan] = useState([])

    const [fakturPenjualanBarangList, setFakturPenjualanBarangList] = useState([])
    const [rincianPesananPenjualanBarangList, setRincianPesananPenjualanBarangList] = useState([])

    const [fakturPenjualanBarang, setFakturPenjualanBarang] = useState({
        label: null,
        value: null
    })

    const _getDataFakturPenjualanBarang = () => {
        setFakturPenjualanBarang(x => x = null)
        apiFakturPenjualanBarangCRUD
            .custom(``, "GET")
            .then(resData => {
                setFakturPenjualanBarangList(resData.data.entry)
                if (resData.data.entry.length > 0) {
                    setFakturPenjualanBarang(x => x = {
                        label: resData.data.entry[0].nomor_faktur_penjualan_barang,
                        value: resData.data.entry[0].uuid
                    })
                }
            }).catch(err => showError(err))
    }

    const _getRincianPesananPenjualanBarang = () => {
        apiFakturPenjualanBarangCRUD
            .custom(`/rincian_pesanan_penjualan_barang_by_faktur/${fakturPenjualanBarang?.value}`, "GET")
            .then(resData => {
                setRincianPesananPenjualanBarangList(x => x = resData?.data?.map(x => {
                    x.check = chekcAll?.check
                    return x
                }))
            })
    }

    const _getLaporanStok = () => {
        setRiwayatLaporan(x => x = [])
        apiFakturPenjualanBarangCRUD
            .custom(`/rincian_Stok_barang_by_faktur/${fakturPenjualanBarang?.value}`, "POST", null, {
                data: {
                    rincian_pesanan_penjualan_barang_list: rincianPesananPenjualanBarangList.filter(x => x.check == true).map(x => x.uuid)
                }
            }).then((resData) => {
                setRiwayatLaporan(x => x = resData.data)
            })
    }

    const _updateCheckBox = (item) => {
        const index = rincianPesananPenjualanBarangList?.findIndex(x => x.uuid == item.uuid)
        setRincianPesananPenjualanBarangList(x => x = x.map((item, i) => {
            if (i == index) {
                item.check = !item.check
            }
            return item
        }))
    }

    const _updateAllCheckBox = () => {
        setCheckAll(x => x = !x)
    }

    useEffect(() => {
        setRincianPesananPenjualanBarangList(x => x = x.map((item) => {
            item.check = !chekcAll
            return item
        }))
    }, [chekcAll])

    useEffect(() => {
        _getDataFakturPenjualanBarang()
    }, [])

    return <Wrap
        isLoading={isLoading}
    >
        <div>
            <PageTitle title="Laporan Stok Barang" />
            <div className="grid grid-cols-12">
                <div className="col-span-12">
                    <div className="bg-white py-6 px-6 rounded-t-md">
                        <div className="flex items-end gap-x-2">
                            <FormSelectWithLabel
                                label={"Faktur Penjualan Barang"}
                                optionsDataList={fakturPenjualanBarangList}
                                optionsLabel={"nomor_faktur_penjualan_barang"}
                                optionsValue={"uuid"}
                                disabled={rincianPesananPenjualanBarangList?.length > 0}
                                selectValue={fakturPenjualanBarang}
                                onchange={(e) => {
                                    setFakturPenjualanBarang(e)
                                }}
                                selectName={`fakturPenjualanBarang`}
                            />
                        </div>
                        {
                            rincianPesananPenjualanBarangList?.length > 0 ? <>
                                <button
                                    className="btn mt-3 btn-sm bg-red-800 text-white"
                                    onClick={() => {
                                        setRincianPesananPenjualanBarangList(x => x = [])
                                        setRiwayatLaporan(x => x = [])
                                    }}
                                >
                                    <FaTimes /> Reset Faktur
                                </button>
                            </> : <>
                                <button
                                    className="btn mt-3 btn-sm bg-green-800 text-white"
                                    onClick={() => _getRincianPesananPenjualanBarang()}
                                >
                                    <FaCheck /> Pilih Faktur
                                </button>
                            </>
                        }
                    </div>
                </div>
                <div className="col-span-12 h-[80vh] overflow-y-scroll no-scrollbar">
                    <div className="bg-white rounded-b-md px-6 py-3">
                        <div className="flex justify-between pb-5">
                            <h1 className="font-bold text-md pb-3">Pilih Barang Pesanan</h1>
                            <button
                                className="btn btn-sm bg-blue-800 text-white"
                                onClick={() => _getLaporanStok()}
                            >
                                <FaPager /> Lihat Riwayat Stok
                            </button>
                        </div>
                        <div className="grid grid-cols-12 gap-x-2 py-3 border-b-2">
                            <div className="col-span-1 flex justify-center">
                                <p className="text-xs font-bold">
                                    <FormCheckBox
                                        item={chekcAll}
                                        checkedKey={"check"}
                                        updateCheckBox={() => _updateAllCheckBox()}
                                    />
                                </p>
                            </div>
                            <div className="col-span-3">
                                <p className="text-xs font-bold">Nama / Kode Barang</p>
                            </div>
                            <div className="col-span-3">
                                <p className="text-xs font-bold">Satuan Barang</p>
                            </div>
                            <div className="col-span-3">
                                <p className="text-xs font-bold">Gudang</p>
                            </div>
                            <div className="col-span-2">
                                <p className="text-xs font-bold">Jumlah Barang</p>
                            </div>
                        </div>
                        {
                            rincianPesananPenjualanBarangList.map((item) => {
                                return <>
                                    <div className="grid grid-cols-12 gap-x-2 py-2 items-center">
                                        <div className="col-span-1 flex justify-center">
                                            <FormCheckBox
                                                item={item}
                                                checkedKey={"check"}
                                                updateCheckBox={() => {
                                                    _updateCheckBox(item)
                                                }}
                                            />
                                        </div>
                                        <div className="col-span-3">
                                            <p className="text-xs">{item.daftar_barang_name}</p>
                                            <p className="text-xs">{item.kategori_harga_barang_kode_barang}</p>
                                        </div>
                                        <div className="col-span-3">
                                            <p className="text-xs">{item.satuan_barang_name}</p>
                                        </div>
                                        <div className="col-span-3">
                                            <p className="text-xs">{item.daftar_gudang_name}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <p className="text-xs">{parseToRupiahText(item.jumlah)}</p>
                                        </div>
                                    </div>
                                    {
                                        riwayatLaporan?.filter(x => x.rincian_pesanan_penjualan_barang == item.uuid).length > 0 ? <>
                                            <div className="grid grid-cols-12 bg-gray-50 gap-x-2 border-y-2 py-1 border-gray-200 items-center">
                                                <div className="col-span-1 flex justify-center">
                                                </div>
                                                <div className="col-span-3">
                                                    <p className="text-xs font-bold">Tanggal Stok</p>
                                                </div>
                                                <div className="col-span-6">
                                                    <p className="text-xs font-bold">Nomor Surat Jalan</p>
                                                </div>
                                                <div className="col-span-2">
                                                    <p className="text-xs font-bold">Dikirim</p>
                                                </div>
                                            </div>
                                        </> : <></>
                                    }
                                    {
                                        riwayatLaporan?.filter(x => x.rincian_pesanan_penjualan_barang == item.uuid).map(x => {
                                            return <>
                                                <div className="grid grid-cols-12 bg-gray-100 gap-x-2 py-2 items-center">
                                                    <div className="col-span-1 flex justify-center">
                                                    </div>
                                                    <div className="col-span-3">
                                                        <p className="text-xs">{formatDate(x.tanggal)}</p>
                                                    </div>
                                                    <div className="col-span-6">
                                                        <p className="text-xs">{x.nomor_surat_jalan}</p>
                                                    </div>
                                                    <div className="col-span-2">
                                                        <p className="text-xs">{parseToRupiahText(x.jumlah)}</p>
                                                    </div>
                                                </div>
                                            </>
                                        })
                                    }
                                </>
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    </Wrap>
}
export default LaporanStokBarangPage