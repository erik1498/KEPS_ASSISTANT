import express from "express"
import { deleteDaftarGudangByUUID, getAllDaftarGudangs, getDaftarGudangByUUID, postCreateDaftarGudang, updateDaftarGudangByUUID } from "./daftarGudang.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/", authTokenMiddleware(), getAllDaftarGudangs)
router.get("/:uuid", authTokenMiddleware(), getDaftarGudangByUUID)
router.post("/", authTokenMiddleware(), postCreateDaftarGudang)
router.put("/:uuid", authTokenMiddleware(), updateDaftarGudangByUUID)
router.delete("/:uuid", authTokenMiddleware(), deleteDaftarGudangByUUID)

export const getDaftarGudangRoute = () => {
    return {
        controller: router,
        prefix: "/daftar_gudang"
    }
}