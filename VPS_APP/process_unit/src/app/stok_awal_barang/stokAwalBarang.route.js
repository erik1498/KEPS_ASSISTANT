import express from "express"
import { deleteStokAwalBarangByUUID, getAllStokAwalBarangs, getDaftarGudangBarangByKategoriHargaBarangUUIDAndPesananPenjualanBarangUUID, getRiwayatTransaksiPembelianByStokAwalBarangUuid, getRiwayatTransaksiPenjualanByStokAwalBarangUuid, getStokAwalBarangByBarangUUID, postCreateStokAwalBarang, updateStokAwalBarangByUUID } from "./stokAwalBarang.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/", authTokenMiddleware(), getAllStokAwalBarangs)
router.get("/gudang_barang/:kategori_harga_barang/:pesanan_penjualan_barang", getDaftarGudangBarangByKategoriHargaBarangUUIDAndPesananPenjualanBarangUUID)
router.get("/riwayat_penjualan/:uuid", authTokenMiddleware(), getRiwayatTransaksiPenjualanByStokAwalBarangUuid)
router.get("/riwayat_pembelian/:uuid", authTokenMiddleware(), getRiwayatTransaksiPembelianByStokAwalBarangUuid)
router.get("/:uuid", authTokenMiddleware(), getStokAwalBarangByBarangUUID)
router.post("/", authTokenMiddleware(), postCreateStokAwalBarang)
router.put("/:uuid", authTokenMiddleware(), updateStokAwalBarangByUUID)
router.delete("/:uuid", authTokenMiddleware(), deleteStokAwalBarangByUUID)

export const getStokAwalBarangRoute = () => {
    return {
        controller: router,
        prefix: "/stok_awal_barang"
    }
}