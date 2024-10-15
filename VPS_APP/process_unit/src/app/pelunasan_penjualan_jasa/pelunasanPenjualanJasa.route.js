import express from "express"
import { deletePelunasanPenjualanJasaByUUID, getAllPelunasanPenjualanJasas, getCekDendaByPelunasanPenjualanUUID, getPelunasanPenjualanJasaByUUID, postCreatePelunasanPenjualanJasa, updatePelunasanPenjualanJasaByUUID } from "./pelunasanPenjualanJasa.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/", authTokenMiddleware(), getAllPelunasanPenjualanJasas)
router.get("/cek_denda_pelunasan_penjualan/:uuid", authTokenMiddleware(), getCekDendaByPelunasanPenjualanUUID)
router.get("/:uuid", authTokenMiddleware(), getPelunasanPenjualanJasaByUUID)
router.post("/", authTokenMiddleware(), postCreatePelunasanPenjualanJasa)
router.put("/:uuid", authTokenMiddleware(), updatePelunasanPenjualanJasaByUUID)
router.delete("/:uuid", authTokenMiddleware(), deletePelunasanPenjualanJasaByUUID)

export const getPelunasanPenjualanJasaRoute = () => {
    return {
        controller: router,
        prefix: "/pelunasan_penjualan_jasa"
    }
}