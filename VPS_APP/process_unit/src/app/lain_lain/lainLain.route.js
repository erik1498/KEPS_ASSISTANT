import express from "express"
import { deleteLainLainByUUID, getLainLainByPegawaiUUID, postCreateLainLain, updateLainLainByUUID } from "./lainLain.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/:uuid/:periode/:tahun", authTokenMiddleware(), getLainLainByPegawaiUUID)
router.post("/", authTokenMiddleware(), postCreateLainLain)
router.put("/:uuid", authTokenMiddleware(), updateLainLainByUUID)
router.delete("/:uuid", authTokenMiddleware(), deleteLainLainByUUID)

export const getLainLainRoute = () => {
    return {
        controller: router,
        prefix: "/lain_lain"
    }
}