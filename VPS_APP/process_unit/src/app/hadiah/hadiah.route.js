import express from "express"
import { deleteHadiahByUUID, getHadiahByPegawaiUUID, postCreateHadiah } from "./hadiah.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/:uuid/:tahun", authTokenMiddleware(), getHadiahByPegawaiUUID)
router.post("/", authTokenMiddleware(), postCreateHadiah)
router.delete("/:uuid", authTokenMiddleware(), deleteHadiahByUUID)

export const getHadiahRoute = () => {
    return {
        controller: router,
        prefix: "/hadiah"
    }
}