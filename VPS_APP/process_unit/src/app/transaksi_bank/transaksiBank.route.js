import express from "express"
import { deleteTransaksiBankByUUID, getAllTransaksiBanks, getTransaksiBankByUUID, postCreateTransaksiBank, updateTransaksiBankByUUID } from "./transaksiBank.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/:bulan/:tahun", authTokenMiddleware(), getAllTransaksiBanks)
router.get("/:uuid", authTokenMiddleware(), getTransaksiBankByUUID)
router.post("/", authTokenMiddleware(), postCreateTransaksiBank)
router.put("/:uuid", authTokenMiddleware(), updateTransaksiBankByUUID)
router.delete("/:uuid", authTokenMiddleware(), deleteTransaksiBankByUUID)

export const getTransaksiBankRoute = () => {
    return {
        controller: router,
        prefix: "/transaksi_bank"
    }
}