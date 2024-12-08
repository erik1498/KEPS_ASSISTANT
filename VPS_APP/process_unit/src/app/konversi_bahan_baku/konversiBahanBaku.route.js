import express from "express"
import { deleteKonversiBahanBakuByUUID, getAllKonversiBahanBakus, getKonversiBahanBakuByUUID, postCreateKonversiBahanBaku, updateKonversiBahanBakuByUUID } from "./konversiBahanBaku.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/", authTokenMiddleware(), getAllKonversiBahanBakus)
router.get("/:uuid", authTokenMiddleware(), getKonversiBahanBakuByUUID)
router.post("/", authTokenMiddleware(), postCreateKonversiBahanBaku)
router.put("/:uuid", authTokenMiddleware(), updateKonversiBahanBakuByUUID)
router.delete("/:uuid", authTokenMiddleware(), deleteKonversiBahanBakuByUUID)

export const getKonversiBahanBakuRoute = () => {
    return {
        controller: router,
        prefix: "/konversi_bahan_baku"
    }
}