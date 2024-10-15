import express from "express"
import { deleteRincianPengembalianDendaPenjualanJasaByUUID, getAllRincianPengembalianDendaPenjualanJasas, getRincianPengembalianDendaPenjualanJasaByFakturPenjualanJasaUUID, postCreateRincianPengembalianDendaPenjualanJasa, updateRincianPengembalianDendaPenjualanJasaByUUID } from "./rincianPengembalianDendaPenjualanJasa.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/", authTokenMiddleware(), getAllRincianPengembalianDendaPenjualanJasas)
router.get("/pesanan/:uuid", authTokenMiddleware(), getRincianPengembalianDendaPenjualanJasaByFakturPenjualanJasaUUID)
router.post("/", authTokenMiddleware(), postCreateRincianPengembalianDendaPenjualanJasa)
router.put("/:uuid", authTokenMiddleware(), updateRincianPengembalianDendaPenjualanJasaByUUID)
router.delete("/:uuid", authTokenMiddleware(), deleteRincianPengembalianDendaPenjualanJasaByUUID)

export const getRincianPengembalianDendaPenjualanJasaRoute = () => {
    return {
        controller: router,
        prefix: "/rincian_pengembalian_denda_penjualan_jasa"
    }
}