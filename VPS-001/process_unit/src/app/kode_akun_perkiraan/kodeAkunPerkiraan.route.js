import express from "express"
import { deleteKodeAkunPerkiraanByUUID, getAllKodeAkunPerkiraans, getKodeAkunPerkiraanByUUID, postCreateKodeAkunPerkiraan, updateKodeAkunPerkiraanByUUID } from "./kodeAkunPerkiraan.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/", authTokenMiddleware(), getAllKodeAkunPerkiraans)
router.get("/:uuid", authTokenMiddleware(), getKodeAkunPerkiraanByUUID)
router.post("/", authTokenMiddleware(), postCreateKodeAkunPerkiraan)
router.put("/:uuid", authTokenMiddleware(), updateKodeAkunPerkiraanByUUID)
router.delete("/:uuid", authTokenMiddleware(), deleteKodeAkunPerkiraanByUUID)

export const getKodeAkunPerkiraanRoute = () => {
    return {
        controller: router,
        prefix: "/kode_akun_perkiraan"
    }
}