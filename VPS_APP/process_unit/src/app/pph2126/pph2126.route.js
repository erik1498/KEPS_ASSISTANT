import express from "express"
import { deletePph2126ByUUID, getPph2126ByPegawaiUUID, postCreatePph2126, updatePph2126ByUUID } from "./pph2126.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/:uuid/:periode/:tahun", authTokenMiddleware(), getPph2126ByPegawaiUUID)
router.post("/", authTokenMiddleware(), postCreatePph2126)
router.put("/:uuid", authTokenMiddleware(), updatePph2126ByUUID)
router.delete("/:uuid", authTokenMiddleware(), deletePph2126ByUUID)

export const getPph2126Route = () => {
    return {
        controller: router,
        prefix: "/pph2126"
    }
}