import { useEffect, useState } from "react"
import RiwayatTransaksiPelunasanPenjualanBarang from "./RiwayatTransaksiPelunasanPenjualanBarang"
import { apiFakturPenjualanBarangCRUD } from "../../../../../service/endPointList.api"
import { getNormalizedByDate } from "../../../../../helper/jurnalUmum.helper"
import { formatDate, getHariTanggalFormated } from "../../../../../helper/date.helper"
import PelunasanPenjualanBarangForm from "./PelunasanPenjualanBarangForm"

const RiwayatTransaksiPenjualanBarang = ({
    fakturPenjualanBarang,
    setFakturCancel = () => { }
}) => {

    const [riwayatTransaksi, setRiwayatTransaksi] = useState([])
    const [reloadRiwayat, setReloadRiwayat] = useState(true)

    const _getDaftarRiwayatTransaksi = () => {
        setReloadRiwayat(x => x = false)
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

    useEffect(() => {
        setReloadRiwayat(x => x = true)
    }, [riwayatTransaksi])

    useEffect(() => {
        _getDaftarRiwayatTransaksi()
    }, [])

    return <>
        <div className="grid grid-cols-12 gap-x-2">
            <div className="col-span-4">
                <div className="bg-white rounded-md mt-4 py-6 px-6 shadow-2xl">
                    <h1 className="text-xl font-extrabold w-max text-white px-2 rounded-md bg-blue-900 mb-4">Riwayat Transaksi Penjualan Barang</h1>
                    <PelunasanPenjualanBarangForm
                        fakturPenjualanBarang={fakturPenjualanBarang}
                        _getDaftarRiwayatTransaksi={_getDaftarRiwayatTransaksi}
                    />
                </div>
            </div>
            <div className="col-span-8">
                <div className="bg-white rounded-md mt-4 py-6 px-6 shadow-2xl">
                    <h1 className="text-xl font-extrabold w-max text-white px-2 rounded-md bg-blue-900 mb-4">Riwayat Transaksi Penjualan Barang</h1>
                    <div className="flex flex-col max-h-[60vh] overflow-scroll no-scrollbar px-2 relative">
                        {
                            reloadRiwayat ? <>
                                {
                                    riwayatTransaksi.map((x, i) => {
                                        return <div className="mb-5">
                                            <p className="font-bold mb-3 sticky top-0 bg-gray-300 p-2 rounded-md z-50">{getHariTanggalFormated("/", formatDate(x.parent, false))}</p>
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
            </div>
        </div>
    </>
}
export default RiwayatTransaksiPenjualanBarang