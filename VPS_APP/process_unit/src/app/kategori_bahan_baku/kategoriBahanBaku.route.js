import express from "express"
import { deleteKategoriBahanBakuByUUID, getAllKategoriBahanBakus, getKategoriBahanBakuByUUID, postCreateKategoriBahanBaku, updateKategoriBahanBakuByUUID } from "./kategoriBahanBaku.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/", authTokenMiddleware(), getAllKategoriBahanBakus)
router.get("/:uuid", authTokenMiddleware(), getKategoriBahanBakuByUUID)
router.post("/", authTokenMiddleware(), postCreateKategoriBahanBaku)
router.put("/:uuid", authTokenMiddleware(), updateKategoriBahanBakuByUUID)
router.delete("/:uuid", authTokenMiddleware(), deleteKategoriBahanBakuByUUID)

export const getKategoriBahanBakuRoute = () => {
    return {
        controller: router,
        prefix: "/kategori_bahan_baku"
    }
}