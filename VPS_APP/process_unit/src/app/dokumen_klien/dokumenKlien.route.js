import express from "express"
import { deleteDokumenKlienByUUID, getAllDokumenKliensByAktivitasDokumen, getDokumenKlienByUUID, postCreateDokumenKlien, updateDokumenKlienByUUID } from "./dokumenKlien.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/:aktivitas_dokumen", authTokenMiddleware(), getAllDokumenKliensByAktivitasDokumen)
router.get("/:uuid", authTokenMiddleware(), getDokumenKlienByUUID)
router.post("/", authTokenMiddleware(), postCreateDokumenKlien)
router.put("/:uuid", authTokenMiddleware(), updateDokumenKlienByUUID)
router.delete("/:uuid", authTokenMiddleware(), deleteDokumenKlienByUUID)

export const getDokumenKlienRoute = () => {
    return {
        controller: router,
        prefix: "/dokumen_klien"
    }
}