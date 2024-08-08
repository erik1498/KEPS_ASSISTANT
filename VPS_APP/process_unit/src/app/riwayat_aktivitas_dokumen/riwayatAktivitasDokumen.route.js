import express from "express"
import { deleteRiwayatAktivitasDokumenByUUID, getAllRiwayatAktivitasDokumensByAktivitasDokumen, getRiwayatAktivitasDokumenByUUID, postCreateRiwayatAktivitasDokumen, updateRiwayatAktivitasDokumenByUUID } from "./riwayatAktivitasDokumen.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/:aktivitas_dokumen", authTokenMiddleware(), getAllRiwayatAktivitasDokumensByAktivitasDokumen)
router.get("/:uuid", authTokenMiddleware(), getRiwayatAktivitasDokumenByUUID)
router.post("/", authTokenMiddleware(), postCreateRiwayatAktivitasDokumen)
router.put("/:uuid", authTokenMiddleware(), updateRiwayatAktivitasDokumenByUUID)
router.delete("/:uuid", authTokenMiddleware(), deleteRiwayatAktivitasDokumenByUUID)

export const getRiwayatAktivitasDokumenRoute = () => {
    return {
        controller: router,
        prefix: "/riwayat_aktivitas_dokumen"
    }
}