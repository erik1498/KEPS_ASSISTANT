import express from "express"
import { deleteLemburByUUID, getAllLemburs, getLemburByPegawaiUUID, postCreateLembur } from "./lembur.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/", authTokenMiddleware(), getAllLemburs)
router.get("/:uuid/:periode/:tahun", authTokenMiddleware(), getLemburByPegawaiUUID)
router.post("/", authTokenMiddleware(), postCreateLembur)
router.delete("/:uuid", authTokenMiddleware(), deleteLemburByUUID)

export const getLemburRoute = () => {
    return {
        controller: router,
        prefix: "/lembur"
    }
}