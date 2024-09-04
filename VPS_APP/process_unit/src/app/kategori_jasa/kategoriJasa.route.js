import express from "express"
import { deleteKategoriJasaByUUID, getAllKategoriJasas, getKategoriJasaByUUID, postCreateKategoriJasa, updateKategoriJasaByUUID } from "./kategoriJasa.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/", authTokenMiddleware(), getAllKategoriJasas)
router.get("/:uuid", authTokenMiddleware(), getKategoriJasaByUUID)
router.post("/", authTokenMiddleware(), postCreateKategoriJasa)
router.put("/:uuid", authTokenMiddleware(), updateKategoriJasaByUUID)
router.delete("/:uuid", authTokenMiddleware(), deleteKategoriJasaByUUID)

export const getKategoriJasaRoute = () => {
    return {
        controller: router,
        prefix: "/kategori_jasa"
    }
}