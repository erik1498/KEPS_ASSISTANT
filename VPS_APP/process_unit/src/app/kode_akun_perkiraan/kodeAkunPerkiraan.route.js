import express from "express"
import { deleteKodeAkunPerkiraanByUUID, getAllKodeAkunPerkiraans, getAllKodeAkunPerkiraansAsetPerlengkapan, getAllKodeAkunPerkiraansBank, getAllKodeAkunPerkiraansKas, getAllKodeAkunPerkiraansKasBank, getAllKodeAkunPerkiraansNoBank, getAllKodeAkunPerkiraansNoKas, getAllKodeAkunPerkiraansPayroll, getHutangUsahaKodeAkun, getKodeAkunPerkiraanByUUID, getPiutangUsahaKodeAkun, postCreateKodeAkunPerkiraan, updateKodeAkunPerkiraanByUUID } from "./kodeAkunPerkiraan.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/", authTokenMiddleware(), getAllKodeAkunPerkiraans)
router.get("/kas", authTokenMiddleware(), getAllKodeAkunPerkiraansKas)
router.get("/kas_bank", authTokenMiddleware(), getAllKodeAkunPerkiraansKasBank)
router.get("/no_kas", authTokenMiddleware(), getAllKodeAkunPerkiraansNoKas)
router.get("/bank", authTokenMiddleware(), getAllKodeAkunPerkiraansBank)
router.get("/no_bank", authTokenMiddleware(), getAllKodeAkunPerkiraansNoBank)
router.get("/payroll", authTokenMiddleware(), getAllKodeAkunPerkiraansPayroll)
router.get("/aset_perlengkapan", authTokenMiddleware(), getAllKodeAkunPerkiraansAsetPerlengkapan)
router.get("/piutang_usaha", authTokenMiddleware(), getPiutangUsahaKodeAkun)
router.get("/hutang_usaha", authTokenMiddleware(), getHutangUsahaKodeAkun)
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