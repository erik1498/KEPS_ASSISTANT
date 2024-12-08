import express from "express"
import { deleteRincianKonversiBahanBakuByUUID, getAllRincianKonversiBahanBakus, getRincianKonversiBahanBakuByKonversiBahanBakuUuid, getRincianKonversiBahanBakuByUUID, postCreateRincianKonversiBahanBaku, updateRincianKonversiBahanBakuByUUID } from "./rincianKonversiBahanBaku.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/", authTokenMiddleware(), getAllRincianKonversiBahanBakus)
router.get("/by_konversi_bahan_baku/:konversi_bahan_baku", authTokenMiddleware(), getRincianKonversiBahanBakuByKonversiBahanBakuUuid)
router.get("/:uuid", authTokenMiddleware(), getRincianKonversiBahanBakuByUUID)
router.post("/", authTokenMiddleware(), postCreateRincianKonversiBahanBaku)
router.put("/:uuid", authTokenMiddleware(), updateRincianKonversiBahanBakuByUUID)
router.delete("/:uuid", authTokenMiddleware(), deleteRincianKonversiBahanBakuByUUID)

export const getRincianKonversiBahanBakuRoute = () => {
    return {
        controller: router,
        prefix: "/rincian_konversi_bahan_baku"
    }
}