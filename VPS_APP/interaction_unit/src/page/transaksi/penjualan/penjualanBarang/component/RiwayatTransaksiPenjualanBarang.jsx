import RiwayatTransaksiPelunasanPenjualanBarang from "./RiwayatTransaksiPelunasanPenjualanBarang"
import RiwayatTransaksiReturPenjualanBarang from "./RiwayatTransaksiReturPenjualanBarang"

const RiwayatTransaksiPenjualanBarang = () => {
    return <>
        <div className="bg-white rounded-md mt-4 py-6 px-6 shadow-2xl">
            <div className="grid grid-cols-12 sticky top-0 bg-white py-2">
                <div className="px-1 col-span-12 text-black flex items-end">
                    <p className={`text-4xl py-2 font-bold -ml-1 text-white px-2 rounded-md bg-green-900`}>12</p>
                    <div className="w-full flex justify-between items-end">
                        <div className="text-gray-900 flex flex-col justify-end px-2">
                            <p className="font-bold text-sm">01.2024</p>
                            <p className="text-xs">Senin</p>
                        </div>
                    </div>
                </div>
            </div>
            <RiwayatTransaksiReturPenjualanBarang />
            <RiwayatTransaksiPelunasanPenjualanBarang />
        </div>
    </>
}
export default RiwayatTransaksiPenjualanBarang