import express from "express"
import { deleteTransaksiKasByUUID, getAllTransaksiKass, getTransaksiKasByUUID, postCreateTransaksiKas, updateTransaksiKasByUUID } from "./transaksiKas.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/:bulan/:tahun", authTokenMiddleware(), getAllTransaksiKass)
router.get("/:uuid", authTokenMiddleware(), getTransaksiKasByUUID)
router.post("/", authTokenMiddleware(), postCreateTransaksiKas)
router.put("/:uuid", authTokenMiddleware(), updateTransaksiKasByUUID)
router.delete("/:uuid", authTokenMiddleware(), deleteTransaksiKasByUUID)

export const getTransaksiKasRoute = () => {
    return {
        controller: router,
        prefix: "/transaksi_kas"
    }
}