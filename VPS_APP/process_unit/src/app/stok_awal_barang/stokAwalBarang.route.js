import express from "express"
import { deleteStokAwalBarangByUUID, getAllStokAwalBarangs, getDaftarGudangBarangByKategoriHargaBarangUUID, getRiwayatTransaksiByStokAwalBarangUuid, getStokAwalBarangByBarangUUID, postCreateStokAwalBarang, updateStokAwalBarangByUUID } from "./stokAwalBarang.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/", authTokenMiddleware(), getAllStokAwalBarangs)
router.get("/gudang_barang/:kategori_harga_barang", getDaftarGudangBarangByKategoriHargaBarangUUID)
router.get("/riwayat/:uuid", authTokenMiddleware(), getRiwayatTransaksiByStokAwalBarangUuid)
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