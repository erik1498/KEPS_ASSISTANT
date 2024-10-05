import express from "express"
import { deleteRincianPengembalianDendaPenjualanBarangByUUID, getAllRincianPengembalianDendaPenjualanBarangs, getRincianPengembalianDendaPenjualanBarangByFakturPenjualanBarangUUID, postCreateRincianPengembalianDendaPenjualanBarang, updateRincianPengembalianDendaPenjualanBarangByUUID } from "./rincianPengembalianDendaPenjualanBarang.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/", authTokenMiddleware(), getAllRincianPengembalianDendaPenjualanBarangs)
router.get("/pesanan/:uuid", authTokenMiddleware(), getRincianPengembalianDendaPenjualanBarangByFakturPenjualanBarangUUID)
router.post("/", authTokenMiddleware(), postCreateRincianPengembalianDendaPenjualanBarang)
router.put("/:uuid", authTokenMiddleware(), updateRincianPengembalianDendaPenjualanBarangByUUID)
router.delete("/:uuid", authTokenMiddleware(), deleteRincianPengembalianDendaPenjualanBarangByUUID)

export const getRincianPengembalianDendaPenjualanBarangRoute = () => {
    return {
        controller: router,
        prefix: "/rincian_pengembalian_denda_penjualan_barang"
    }
}