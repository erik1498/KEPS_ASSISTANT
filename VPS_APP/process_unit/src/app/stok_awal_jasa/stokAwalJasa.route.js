import express from "express"
import { deleteStokAwalJasaByUUID, getAllStokAwalJasas, getDaftarCabangByKategoriHargaJasaUUIDAndPesananPenjualanJasaUUID, getRiwayatTransaksiPembelianByStokAwalJasaUuid, getRiwayatTransaksiPenjualanByStokAwalJasaUuid, getStokAwalJasaByJasaUUID, postCreateStokAwalJasa, updateStokAwalJasaByUUID } from "./stokAwalJasa.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/", authTokenMiddleware(), getAllStokAwalJasas)
router.get("/cabang/:kategori_harga_jasa/:pesanan_penjualan_jasa", getDaftarCabangByKategoriHargaJasaUUIDAndPesananPenjualanJasaUUID)
router.get("/riwayat_penjualan/:uuid", authTokenMiddleware(), getRiwayatTransaksiPenjualanByStokAwalJasaUuid)
router.get("/riwayat_pembelian/:uuid", authTokenMiddleware(), getRiwayatTransaksiPembelianByStokAwalJasaUuid)
router.get("/:uuid", authTokenMiddleware(), getStokAwalJasaByJasaUUID)
router.post("/", authTokenMiddleware(), postCreateStokAwalJasa)
router.put("/:uuid", authTokenMiddleware(), updateStokAwalJasaByUUID)
router.delete("/:uuid", authTokenMiddleware(), deleteStokAwalJasaByUUID)

export const getStokAwalJasaRoute = () => {
    return {
        controller: router,
        prefix: "/stok_awal_jasa"
    }
}