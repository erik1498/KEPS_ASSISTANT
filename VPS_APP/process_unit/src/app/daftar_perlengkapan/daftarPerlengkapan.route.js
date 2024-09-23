import express from "express"
import { deleteDaftarPerlengkapanByUUID, getAllDaftarPerlengkapans, getDaftarPerlengkapanByUUID, postCreateDaftarPerlengkapan, updateDaftarPerlengkapanByUUID } from "./daftarPerlengkapan.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/", authTokenMiddleware(), getAllDaftarPerlengkapans)
router.get("/:uuid", authTokenMiddleware(), getDaftarPerlengkapanByUUID)
router.post("/", authTokenMiddleware(), postCreateDaftarPerlengkapan)
router.put("/:uuid", authTokenMiddleware(), updateDaftarPerlengkapanByUUID)
router.delete("/:uuid", authTokenMiddleware(), deleteDaftarPerlengkapanByUUID)

export const getDaftarPerlengkapanRoute = () => {
    return {
        controller: router,
        prefix: "/daftar_perlengkapan"
    }
}