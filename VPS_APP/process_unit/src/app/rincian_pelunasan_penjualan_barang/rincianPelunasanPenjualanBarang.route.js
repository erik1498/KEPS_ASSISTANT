import express from "express"
import { deleteRincianPelunasanPenjualanBarangByUUID, getAllRincianPelunasanPenjualanBarangs, getAllRincianPesananPenjualanBarangByPelunasanPenjualan, getAllRincianPesananPenjualanBarangByTanggal, getRincianPelunasanPenjualanBarangByUUID, postCreateRincianPelunasanPenjualanBarang, updateRincianPelunasanPenjualanBarangByUUID } from "./rincianPelunasanPenjualanBarang.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/", authTokenMiddleware(), getAllRincianPelunasanPenjualanBarangs)
router.get("/pesanan/:uuid", authTokenMiddleware(), getAllRincianPesananPenjualanBarangByPelunasanPenjualan)
router.post("/pesanan_by_tanggal", authTokenMiddleware(), getAllRincianPesananPenjualanBarangByTanggal)
router.get("/:uuid", authTokenMiddleware(), getRincianPelunasanPenjualanBarangByUUID)
router.post("/", authTokenMiddleware(), postCreateRincianPelunasanPenjualanBarang)
router.put("/:uuid", authTokenMiddleware(), updateRincianPelunasanPenjualanBarangByUUID)
router.delete("/:uuid", authTokenMiddleware(), deleteRincianPelunasanPenjualanBarangByUUID)

export const getRincianPelunasanPenjualanBarangRoute = () => {
    return {
        controller: router,
        prefix: "/rincian_pelunasan_penjualan_barang"
    }
}