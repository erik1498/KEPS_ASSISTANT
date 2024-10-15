import express from "express"
import { deletePengembalianDendaPenjualanJasaByUUID, getAllPengembalianDendaPenjualanJasas, getPengembalianDendaPenjualanJasaByUUID, postCreatePengembalianDendaPenjualanJasa, updatePengembalianDendaPenjualanJasaByUUID } from "./pengembalianDendaPenjualanJasa.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/", authTokenMiddleware(), getAllPengembalianDendaPenjualanJasas)
router.get("/:uuid", authTokenMiddleware(), getPengembalianDendaPenjualanJasaByUUID)
router.post("/", authTokenMiddleware(), postCreatePengembalianDendaPenjualanJasa)
router.put("/:uuid", authTokenMiddleware(), updatePengembalianDendaPenjualanJasaByUUID)
router.delete("/:uuid", authTokenMiddleware(), deletePengembalianDendaPenjualanJasaByUUID)

export const getPengembalianDendaPenjualanJasaRoute = () => {
    return {
        controller: router,
        prefix: "/pengembalian_denda_penjualan_jasa"
    }
}