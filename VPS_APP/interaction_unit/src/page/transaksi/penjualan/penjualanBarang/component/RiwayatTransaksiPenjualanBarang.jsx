import RiwayatTransaksiPelunasanPenjualanBarang from "./RiwayatTransaksiPelunasanPenjualanBarang"
import RiwayatTransaksiPengembalianDendaPenjualanBarang from "./RiwayatTransaksiPengembalianDendaPenjualanBarang"
import RiwayatTransaksiReturPenjualanBarang from "./RiwayatTransaksiReturPenjualanBarang"

const RiwayatTransaksiPenjualanBarang = () => {
    return <>
        <div className="bg-white rounded-md mt-4 py-6 px-6 shadow-2xl">
            <div className="flex flex-col">
                {
                    new Array(2).fill(6).map((x, i) => {
                        return <div className="mb-5">
                            <p className={`text-sm font-bold bg-blue-900 px-4 py-1 w-max text-gray-100`}>{6 - i} Januari 2024</p>
                            <div className="">
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