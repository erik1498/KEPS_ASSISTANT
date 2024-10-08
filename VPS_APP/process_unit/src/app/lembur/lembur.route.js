import express from "express"
import { deleteLemburByUUID, getAllLemburs, getLemburByPegawaiUUID, postCreateLembur, updateLemburByUUID } from "./lembur.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/", authTokenMiddleware(), getAllLemburs)
router.get("/:uuid/:periode/:tahun", authTokenMiddleware(), getLemburByPegawaiUUID)
router.post("/", authTokenMiddleware(), postCreateLembur)
router.put("/:uuid", authTokenMiddleware(), updateLemburByUUID)
router.delete("/:uuid", authTokenMiddleware(), deleteLemburByUUID)

export const getLemburRoute = () => {
    return {
        controller: router,
        prefix: "/lembur"
    }
}