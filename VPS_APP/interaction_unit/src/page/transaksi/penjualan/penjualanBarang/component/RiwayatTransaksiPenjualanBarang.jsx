import { useEffect, useState } from "react"
import RiwayatTransaksiPelunasanPenjualanBarang from "./RiwayatTransaksiPelunasanPenjualanBarang"
import RiwayatTransaksiPengembalianDendaPenjualanBarang from "./RiwayatTransaksiPengembalianDendaPenjualanBarang"
import RiwayatTransaksiReturPenjualanBarang from "./RiwayatTransaksiReturPenjualanBarang"
import { apiFakturPenjualanBarangCRUD } from "../../../../../service/endPointList.api"
import { showError } from "../../../../../helper/form.helper"

const RiwayatTransaksiPenjualanBarang = ({
    fakturPenjualanBarang
}) => {

    const [riwayatTransaksi, setRiwayatTransaksi] = useState([])

    const _getDaftarRiwayatTransaksi = () => {
        if (fakturPenjualanBarang) {
            apiFakturPenjualanBarangCRUD
                .custom("/riwayat_transaksi/" + fakturPenjualanBarang.uuid)
                .then(resData => {
                    setRiwayatTransaksi(x => x = resData.data)
                }).catch(err => showError(err))
        }
    }

    useEffect(() => {
        _getDaftarRiwayatTransaksi()
    }, [])
    return <>
        <div className="bg-white rounded-md mt-4 py-6 px-6 shadow-2xl">
            <h1 className="text-xl font-extrabold w-max text-white px-2 rounded-md bg-blue-900 mb-4">Riwayat Transaksi Penjualan Barang</h1>
            <div className="flex flex-col max-h-[60vh] overflow-scroll no-scrollbar px-2">
                {/* {
                    new Array(2).fill(6).map((x, i) => {
                        return <div className="mb-5">
                            <p className="font-bold mb-3">{6 - i} Januari 2024</p>
                            <div className="flex flex-col">
                                <RiwayatTransaksiPengembalianDendaPenjualanBarang />
                                <RiwayatTransaksiReturPenjualanBarang />
                                <RiwayatTransaksiPelunasanPenjualanBarang />
                            </div>
                        </div>
                    })
                } */}
                {
                    riwayatTransaksi.map((x, i) => {
                        return <div className="mb-5">
                            <p className="font-bold mb-3">{6 - i} Januari 2024</p>
                            <div className="flex flex-col">
                                {
                                    x.type == "pelunasan_penjualan_barang" ? <>
                                        <RiwayatTransaksiPelunasanPenjualanBarang
                                            riwayatPelunasanPenjualanBarang={x}
                                        />
                                    </> : <></>
                                }
                            </div>
                        </div>
                    })
                }
            </div>
        </div>
    </>
}
export default RiwayatTransaksiPenjualanBarang