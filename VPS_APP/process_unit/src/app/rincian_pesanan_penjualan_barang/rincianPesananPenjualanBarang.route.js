import express from "express"
import { deleteRincianPesananPenjualanBarangByUUID, getAllRincianPesananPenjualanBarangs, getRincianPesananPenjualanBarangByUUID, postCreateRincianPesananPenjualanBarang, updateRincianPesananPenjualanBarangByUUID } from "./rincianPesananPenjualanBarang.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/", authTokenMiddleware(), getAllRincianPesananPenjualanBarangs)
router.get("/:uuid", authTokenMiddleware(), getRincianPesananPenjualanBarangByUUID)
router.post("/", authTokenMiddleware(), postCreateRincianPesananPenjualanBarang)
router.put("/:uuid", authTokenMiddleware(), updateRincianPesananPenjualanBarangByUUID)
router.delete("/:uuid", authTokenMiddleware(), deleteRincianPesananPenjualanBarangByUUID)

export const getRincianPesananPenjualanBarangRoute = () => {
    return {
        controller: router,
        prefix: "/rincian_pesanan_penjualan_barang"
    }
}