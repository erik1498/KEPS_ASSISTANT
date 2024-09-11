import express from "express"
import { deleteRincianTransaksiKasByUUID, getAllRincianTransaksiKass, getRincianTransaksiKasByTransaksiKasUUID, postCreateRincianTransaksiKas, updateRincianTransaksiKasByUUID } from "./rincianTransaksiKas.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/", authTokenMiddleware(), getAllRincianTransaksiKass)
router.get("/:uuid", authTokenMiddleware(), getRincianTransaksiKasByTransaksiKasUUID)
router.post("/", authTokenMiddleware(), postCreateRincianTransaksiKas)
router.put("/:uuid", authTokenMiddleware(), updateRincianTransaksiKasByUUID)
router.delete("/:uuid", authTokenMiddleware(), deleteRincianTransaksiKasByUUID)

export const getRincianTransaksiKasRoute = () => {
    return {
        controller: router,
        prefix: "/rincian_transaksi_kas"
    }
}