import express from "express"
import { deleteRincianPelunasanPenjualanDendaJasaByUUID, getAllRincianPelunasanPenjualanDendaJasas, getAllRincianPesananPenjualanDendaJasaByPelunasanPenjualan, getRincianPelunasanPenjualanDendaJasaByUUID, postCreateRincianPelunasanPenjualanDendaJasa, updateRincianPelunasanPenjualanDendaJasaByUUID } from "./rincianPelunasanPenjualanDendaJasa.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/", authTokenMiddleware(), getAllRincianPelunasanPenjualanDendaJasas)
router.get("/pesanan/:uuid", authTokenMiddleware(), getAllRincianPesananPenjualanDendaJasaByPelunasanPenjualan)
router.get("/:uuid", authTokenMiddleware(), getRincianPelunasanPenjualanDendaJasaByUUID)
router.post("/", authTokenMiddleware(), postCreateRincianPelunasanPenjualanDendaJasa)
router.put("/:uuid", authTokenMiddleware(), updateRincianPelunasanPenjualanDendaJasaByUUID)
router.delete("/:uuid", authTokenMiddleware(), deleteRincianPelunasanPenjualanDendaJasaByUUID)

export const getRincianPelunasanPenjualanDendaJasaRoute = () => {
    return {
        controller: router,
        prefix: "/rincian_pelunasan_penjualan_denda_jasa"
    }
}