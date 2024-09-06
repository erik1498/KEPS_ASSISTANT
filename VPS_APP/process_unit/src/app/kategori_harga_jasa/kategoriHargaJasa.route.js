import express from "express"
import { deleteKategoriHargaJasaByUUID, getAllKategoriHargaJasas, getKategoriHargaJasaByUUID, postCreateKategoriHargaJasa, updateKategoriHargaJasaByUUID } from "./kategoriHargaJasa.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/", authTokenMiddleware(), getAllKategoriHargaJasas)
router.get("/:uuid", authTokenMiddleware(), getKategoriHargaJasaByUUID)
router.post("/", authTokenMiddleware(), postCreateKategoriHargaJasa)
router.put("/:uuid", authTokenMiddleware(), updateKategoriHargaJasaByUUID)
router.delete("/:uuid", authTokenMiddleware(), deleteKategoriHargaJasaByUUID)

export const getKategoriHargaJasaRoute = () => {
    return {
        controller: router,
        prefix: "/kategori_harga_jasa"
    }
}