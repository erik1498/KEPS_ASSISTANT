import express from "express"
import { deletePengirimanBarangByUUID, getAllPengirimanBarangs, getDaftarPesananByFakturPenjualanUUID, getPengirimanBarangByUUID, postCreatePengirimanBarang, updatePengirimanBarangByUUID } from "./pengirimanBarang.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/", authTokenMiddleware(), getAllPengirimanBarangs)
router.get("/daftar_pesanan/:faktur_penjualan_barang", authTokenMiddleware(), getDaftarPesananByFakturPenjualanUUID)
router.get("/:uuid", authTokenMiddleware(), getPengirimanBarangByUUID)
router.post("/", authTokenMiddleware(), postCreatePengirimanBarang)
router.put("/:uuid", authTokenMiddleware(), updatePengirimanBarangByUUID)
router.delete("/:uuid", authTokenMiddleware(), deletePengirimanBarangByUUID)

export const getPengirimanBarangRoute = () => {
    return {
        controller: router,
        prefix: "/pengiriman_barang"
    }
}