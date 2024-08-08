import express from "express"
import { deleteStatusRiwayatAktivitasDokumenByUUID, getAllStatusRiwayatAktivitasDokumensByRiwayatAktivitasDokumen, getStatusRiwayatAktivitasDokumenByUUID, postCreateStatusRiwayatAktivitasDokumen, updateStatusRiwayatAktivitasDokumenByUUID } from "./statusRiwayatAktivitasDokumen.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/:riwayat_aktivitas_dokumen", authTokenMiddleware(), getAllStatusRiwayatAktivitasDokumensByRiwayatAktivitasDokumen)
router.get("/:uuid", authTokenMiddleware(), getStatusRiwayatAktivitasDokumenByUUID)
router.post("/", authTokenMiddleware(), postCreateStatusRiwayatAktivitasDokumen)
router.put("/:uuid", authTokenMiddleware(), updateStatusRiwayatAktivitasDokumenByUUID)
router.delete("/:uuid", authTokenMiddleware(), deleteStatusRiwayatAktivitasDokumenByUUID)

export const getStatusRiwayatAktivitasDokumenRoute = () => {
    return {
        controller: router,
        prefix: "/status_riwayat_aktivitas_dokumen"
    }
}