import express from "express"
import { deleteRincianTransaksiBankByUUID, getAllRincianTransaksiBanks, getRincianTransaksiBankByTransaksiBankUUID, postCreateRincianTransaksiBank, updateRincianTransaksiBankByUUID } from "./rincianTransaksiBank.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/", authTokenMiddleware(), getAllRincianTransaksiBanks)
router.get("/:uuid", authTokenMiddleware(), getRincianTransaksiBankByTransaksiBankUUID)
router.post("/", authTokenMiddleware(), postCreateRincianTransaksiBank)
router.put("/:uuid", authTokenMiddleware(), updateRincianTransaksiBankByUUID)
router.delete("/:uuid", authTokenMiddleware(), deleteRincianTransaksiBankByUUID)

export const getRincianTransaksiBankRoute = () => {
    return {
        controller: router,
        prefix: "/rincian_transaksi_bank"
    }
}