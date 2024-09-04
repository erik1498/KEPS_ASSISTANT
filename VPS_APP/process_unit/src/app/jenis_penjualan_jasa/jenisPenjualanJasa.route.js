import express from "express"
import { deleteJenisPenjualanJasaByUUID, getAllJenisPenjualanJasas, getJenisPenjualanJasaByUUID, postCreateJenisPenjualanJasa, updateJenisPenjualanJasaByUUID } from "./jenisPenjualanJasa.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/", authTokenMiddleware(), getAllJenisPenjualanJasas)
router.get("/:uuid", authTokenMiddleware(), getJenisPenjualanJasaByUUID)
router.post("/", authTokenMiddleware(), postCreateJenisPenjualanJasa)
router.put("/:uuid", authTokenMiddleware(), updateJenisPenjualanJasaByUUID)
router.delete("/:uuid", authTokenMiddleware(), deleteJenisPenjualanJasaByUUID)

export const getJenisPenjualanJasaRoute = () => {
    return {
        controller: router,
        prefix: "/jenis_penjualan_jasa"
    }
}