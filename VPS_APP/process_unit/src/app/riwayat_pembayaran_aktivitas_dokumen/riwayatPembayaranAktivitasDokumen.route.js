import express from "express"
import { deleteRiwayatPembayaranAktivitasDokumenByUUID, getAllRiwayatPembayaranAktivitasDokumens, getAllRiwayatPembayaranAktivitasDokumensByAktivitasDokumen, getRiwayatPembayaranAktivitasDokumenByUUID, postCreateRiwayatPembayaranAktivitasDokumen, updateRiwayatPembayaranAktivitasDokumenByUUID } from "./riwayatPembayaranAktivitasDokumen.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/all", authTokenMiddleware(), getAllRiwayatPembayaranAktivitasDokumens)
router.get("/:aktivitas_dokumen", authTokenMiddleware(), getAllRiwayatPembayaranAktivitasDokumensByAktivitasDokumen)
router.get("/:uuid", authTokenMiddleware(), getRiwayatPembayaranAktivitasDokumenByUUID)
router.post("/", authTokenMiddleware(), postCreateRiwayatPembayaranAktivitasDokumen)
router.put("/:uuid", authTokenMiddleware(), updateRiwayatPembayaranAktivitasDokumenByUUID)
router.delete("/:uuid", authTokenMiddleware(), deleteRiwayatPembayaranAktivitasDokumenByUUID)

export const getRiwayatPembayaranAktivitasDokumenRoute = () => {
    return {
        controller: router,
        prefix: "/riwayat_pembayaran_aktivitas_dokumen"
    }
}