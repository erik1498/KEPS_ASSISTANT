import { useState } from "react"
import ToggleBox from "../../../../../component/general/ToggleBox"
import RiwayatTransaksiPelunasanPenjualanBarang from "./RiwayatTransaksiPelunasanPenjualanBarang"
import RiwayatTransaksiPengembalianDendaPenjualanBarang from "./RiwayatTransaksiPengembalianDendaPenjualanBarang"
import RiwayatTransaksiReturPenjualanBarang from "./RiwayatTransaksiReturPenjualanBarang"
import PelunasanPenjualanBarangForm from "./PelunasanPenjualanBarangForm"

const RiwayatTransaksiPenjualanBarang = () => {

    const [toggleBox, setToggleBox] = useState("Pelunasan Penjualan Barang")

    return <>

        <div className="bg-white rounded-md mt-4 py-6 px-6 shadow-2xl">
            <h1 className="text-xl font-extrabold w-max text-white px-2 rounded-md bg-blue-900 mb-3">Form Transaksi Penjualan Barang</h1>
            <ToggleBox
                addClass={"-mb-0"}
                setToggleBox={setToggleBox}
                toggleBox={toggleBox}
                labelTextSize="text-sm"
                toggleBoxList={[
                    {
                        label: "Pelunasan Penjualan Barang",
                        value: "Pelunasan Penjualan Barang",
                    },
                    {
                        label: "Retur Penjualan Barang",
                        value: "Retur Penjualan Barang",
                    },
                    {
                        label: "Pengembalian Denda Penjualan Barang",
                        value: "Pengembalian Denda Penjualan Barang",
                    }
                ]}
            />
            {
                toggleBox == "Pelunasan Penjualan Barang" ? <PelunasanPenjualanBarangForm /> : <></>
            }
        </div>
        <div className="bg-white rounded-md mt-4 py-6 px-6 shadow-2xl">
            <h1 className="text-xl font-extrabold w-max text-white px-2 rounded-md bg-blue-900 mb-4">Riwayat Transaksi Penjualan Barang</h1>
            <div className="flex flex-col max-h-[60vh] overflow-scroll no-scrollbar px-2">
                {
                    new Array(2).fill(6).map((x, i) => {
                        return <div className="mb-5">
                            <p className="font-bold mb-3">{6 - i} Januari 2024</p>
                            <div className="flex flex-col gap-y-2">
                                <RiwayatTransaksiPengembalianDendaPenjualanBarang />
                                <RiwayatTransaksiReturPenjualanBarang />
                                <RiwayatTransaksiPelunasanPenjualanBarang />
                            </div>
                        </div>
                    })
                }
            </div>
        </div>
    </>
}
export default RiwayatTransaksiPenjualanBarang