import express from "express"
import { deleteTunjanganUangByUUID, getTunjanganUangByPegawaiUUID, postCreateTunjanganUang } from "./tunjanganUang.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/:uuid/:tahun", authTokenMiddleware(), getTunjanganUangByPegawaiUUID)
router.post("/", authTokenMiddleware(), postCreateTunjanganUang)
router.delete("/:uuid", authTokenMiddleware(), deleteTunjanganUangByUUID)

export const getTunjanganUangRoute = () => {
    return {
        controller: router,
        prefix: "/tunjangan_uang"
    }
}