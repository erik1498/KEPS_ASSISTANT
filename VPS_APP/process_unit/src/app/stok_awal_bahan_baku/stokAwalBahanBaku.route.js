import express from "express"
import { deleteStokAwalBahanBakuByUUID, getAllStokAwalBahanBakus, getDaftarGudangBahanBakuByKategoriHargaBahanBakuUUID, getDaftarGudangBahanBakuByKategoriHargaBahanBakuUUIDAndPesananPenjualanOrPembelianBahanBakuUUID, getReportStokAwalBahanBakus, getRiwayatTransaksiPembelianByStokAwalBahanBakuUuid, getRiwayatTransaksiPenjualanByStokAwalBahanBakuUuid, getStokAwalBahanBakuByBahanBakuUUID, postCreateStokAwalBahanBaku, updateStokAwalBahanBakuByUUID } from "./stokAwalBahanBaku.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/", authTokenMiddleware(), getAllStokAwalBahanBakus)
router.get("/report/:bulan/:tahun", authTokenMiddleware(), getReportStokAwalBahanBakus)
router.get("/gudang_bahan_baku/:kategori_harga_bahan_baku", authTokenMiddleware(), getDaftarGudangBahanBakuByKategoriHargaBahanBakuUUID)
router.get("/gudang_bahan_baku/:kategori_harga_bahan_baku/:pesanan_penjualan_or_pembelian_bahan_baku/:type", authTokenMiddleware(), getDaftarGudangBahanBakuByKategoriHargaBahanBakuUUIDAndPesananPenjualanOrPembelianBahanBakuUUID)
router.get("/riwayat_penjualan/:uuid", authTokenMiddleware(), getRiwayatTransaksiPenjualanByStokAwalBahanBakuUuid)
router.get("/riwayat_pembelian/:uuid", authTokenMiddleware(), getRiwayatTransaksiPembelianByStokAwalBahanBakuUuid)
router.get("/:uuid", authTokenMiddleware(), getStokAwalBahanBakuByBahanBakuUUID)
router.post("/", authTokenMiddleware(), postCreateStokAwalBahanBaku)
router.put("/:uuid", authTokenMiddleware(), updateStokAwalBahanBakuByUUID)
router.delete("/:uuid", authTokenMiddleware(), deleteStokAwalBahanBakuByUUID)

export const getStokAwalBahanBakuRoute = () => {
    return {
        controller: router,
        prefix: "/stok_awal_bahan_baku"
    }
}