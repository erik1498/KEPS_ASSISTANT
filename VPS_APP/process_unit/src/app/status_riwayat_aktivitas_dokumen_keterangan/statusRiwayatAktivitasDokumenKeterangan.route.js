import express from "express"
import { deleteStatusRiwayatAktivitasDokumenKeteranganByUUID, getAllStatusRiwayatAktivitasDokumenKeterangansByStatusRiwayatAktivitasDokumen, getStatusRiwayatAktivitasDokumenKeteranganByUUID, postCreateStatusRiwayatAktivitasDokumenKeterangan, updateStatusRiwayatAktivitasDokumenKeteranganByUUID } from "./statusRiwayatAktivitasDokumenKeterangan.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/:status_riwayat_aktivitas_dokumen", authTokenMiddleware(), getAllStatusRiwayatAktivitasDokumenKeterangansByStatusRiwayatAktivitasDokumen)
router.get("/:uuid", authTokenMiddleware(), getStatusRiwayatAktivitasDokumenKeteranganByUUID)
router.post("/", authTokenMiddleware(), postCreateStatusRiwayatAktivitasDokumenKeterangan)
router.put("/:uuid", authTokenMiddleware(), updateStatusRiwayatAktivitasDokumenKeteranganByUUID)
router.delete("/:uuid", authTokenMiddleware(), deleteStatusRiwayatAktivitasDokumenKeteranganByUUID)

export const getStatusRiwayatAktivitasDokumenKeteranganRoute = () => {
    return {
        controller: router,
        prefix: "/status_riwayat_aktivitas_dokumen_keterangan"
    }
}