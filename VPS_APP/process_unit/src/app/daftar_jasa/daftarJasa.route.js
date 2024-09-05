import express from "express"
import { deleteDaftarJasaByUUID, getAllDaftarJasas, getDaftarJasaByUUID, postCreateDaftarJasa, updateDaftarJasaByUUID } from "./daftarJasa.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/", authTokenMiddleware(), getAllDaftarJasas)
router.get("/:uuid", authTokenMiddleware(), getDaftarJasaByUUID)
router.post("/", authTokenMiddleware(), postCreateDaftarJasa)
router.put("/:uuid", authTokenMiddleware(), updateDaftarJasaByUUID)
router.delete("/:uuid", authTokenMiddleware(), deleteDaftarJasaByUUID)

export const getDaftarJasaRoute = () => {
    return {
        controller: router,
        prefix: "/daftar_jasa"
    }
}