import express from "express"
import { deleteReturPenjualanJasaByUUID, getAllReturPenjualanJasas, getReturPenjualanJasaByUUID, postCreateReturPenjualanJasa, updateReturPenjualanJasaByUUID } from "./returPenjualanJasa.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/", authTokenMiddleware(), getAllReturPenjualanJasas)
router.get("/:uuid", authTokenMiddleware(), getReturPenjualanJasaByUUID)
router.post("/", authTokenMiddleware(), postCreateReturPenjualanJasa)
router.put("/:uuid", authTokenMiddleware(), updateReturPenjualanJasaByUUID)
router.delete("/:uuid", authTokenMiddleware(), deleteReturPenjualanJasaByUUID)

export const getReturPenjualanJasaRoute = () => {
    return {
        controller: router,
        prefix: "/retur_penjualan_jasa"
    }
}