import express from "express"
import { deleteStokAwalBarangByUUID, getAllStokAwalBarangs, getDaftarGudangBarangByKategoriHargaBarangUUID, getDaftarGudangBarangByKategoriHargaBarangUUIDAndPesananPenjualanOrPembelianBarangUUID, getRiwayatTransaksiPembelianByStokAwalBarangUuid, getRiwayatTransaksiPenjualanByStokAwalBarangUuid, getStokAwalBarangByBarangUUID, postCreateStokAwalBarang, updateStokAwalBarangByUUID } from "./stokAwalBarang.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/", authTokenMiddleware(), getAllStokAwalBarangs)
router.get("/gudang_barang/:kategori_harga_barang", authTokenMiddleware(), getDaftarGudangBarangByKategoriHargaBarangUUID)
router.get("/gudang_barang/:kategori_harga_barang/:pesanan_penjualan_or_pembelian_barang/:type", authTokenMiddleware(), getDaftarGudangBarangByKategoriHargaBarangUUIDAndPesananPenjualanOrPembelianBarangUUID)
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