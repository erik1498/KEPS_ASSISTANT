import express from "express"
import { deleteSatuanJasaByUUID, getAllSatuanJasas, getSatuanJasaByUUID, postCreateSatuanJasa, updateSatuanJasaByUUID } from "./satuanJasa.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/", authTokenMiddleware(), getAllSatuanJasas)
router.get("/:uuid", authTokenMiddleware(), getSatuanJasaByUUID)
router.post("/", authTokenMiddleware(), postCreateSatuanJasa)
router.put("/:uuid", authTokenMiddleware(), updateSatuanJasaByUUID)
router.delete("/:uuid", authTokenMiddleware(), deleteSatuanJasaByUUID)

export const getSatuanJasaRoute = () => {
    return {
        controller: router,
        prefix: "/satuan_jasa"
    }
}