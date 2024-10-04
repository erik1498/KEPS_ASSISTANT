import express from "express"
import { deleteRincianPelunasanPenjualanDendaBarangByUUID, getAllRincianPelunasanPenjualanDendaBarangs, getAllRincianPesananPenjualanDendaBarangByPelunasanPenjualan, getRincianPelunasanPenjualanDendaBarangByUUID, postCreateRincianPelunasanPenjualanDendaBarang, updateRincianPelunasanPenjualanDendaBarangByUUID } from "./rincianPelunasanPenjualanDendaBarang.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/", authTokenMiddleware(), getAllRincianPelunasanPenjualanDendaBarangs)
router.get("/pesanan/:uuid", authTokenMiddleware(), getAllRincianPesananPenjualanDendaBarangByPelunasanPenjualan)
router.get("/:uuid", authTokenMiddleware(), getRincianPelunasanPenjualanDendaBarangByUUID)
router.post("/", authTokenMiddleware(), postCreateRincianPelunasanPenjualanDendaBarang)
router.put("/:uuid", authTokenMiddleware(), updateRincianPelunasanPenjualanDendaBarangByUUID)
router.delete("/:uuid", authTokenMiddleware(), deleteRincianPelunasanPenjualanDendaBarangByUUID)

export const getRincianPelunasanPenjualanDendaBarangRoute = () => {
    return {
        controller: router,
        prefix: "/rincian_pelunasan_penjualan_denda_barang"
    }
}