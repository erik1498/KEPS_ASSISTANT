import express from "express"
import { deleteKategoriHargaBarangByUUID, getAllKategoriHargaBarangs, getKategoriHargaBarangByUUID, postCreateKategoriHargaBarang, updateKategoriHargaBarangByUUID } from "./kategoriHargaBarang.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/", authTokenMiddleware(), getAllKategoriHargaBarangs)
router.get("/:uuid", authTokenMiddleware(), getKategoriHargaBarangByUUID)
router.post("/", authTokenMiddleware(), postCreateKategoriHargaBarang)
router.put("/:uuid", authTokenMiddleware(), updateKategoriHargaBarangByUUID)
router.delete("/:uuid", authTokenMiddleware(), deleteKategoriHargaBarangByUUID)

export const getKategoriHargaBarangRoute = () => {
    return {
        controller: router,
        prefix: "/kategori_harga_barang"
    }
}