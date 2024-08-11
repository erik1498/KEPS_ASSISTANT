import express from "express"
import { deleteStatusRiwayatAktivitasDokumenPegawaiPelaksanaByUUID, getAllStatusRiwayatAktivitasDokumenPegawaiPelaksanas, getAllStatusRiwayatAktivitasDokumenPegawaiPelaksanasByStatusRiwayatAktivitasDokumen, getStatusRiwayatAktivitasDokumenPegawaiPelaksanaByUUID, postCreateStatusRiwayatAktivitasDokumenPegawaiPelaksana, updateStatusRiwayatAktivitasDokumenPegawaiPelaksanaByUUID } from "./statusRiwayatAktivitasDokumenPegawaiPelaksana.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/all/:tahun", authTokenMiddleware(), getAllStatusRiwayatAktivitasDokumenPegawaiPelaksanas)
router.get("/:status_riwayat_aktivitas_dokumen", authTokenMiddleware(), getAllStatusRiwayatAktivitasDokumenPegawaiPelaksanasByStatusRiwayatAktivitasDokumen)
router.get("/:uuid", authTokenMiddleware(), getStatusRiwayatAktivitasDokumenPegawaiPelaksanaByUUID)
router.post("/", authTokenMiddleware(), postCreateStatusRiwayatAktivitasDokumenPegawaiPelaksana)
router.put("/:uuid", authTokenMiddleware(), updateStatusRiwayatAktivitasDokumenPegawaiPelaksanaByUUID)
router.delete("/:uuid", authTokenMiddleware(), deleteStatusRiwayatAktivitasDokumenPegawaiPelaksanaByUUID)

export const getStatusRiwayatAktivitasDokumenPegawaiPelaksanaRoute = () => {
    return {
        controller: router,
        prefix: "/status_riwayat_aktivitas_dokumen_pegawai_pelaksana"
    }
}