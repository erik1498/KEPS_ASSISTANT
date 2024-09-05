import express from "express"
import { deleteKategoriPerlengkapanByUUID, getAllKategoriPerlengkapans, getKategoriPerlengkapanByUUID, postCreateKategoriPerlengkapan, updateKategoriPerlengkapanByUUID } from "./kategoriPerlengkapan.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/", authTokenMiddleware(), getAllKategoriPerlengkapans)
router.get("/:uuid", authTokenMiddleware(), getKategoriPerlengkapanByUUID)
router.post("/", authTokenMiddleware(), postCreateKategoriPerlengkapan)
router.put("/:uuid", authTokenMiddleware(), updateKategoriPerlengkapanByUUID)
router.delete("/:uuid", authTokenMiddleware(), deleteKategoriPerlengkapanByUUID)

export const getKategoriPerlengkapanRoute = () => {
    return {
        controller: router,
        prefix: "/kategori_perlengkapan"
    }
}