import express from "express"
import { deleteTunjanganUangByUUID, getAllTunjanganUangs, getTunjanganUangByPegawaiUUID, postCreateTunjanganUang, updateTunjanganUangByUUID } from "./tunjanganUang.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/", authTokenMiddleware(), getAllTunjanganUangs)
router.get("/:uuid/:periode/:tahun", authTokenMiddleware(), getTunjanganUangByPegawaiUUID)
router.post("/", authTokenMiddleware(), postCreateTunjanganUang)
router.put("/:uuid", authTokenMiddleware(), updateTunjanganUangByUUID)
router.delete("/:uuid", authTokenMiddleware(), deleteTunjanganUangByUUID)

export const getTunjanganUangRoute = () => {
    return {
        controller: router,
        prefix: "/tunjangan_uang"
    }
}