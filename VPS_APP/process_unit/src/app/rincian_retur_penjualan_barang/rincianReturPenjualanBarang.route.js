import express from "express"
import { deleteRincianReturPenjualanBarangByUUID, getAllRincianPesananPenjualanBarangByReturPenjualan, getAllRincianReturPenjualanBarangs, getRincianReturPenjualanBarangByUUID, postCreateRincianReturPenjualanBarang, updateRincianReturPenjualanBarangByUUID } from "./rincianReturPenjualanBarang.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/", authTokenMiddleware(), getAllRincianReturPenjualanBarangs)
router.get("/pesanan/:uuid", authTokenMiddleware(), getAllRincianPesananPenjualanBarangByReturPenjualan)
router.get("/:uuid", authTokenMiddleware(), getRincianReturPenjualanBarangByUUID)
router.post("/", authTokenMiddleware(), postCreateRincianReturPenjualanBarang)
router.put("/:uuid", authTokenMiddleware(), updateRincianReturPenjualanBarangByUUID)
router.delete("/:uuid", authTokenMiddleware(), deleteRincianReturPenjualanBarangByUUID)

export const getRincianReturPenjualanBarangRoute = () => {
    return {
        controller: router,
        prefix: "/rincian_retur_penjualan_barang"
    }
}