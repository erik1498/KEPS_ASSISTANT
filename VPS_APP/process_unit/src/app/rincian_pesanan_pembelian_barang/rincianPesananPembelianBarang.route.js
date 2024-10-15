import express from "express"
import { deleteRincianPesananPembelianBarangByUUID, getAllRincianPesananPembelianBarangs, getRincianPesananPembelianBarangByPesananPembelianUUID, postCreateRincianPesananPembelianBarang, updateRincianPesananPembelianBarangByUUID } from "./rincianPesananPembelianBarang.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/", authTokenMiddleware(), getAllRincianPesananPembelianBarangs)
router.get("/:uuid", authTokenMiddleware(), getRincianPesananPembelianBarangByPesananPembelianUUID)
router.post("/", authTokenMiddleware(), postCreateRincianPesananPembelianBarang)
router.put("/:uuid", authTokenMiddleware(), updateRincianPesananPembelianBarangByUUID)
router.delete("/:uuid", authTokenMiddleware(), deleteRincianPesananPembelianBarangByUUID)

export const getRincianPesananPembelianBarangRoute = () => {
    return {
        controller: router,
        prefix: "/rincian_pesanan_pembelian_barang"
    }
}