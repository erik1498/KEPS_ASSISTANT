import express from "express"
import { deleteStokAwalJasaByUUID, getAllStokAwalJasas, getStokAwalJasaByJasaUUID, postCreateStokAwalJasa, updateStokAwalJasaByUUID } from "./stokAwalJasa.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/", authTokenMiddleware(), getAllStokAwalJasas)
router.get("/:uuid", authTokenMiddleware(), getStokAwalJasaByJasaUUID)
router.post("/", authTokenMiddleware(), postCreateStokAwalJasa)
router.put("/:uuid", authTokenMiddleware(), updateStokAwalJasaByUUID)
router.delete("/:uuid", authTokenMiddleware(), deleteStokAwalJasaByUUID)

export const getStokAwalJasaRoute = () => {
    return {
        controller: router,
        prefix: "/stok_awal_jasa"
    }
}