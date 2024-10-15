import express from "express"
import { deleteRincianPesananPenjualanJasaByUUID, getAllRincianPesananPenjualanJasas, getRincianPesananPenjualanJasaByPesananPenjualanUUID, postCreateRincianPesananPenjualanJasa, updateRincianPesananPenjualanJasaByUUID } from "./rincianPesananPenjualanJasa.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/", authTokenMiddleware(), getAllRincianPesananPenjualanJasas)
router.get("/:uuid", authTokenMiddleware(), getRincianPesananPenjualanJasaByPesananPenjualanUUID)
router.post("/", authTokenMiddleware(), postCreateRincianPesananPenjualanJasa)
router.put("/:uuid", authTokenMiddleware(), updateRincianPesananPenjualanJasaByUUID)
router.delete("/:uuid", authTokenMiddleware(), deleteRincianPesananPenjualanJasaByUUID)

export const getRincianPesananPenjualanJasaRoute = () => {
    return {
        controller: router,
        prefix: "/rincian_pesanan_penjualan_jasa"
    }
}