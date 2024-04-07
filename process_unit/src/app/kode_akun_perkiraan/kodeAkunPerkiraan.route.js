import express from "express"
import { deleteKodeAkunPerkiraanByUUID, getAllKodeAkunPerkiraanKas, getAllKodeAkunPerkiraanNoKas, getAllKodeAkunPerkiraanByType, getAllKodeAkunPerkiraanExceptType, getAllKodeAkunPerkiraans, getKodeAkunPerkiraanByUUID, postCreateKodeAkunPerkiraan, updateKodeAkunPerkiraanByUUID, getAllKodeAkunPerkiraanBank, getAllKodeAkunPerkiraanNoBank, getKodeAkunPerkiraansByCodeList } from "./kodeAkunPerkiraan.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/", authTokenMiddleware(), getAllKodeAkunPerkiraans)
// router.get("/type/:type", authTokenMiddleware(), getAllKodeAkunPerkiraanByType)
// router.get("/kas", authTokenMiddleware(), getAllKodeAkunPerkiraanKas)
// router.get("/no_kas", authTokenMiddleware(), getAllKodeAkunPerkiraanNoKas)
// router.get("/bank", authTokenMiddleware(), getAllKodeAkunPerkiraanBank)
// router.get("/no_bank", authTokenMiddleware(), getAllKodeAkunPerkiraanNoBank)
// router.post("/by_code_list", authTokenMiddleware(), getKodeAkunPerkiraansByCodeList)
// router.get("/except_type/:type", authTokenMiddleware(), getAllKodeAkunPerkiraanExceptType)
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