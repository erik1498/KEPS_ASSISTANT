import express from "express"
import { deleteDaftarAsetByUUID, getAllDaftarAsets, getDaftarAsetByUUID, postCreateDaftarAset, updateDaftarAsetByUUID } from "./daftarAset.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/", authTokenMiddleware(), getAllDaftarAsets)
router.get("/:uuid", authTokenMiddleware(), getDaftarAsetByUUID)
router.post("/", authTokenMiddleware(), postCreateDaftarAset)
router.put("/:uuid", authTokenMiddleware(), updateDaftarAsetByUUID)
router.delete("/:uuid", authTokenMiddleware(), deleteDaftarAsetByUUID)

export const getDaftarAsetRoute = () => {
    return {
        controller: router,
        prefix: "/daftar_aset"
    }
}