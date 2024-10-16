import { useEffect, useState } from "react"
import { apiDaftarBarangCRUD, apiRincianPelunasanPembelianBarangCRUD, apiRincianPesananPembelianBarangCRUD } from "../../../../../service/endPointList.api"
import { showError } from "../../../../../helper/form.helper"
import PesananPembelianBarangForm from "./PesananPembelianBarangForm"
import { parseToRupiahText } from "../../../../../helper/number.helper"
import { FaCheck, FaTimes, FaTrash } from "react-icons/fa"

const PesananPembelianBarangList = ({
    pesananPembelianBarang,
    customer,
    fakturStatus,
    tanggalTransaksiAkhir
}) => {
    const [rincianPesananPembelianBarang, setRincianPesananPembelianBarang] = useState([])
    const [kategoriHargaBarangList, setKategoriHargaBarangList] = useState([])
    const [listPesanan, setListPesanan] = useState(false)
    const [totalPiutang, setTotalPiutang] = useState(0)

    const _getDataRincianDaftarPasananPembelian = () => {
        apiRincianPesananPembelianBarangCRUD
            .custom(`/${pesananPembelianBarang.uuid}`, "GET")
            .then(resData => {
                setRincianPesananPembelianBarang(resData.data)
            }).catch(err => showError(err))
    }

    const _getDataBarangTransaksi = () => {
        apiDaftarBarangCRUD
            .custom("/transaksi", "GET")
            .then(resData => {
                setKategoriHargaBarangList(resData.data)
            }).catch(err => showError(err))
    }

    const _removeRincianPesananPembelianBarang = (uuid) => {
        apiRincianPesananPembelianBarangCRUD.custom(`/${uuid}`, "DELETE").then(resData => {
            _getDataRincianDaftarPasananPembelian()
        }).catch(err => showError(err))
    }

    const _getDataRincianDaftarPasananPembelianStatusLunas = () => {
        apiRincianPelunasanPembelianBarangCRUD
            .custom("/pesanan_by_tanggal", "POST", null, {
                data: {
                    faktur_pembelian_barang: fakturStatus,
                    tanggal: tanggalTransaksiAkhir
                }
            }).then(resData => {
                setRincianPesananPembelianBarang(x => x = resData.data)
                const totalPiutangGet = resData.data.reduce((prev, current) => {
                    return prev + parseFloat(current.piutang)
                }, 0)
                setTotalPiutang(x => x = totalPiutangGet)
            })
    }

    useEffect(() => {
        _getDataBarangTransaksi()
        if (fakturStatus) {
            _getDataRincianDaftarPasananPembelianStatusLunas()
        } else {
            _getDataRincianDaftarPasananPembelian()
        }
    }, [fakturStatus, tanggalTransaksiAkhir, listPesanan])

    return <>
        <div className="grid grid-cols-12 gap-x-2">
            <div className={`${fakturStatus ? "hidden" : "col-span-4"}`}>
                {
                    kategoriHargaBarangList.length > 0 ? <>
                        <div className="bg-white rounded-md my-4 py-6 px-6 shadow-2xl">
                            <h1 className="text-xl font-extrabold w-max text-white px-2 rounded-md bg-blue-900 mb-4">Detail Barang Pesanan</h1>
                            <PesananPembelianBarangForm
                                _getDataRincianDaftarPasananPembelian={_getDataRincianDaftarPasananPembelian}
                                _hapusPesanan={() => { }}
                                customer={customer}
                                kategoriHargaBarangList={kategoriHargaBarangList}
                                pesananPembelianBarang={pesananPembelianBarang}
                            />
                        </div>
                    </> : <></>
                }
            </div>
            <div className={`${fakturStatus ? "col-span-12" : "col-span-8"}`}>
                <div className={`bg-white my-4 rounded-md no-scrollbar relative ${fakturStatus ? "h-max max-h-[60vh]" : "h-[70vh]"} overflow-y-scroll`}>
                    <div className="sticky top-0">
                        <div className="bg-white py-4 px-6 rounded-md">
                            <p className="text-xl font-extrabold w-max text-white px-2 rounded-md bg-blue-900 mb-4">Total Pesanan</p>
                            <p className="font-bold text-4xl">Rp. {parseToRupiahText(rincianPesananPembelianBarang.reduce((prev, current) => {
                                return prev + parseFloat(current.total_harga)
                            }, 0))}
                            </p>
                            {
                                fakturStatus ? <>
                                    {
                                        totalPiutang > 0 ? <div className="flex items-center gap-x-2 w-max my-2 px-2 py-1 rounded-md border-2 border-red-800">
                                            <FaTimes className="text-red-800" size={13} />
                                            <p className="mb-0 text-red-800 font-bold">Belum Lunas</p>
                                        </div> : <div className="flex items-center gap-x-2 w-max my-2 px-2 py-1 rounded-md border-2 border-green-800">
                                            <FaCheck className="text-green-800" size={13} />
                                            <p className="mb-0 text-green-800 font-bold">Lunas</p>
                                        </div>
                                    }
                                </>
                                    :
                                    <></>
                            }
                            {
                                fakturStatus ? <>
                                    {
                                        !listPesanan ? <>
                                            <button
                                                className="btn bg-gray-100 btn-sm mt-4 border-gray-500"
                                                onClick={() => { setListPesanan(x => x = !x) }}
                                            >
                                                Lihat Daftar Pesanan
                                            </button>
                                        </> : <>
                                            <button
                                                className="btn bg-gray-100 text-red-500 btn-sm mt-4 border-red-500"
                                                onClick={() => { setListPesanan(x => x = !x) }}
                                            >
                                                Tutup Daftar Pesanan
                                            </button>
                                        </>
                                    }
                                </> : <></>
                            }
                        </div>
                        {
                            fakturStatus && !listPesanan ? <></> : <>
                                <div className="grid grid-cols-12 text-sm gap-x-2 py-2 font-bold border-t-2 bg-gray-100 px-6">
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
                            </>
                        }
                    </div>
                    {
                        fakturStatus && !listPesanan ? <></> : <>
                            {
                                rincianPesananPembelianBarang.map((x, i) => {
                                    return <div className="py-3  border-t-2">
                                        <div className="grid grid-cols-12 gap-x-2 px-6 items-start font-bold">
                                            <div className="col-span-1">
                                                <p className="text-sm">{i + 1}.</p>
                                            </div>
                                            <div className="col-span-2">
                                                <p className="text-sm">{x.kategori_harga_barang_kode_barang}</p>
                                                <p className="text-xs my-1 font-normal">{x.daftar_gudang_name}</p>
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
                                        <div className="grid grid-cols-12 text-xs gap-x-2 px-6 text-gray-500 font-bold">
                                            <div className="col-span-1">
                                            </div>
                                            <div className="col-span-2">
                                                <p>Jumlah : {parseToRupiahText(x.jumlah)}</p>
                                                {
                                                    fakturStatus ? <>
                                                        <p>Retur : {parseToRupiahText(x.retur)}</p>
                                                    </> : <></>
                                                }
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
                                                {
                                                    fakturStatus ? <>
                                                        Status <p>{x.piutang != "0" ? `Belum Lunas ( Rp. ${parseToRupiahText(x.piutang)} )` : "Sudah Lunas"}</p>
                                                    </> : <></>
                                                }
                                            </div>
                                        </div>
                                        {
                                            fakturStatus ? <></> : <>
                                                <div className="grid grid-cols-12 gap-x-2 px-6">
                                                    <div className="col-span-1 col-start-2 mb-3">
                                                        <button
                                                            className="btn w-max btn-sm bg-red-700 text-white"
                                                            onClick={e => {
                                                                _removeRincianPesananPembelianBarang(x.uuid)
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
                        </>
                    }
                </div>
            </div>
        </div>
    </>
}
export default PesananPembelianBarangList