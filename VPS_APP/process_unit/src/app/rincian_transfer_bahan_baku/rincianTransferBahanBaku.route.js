import express from "express"
import { deleteRincianTransferBahanBakuByUUID, getAllRincianTransferBahanBakus, getRincianTransferBahanBakuByTransferBahanBakuUuid, getRincianTransferBahanBakuByUUID, postCreateRincianTransferBahanBaku, updateRincianTransferBahanBakuByUUID } from "./rincianTransferBahanBaku.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/", authTokenMiddleware(), getAllRincianTransferBahanBakus)
router.get("/by_transfer_bahan_baku/:transfer_bahan_baku", getRincianTransferBahanBakuByTransferBahanBakuUuid)
router.get("/:uuid", authTokenMiddleware(), getRincianTransferBahanBakuByUUID)
router.post("/", authTokenMiddleware(), postCreateRincianTransferBahanBaku)
router.put("/:uuid", authTokenMiddleware(), updateRincianTransferBahanBakuByUUID)
router.delete("/:uuid", authTokenMiddleware(), deleteRincianTransferBahanBakuByUUID)

export const getRincianTransferBahanBakuRoute = () => {
    return {
        controller: router,
        prefix: "/rincian_transfer_bahan_baku"
    }
}