import express from "express"
import { deleteAktivitasDokumenByUUID, getAllAktivitasDokumens, getAktivitasDokumenByUUID, postCreateAktivitasDokumen, updateAktivitasDokumenByUUID } from "./aktivitasDokumen.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/tahun/:tahun", authTokenMiddleware(), getAllAktivitasDokumens)
router.get("/:uuid", authTokenMiddleware(), getAktivitasDokumenByUUID)
router.post("/", authTokenMiddleware([
    "AKTIVITAS_DOKUMEN_GET"
]), postCreateAktivitasDokumen)
router.put("/:uuid", authTokenMiddleware([
    "AKTIVITAS_DOKUMEN_GET"
]), updateAktivitasDokumenByUUID)
router.delete("/:uuid", authTokenMiddleware(), deleteAktivitasDokumenByUUID)

export const getAktivitasDokumenRoute = () => {
    return {
        controller: router,
        prefix: "/aktivitas_dokumen"
    }
}