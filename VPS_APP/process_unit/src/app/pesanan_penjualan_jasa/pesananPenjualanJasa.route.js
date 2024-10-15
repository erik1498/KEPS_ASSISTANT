import express from "express"
import { deletePesananPenjualanJasaByUUID, getAllPesananPenjualanJasas, getPesananPenjualanJasaByUUID, postCreatePesananPenjualanJasa, updatePesananPenjualanJasaByUUID } from "./pesananPenjualanJasa.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/", authTokenMiddleware(), getAllPesananPenjualanJasas)
router.get("/:uuid", authTokenMiddleware(), getPesananPenjualanJasaByUUID)
router.post("/", authTokenMiddleware(), postCreatePesananPenjualanJasa)
router.put("/:uuid", authTokenMiddleware(), updatePesananPenjualanJasaByUUID)
router.delete("/:uuid", authTokenMiddleware(), deletePesananPenjualanJasaByUUID)

export const getPesananPenjualanJasaRoute = () => {
    return {
        controller: router,
        prefix: "/pesanan_penjualan_jasa"
    }
}