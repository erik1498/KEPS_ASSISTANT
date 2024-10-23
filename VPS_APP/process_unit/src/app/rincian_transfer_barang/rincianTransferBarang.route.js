import express from "express"
import { deleteRincianTransferBarangByUUID, getAllRincianTransferBarangs, getRincianTransferBarangByTransferBarangUuid, getRincianTransferBarangByUUID, postCreateRincianTransferBarang, updateRincianTransferBarangByUUID } from "./rincianTransferBarang.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/", authTokenMiddleware(), getAllRincianTransferBarangs)
router.get("/by_transfer_barang/:transfer_barang", getRincianTransferBarangByTransferBarangUuid)
router.get("/:uuid", authTokenMiddleware(), getRincianTransferBarangByUUID)
router.post("/", authTokenMiddleware(), postCreateRincianTransferBarang)
router.put("/:uuid", authTokenMiddleware(), updateRincianTransferBarangByUUID)
router.delete("/:uuid", authTokenMiddleware(), deleteRincianTransferBarangByUUID)

export const getRincianTransferBarangRoute = () => {
    return {
        controller: router,
        prefix: "/rincian_transfer_barang"
    }
}