import express from "express"
import { deleteRincianReturPenjualanJasaByUUID, getAllRincianPesananPenjualanJasaByReturPenjualan, getAllRincianReturPenjualanJasas, getRincianReturPenjualanJasaByUUID, postCreateRincianReturPenjualanJasa, updateRincianReturPenjualanJasaByUUID } from "./rincianReturPenjualanJasa.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/", authTokenMiddleware(), getAllRincianReturPenjualanJasas)
router.get("/pesanan/:uuid", authTokenMiddleware(), getAllRincianPesananPenjualanJasaByReturPenjualan)
router.get("/:uuid", authTokenMiddleware(), getRincianReturPenjualanJasaByUUID)
router.post("/", authTokenMiddleware(), postCreateRincianReturPenjualanJasa)
router.put("/:uuid", authTokenMiddleware(), updateRincianReturPenjualanJasaByUUID)
router.delete("/:uuid", authTokenMiddleware(), deleteRincianReturPenjualanJasaByUUID)

export const getRincianReturPenjualanJasaRoute = () => {
    return {
        controller: router,
        prefix: "/rincian_retur_penjualan_jasa"
    }
}