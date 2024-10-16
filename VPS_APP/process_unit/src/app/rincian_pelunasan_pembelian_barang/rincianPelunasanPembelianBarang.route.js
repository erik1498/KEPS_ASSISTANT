import express from "express"
import { deleteRincianPelunasanPembelianBarangByUUID, getAllRincianPelunasanPembelianBarangs, getAllRincianPesananPembelianBarangByPelunasanPembelian, getAllRincianPesananPembelianBarangByTanggal, getRincianPelunasanPembelianBarangByUUID, postCreateRincianPelunasanPembelianBarang, updateRincianPelunasanPembelianBarangByUUID } from "./rincianPelunasanPembelianBarang.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/", authTokenMiddleware(), getAllRincianPelunasanPembelianBarangs)
router.get("/pesanan/:uuid", authTokenMiddleware(), getAllRincianPesananPembelianBarangByPelunasanPembelian)
router.post("/pesanan_by_tanggal", authTokenMiddleware(), getAllRincianPesananPembelianBarangByTanggal)
router.get("/:uuid", authTokenMiddleware(), getRincianPelunasanPembelianBarangByUUID)
router.post("/", authTokenMiddleware(), postCreateRincianPelunasanPembelianBarang)
router.put("/:uuid", authTokenMiddleware(), updateRincianPelunasanPembelianBarangByUUID)
router.delete("/:uuid", authTokenMiddleware(), deleteRincianPelunasanPembelianBarangByUUID)

export const getRincianPelunasanPembelianBarangRoute = () => {
    return {
        controller: router,
        prefix: "/rincian_pelunasan_pembelian_barang"
    }
}