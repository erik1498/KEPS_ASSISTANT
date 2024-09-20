import express from "express"
import { deleteHadiahByUUID, getAllHadiahs, getHadiahByPegawaiUUID, postCreateHadiah } from "./hadiah.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/", authTokenMiddleware(), getAllHadiahs)
router.get("/:uuid/:periode/:tahun", authTokenMiddleware(), getHadiahByPegawaiUUID)
router.post("/", authTokenMiddleware(), postCreateHadiah)
router.delete("/:uuid", authTokenMiddleware(), deleteHadiahByUUID)

export const getHadiahRoute = () => {
    return {
        controller: router,
        prefix: "/hadiah"
    }
}