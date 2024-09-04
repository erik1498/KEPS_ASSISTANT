import express from "express"
import { deleteJenisPenjualanBarangByUUID, getAllJenisPenjualanBarangs, getJenisPenjualanBarangByUUID, postCreateJenisPenjualanBarang, updateJenisPenjualanBarangByUUID } from "./jenisPenjualanBarang.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/", authTokenMiddleware(), getAllJenisPenjualanBarangs)
router.get("/:uuid", authTokenMiddleware(), getJenisPenjualanBarangByUUID)
router.post("/", authTokenMiddleware(), postCreateJenisPenjualanBarang)
router.put("/:uuid", authTokenMiddleware(), updateJenisPenjualanBarangByUUID)
router.delete("/:uuid", authTokenMiddleware(), deleteJenisPenjualanBarangByUUID)

export const getJenisPenjualanBarangRoute = () => {
    return {
        controller: router,
        prefix: "/jenis_penjualan_barang"
    }
}