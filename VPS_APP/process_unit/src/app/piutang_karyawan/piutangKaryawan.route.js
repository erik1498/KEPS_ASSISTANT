import express from "express"
import { deletePiutangKaryawanByUUID, getPiutangKaryawanByPegawaiUUID, postCreatePiutangKaryawan, updatePiutangKaryawanByUUID } from "./piutangKaryawan.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/:uuid/:periode/:tahun", authTokenMiddleware(), getPiutangKaryawanByPegawaiUUID)
router.post("/", authTokenMiddleware(), postCreatePiutangKaryawan)
router.put("/:uuid", authTokenMiddleware(), updatePiutangKaryawanByUUID)
router.delete("/:uuid", authTokenMiddleware(), deletePiutangKaryawanByUUID)

export const getPiutangKaryawanRoute = () => {
    return {
        controller: router,
        prefix: "/piutang_karyawan"
    }
}