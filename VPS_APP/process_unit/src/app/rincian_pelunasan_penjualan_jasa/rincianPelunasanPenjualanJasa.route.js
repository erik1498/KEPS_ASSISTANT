import express from "express"
import { deleteRincianPelunasanPenjualanJasaByUUID, getAllRincianPelunasanPenjualanJasas, getAllRincianPesananPenjualanJasaByPelunasanPenjualan, getAllRincianPesananPenjualanJasaByTanggal, getRincianPelunasanPenjualanJasaByUUID, postCreateRincianPelunasanPenjualanJasa, updateRincianPelunasanPenjualanJasaByUUID } from "./rincianPelunasanPenjualanJasa.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/", authTokenMiddleware(), getAllRincianPelunasanPenjualanJasas)
router.get("/pesanan/:uuid", authTokenMiddleware(), getAllRincianPesananPenjualanJasaByPelunasanPenjualan)
router.post("/pesanan_by_tanggal", authTokenMiddleware(), getAllRincianPesananPenjualanJasaByTanggal)
router.get("/:uuid", authTokenMiddleware(), getRincianPelunasanPenjualanJasaByUUID)
router.post("/", authTokenMiddleware(), postCreateRincianPelunasanPenjualanJasa)
router.put("/:uuid", authTokenMiddleware(), updateRincianPelunasanPenjualanJasaByUUID)
router.delete("/:uuid", authTokenMiddleware(), deleteRincianPelunasanPenjualanJasaByUUID)

export const getRincianPelunasanPenjualanJasaRoute = () => {
    return {
        controller: router,
        prefix: "/rincian_pelunasan_penjualan_jasa"
    }
}