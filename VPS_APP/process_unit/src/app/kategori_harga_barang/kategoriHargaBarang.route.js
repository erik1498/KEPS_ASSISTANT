import express from "express"
import { deleteKategoriHargaBarangByUUID, getAllKategoriHargaBarangs, getHargaBeliByDaftarBarangAndSatuanBarangReport, postCreateKategoriHargaBarang, updateKategoriHargaBarangByUUID } from "./kategoriHargaBarang.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/:daftar_barang", authTokenMiddleware(), getAllKategoriHargaBarangs)
router.get("/harga_beli_report/:daftar_barang/:satuan_barang", authTokenMiddleware(), getHargaBeliByDaftarBarangAndSatuanBarangReport)
router.post("/", authTokenMiddleware(), postCreateKategoriHargaBarang)
router.put("/:uuid", authTokenMiddleware(), updateKategoriHargaBarangByUUID)
router.delete("/:uuid", authTokenMiddleware(), deleteKategoriHargaBarangByUUID)

export const getKategoriHargaBarangRoute = () => {
    return {
        controller: router,
        prefix: "/kategori_harga_barang"
    }
}