import express from "express"
import { deleteJenisJasaByUUID, getAllJenisJasas, getJenisJasaByUUID, postCreateJenisJasa, updateJenisJasaByUUID } from "./jenisJasa.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/", authTokenMiddleware(), getAllJenisJasas)
router.get("/:uuid", authTokenMiddleware(), getJenisJasaByUUID)
router.post("/", authTokenMiddleware(), postCreateJenisJasa)
router.put("/:uuid", authTokenMiddleware(), updateJenisJasaByUUID)
router.delete("/:uuid", authTokenMiddleware(), deleteJenisJasaByUUID)

export const getJenisJasaRoute = () => {
    return {
        controller: router,
        prefix: "/jenis_jasa"
    }
}