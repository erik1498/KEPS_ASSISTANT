import express from "express"
import { deleteKategoriHargaBahanBakuByUUID, getAllKategoriHargaBahanBakus, getHargaBeliByDaftarBahanBakuAndSatuanBahanBakuReport, postCreateKategoriHargaBahanBaku, updateKategoriHargaBahanBakuByUUID } from "./kategoriHargaBahanBaku.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/:daftar_bahan_baku", authTokenMiddleware(), getAllKategoriHargaBahanBakus)
router.get("/harga_beli_report/:daftar_bahan_baku/:satuan_bahan_baku", authTokenMiddleware(), getHargaBeliByDaftarBahanBakuAndSatuanBahanBakuReport)
router.post("/", authTokenMiddleware(), postCreateKategoriHargaBahanBaku)
router.put("/:uuid", authTokenMiddleware(), updateKategoriHargaBahanBakuByUUID)
router.delete("/:uuid", authTokenMiddleware(), deleteKategoriHargaBahanBakuByUUID)

export const getKategoriHargaBahanBakuRoute = () => {
    return {
        controller: router,
        prefix: "/kategori_harga_bahan_baku"
    }
}