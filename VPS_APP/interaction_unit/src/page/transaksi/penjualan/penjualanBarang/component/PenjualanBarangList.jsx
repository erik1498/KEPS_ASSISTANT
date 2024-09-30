import { useEffect, useState } from "react"
import { apiDaftarBarangCRUD, apiRincianPesananPenjualanBarangCRUD } from "../../../../../service/endPointList.api"
import { showError } from "../../../../../helper/form.helper"
import PesananPenjualanBarangForm from "./PesananPenjualanBarangForm"
import { parseToRupiahText } from "../../../../../helper/number.helper"
import { FaTrash } from "react-icons/fa"
import { getHariTanggalFull } from "../../../../../helper/date.helper"
import RiwayatTransaksiPenjualanBarang from "./RiwayatTransaksiPenjualanBarang"

const PesananPenjualanBarangList = ({
    pesananPenjualanBarang,
    customer,
    fakturStatus,
    setPPNStatus = () => { }
}) => {
    const [rincianPesananPenjualanBarang, setRincianPesananPenjualanBarang] = useState([])
    const [kategoriHargaBarangList, setKategoriHargaBarangList] = useState([])

    const _getDataRincianDaftarPasananPenjualan = () => {
        apiRincianPesananPenjualanBarangCRUD
            .custom(`/${pesananPenjualanBarang.uuid}`, "GET")
            .then(resData => {
                setPPNStatus(x => x = false)
                setRincianPesananPenjualanBarang(resData.data)
                if (resData.data.filter(x => x.ppn > 0).length > 0) {
                    setPPNStatus(x => x = true)
                }
            }).catch(err => showError(err))
    }

    const _getDataBarangTransaksi = () => {
        apiDaftarBarangCRUD
            .custom("/transaksi", "GET")
            .then(resData => {
                setKategoriHargaBarangList(resData.data)
            }).catch(err => showError(err))
    }

    const _removeRincianPesananPenjualanBarang = (uuid) => {
        apiRincianPesananPenjualanBarangCRUD.custom(`/${uuid}`, "DELETE").then(resData => {
            _getDataRincianDaftarPasananPenjualan()
        }).catch(err => showError(err))
    }

    useEffect(() => {
        _getDataBarangTransaksi()
        _getDataRincianDaftarPasananPenjualan()
    }, [])

    return <>
        {
            fakturStatus ? <>
                <RiwayatTransaksiPenjualanBarang
                
                />
            </> : <></>
        }
        <div className="grid grid-cols-12 gap-x-2">
            <div className={`${fakturStatus ? "hidden" : "col-span-4"}`}>
                {
                    kategoriHargaBarangList.length > 0 ? <>
                        <div className="bg-white rounded-md my-4 py-6 px-6 shadow-2xl">
                            <h1 className="text-xl font-extrabold w-max text-white px-2 rounded-md bg-blue-900 mb-4">Detail Barang Pesanan</h1>
                            <PesananPenjualanBarangForm
                                _getDataRincianDaftarPasananPenjualan={_getDataRincianDaftarPasananPenjualan}
                                _hapusPesanan={() => { }}
                                customer={customer}
                                kategoriHargaBarangList={kategoriHargaBarangList}
                                pesananPenjualanBarang={pesananPenjualanBarang}
                            />
                        </div>
                    </> : <></>
                }
            </div>
            <div className={`${fakturStatus ? "col-span-12" : "col-span-8"}`}>
                <div className="bg-white my-4 py-5 px-6 rounded-md">
                    <p className="font-bold text-sm">Total Pesanan</p>
                    <p className="font-bold text-4xl">Rp. {parseToRupiahText(rincianPesananPenjualanBarang.reduce((prev, current) => {
                        return prev + current.total_harga
                    }, 0))}</p>
                </div>
                <div className={`bg-white my-4 rounded-md no-scrollbar relative ${fakturStatus ? "h-max max-h-[40vh]" : "h-[70vh]"} overflow-y-scroll`}>
                    <div className="grid grid-cols-12 text-sm gap-x-2 py-2 font-bold border-t-2 bg-gray-100 px-6 sticky top-0">
                        <div className="col-span-1">
                            <p className="text-gray-500">No.</p>
                        </div>
                        <div className="col-span-2">
                            <p className="text-gray-500 text-md">Kode Barang</p>
                        </div>
                        <div className="col-span-3">
                            <p className="text-gray-500 text-md">Nama Barang</p>
                        </div>
                        <div className="col-span-3">
                            <p className="text-gray-500 text-md">Satuan Barang</p>
                        </div>
                        <div className="col-span-3">
                            <p className="text-gray-500 text-md">Harga Barang</p>
                        </div>
                    </div>
                    {
                        rincianPesananPenjualanBarang.map((x, i) => {
                            return <div>
                                <div className="grid grid-cols-12 gap-x-2 px-6 py-3 items-start font-bold border-t-2">
                                    <div className="col-span-1">
                                        <p className="text-sm">{i + 1}.</p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-sm">{x.kategori_harga_barang_kode_barang}</p>
                                        <p className="text-sm font-normal">{x.daftar_gudang_name}</p>
                                    </div>
                                    <div className="col-span-3">
                                        <p className="text-sm">{x.daftar_barang_name}</p>
                                    </div>
                                    <div className="col-span-3">
                                        <p className="text-sm">{x.satuan_barang_name}</p>
                                    </div>
                                    <div className="col-span-3">
                                        <p className="text-sm">Rp. {parseToRupiahText(x.harga)}</p>
                                        <p className="text-xs font-normal">PPN : Rp. {parseToRupiahText(x.ppn)}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-12 text-xs gap-x-2 px-6 py-3 text-gray-500 font-bold">
                                    <div className="col-span-1">
                                    </div>
                                    <div className="col-span-2">
                                        <p>Jumlah : {x.jumlah}</p>
                                    </div>
                                    <div className="col-span-3">
                                        {
                                            x.diskon_angka > 0 ? <>
                                                <p>Diskon</p>
                                                <p>Harga Diskon</p>
                                                <p>PPN Diskon</p>
                                            </> : <></>
                                        }
                                    </div>
                                    <div className="col-span-3">
                                        {
                                            x.diskon_angka > 0 ? <>
                                                <p>Rp. {parseToRupiahText(x.diskon_angka)} ({x.diskon_persentase} % )</p>
                                                <p>Rp. {parseToRupiahText(x.harga_setelah_diskon)}</p>
                                                <p>Rp. {parseToRupiahText(x.ppn_setelah_diskon)}</p>
                                            </> : <></>
                                        }
                                    </div>
                                    <div className="col-span-3">
                                        Total Harga <p>Rp. {parseToRupiahText(x.total_harga)}</p>
                                    </div>
                                </div>
                                {
                                    fakturStatus ? <></> : <>
                                        <div className="grid grid-cols-12 gap-x-2 px-6">
                                            <div className="col-span-1 col-start-2 mb-3">
                                                <button
                                                    className="btn w-max btn-sm bg-red-700 text-white"
                                                    onClick={e => {
                                                        _removeRincianPesananPenjualanBarang(x.uuid)
                                                    }}
                                                >
                                                    <FaTrash /> Hapus
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                }
                            </div>
                        })
                    }
                </div>
            </div>
        </div>
    </>
}
export default PesananPenjualanBarangList