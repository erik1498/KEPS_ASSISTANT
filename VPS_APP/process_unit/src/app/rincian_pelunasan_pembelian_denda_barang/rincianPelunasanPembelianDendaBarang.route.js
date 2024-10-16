import express from "express"
import { deleteRincianPelunasanPembelianDendaBarangByUUID, getAllRincianPelunasanPembelianDendaBarangs, getAllRincianPesananPembelianDendaBarangByPelunasanPembelian, getRincianPelunasanPembelianDendaBarangByUUID, postCreateRincianPelunasanPembelianDendaBarang, updateRincianPelunasanPembelianDendaBarangByUUID } from "./rincianPelunasanPembelianDendaBarang.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/", authTokenMiddleware(), getAllRincianPelunasanPembelianDendaBarangs)
router.get("/pesanan/:uuid", authTokenMiddleware(), getAllRincianPesananPembelianDendaBarangByPelunasanPembelian)
router.get("/:uuid", authTokenMiddleware(), getRincianPelunasanPembelianDendaBarangByUUID)
router.post("/", authTokenMiddleware(), postCreateRincianPelunasanPembelianDendaBarang)
router.put("/:uuid", authTokenMiddleware(), updateRincianPelunasanPembelianDendaBarangByUUID)
router.delete("/:uuid", authTokenMiddleware(), deleteRincianPelunasanPembelianDendaBarangByUUID)

export const getRincianPelunasanPembelianDendaBarangRoute = () => {
    return {
        controller: router,
        prefix: "/rincian_pelunasan_pembelian_denda_barang"
    }
}