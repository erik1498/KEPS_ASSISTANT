import express from "express"
import { deleteJenisPenjualanBahanBakuByUUID, getAllJenisPenjualanBahanBakus, getJenisPenjualanBahanBakuByUUID, postCreateJenisPenjualanBahanBaku, updateJenisPenjualanBahanBakuByUUID } from "./jenisPenjualanBahanBaku.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/", authTokenMiddleware(), getAllJenisPenjualanBahanBakus)
router.get("/:uuid", authTokenMiddleware(), getJenisPenjualanBahanBakuByUUID)
router.post("/", authTokenMiddleware(), postCreateJenisPenjualanBahanBaku)
router.put("/:uuid", authTokenMiddleware(), updateJenisPenjualanBahanBakuByUUID)
router.delete("/:uuid", authTokenMiddleware(), deleteJenisPenjualanBahanBakuByUUID)

export const getJenisPenjualanBahanBakuRoute = () => {
    return {
        controller: router,
        prefix: "/jenis_penjualan_bahan_baku"
    }
}