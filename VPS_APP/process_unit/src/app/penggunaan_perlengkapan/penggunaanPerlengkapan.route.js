import express from "express"
import { deletePenggunaanPerlengkapanByUUID, getAllPenggunaanPerlengkapans, getPenggunaanPerlengkapanByUUID, postCreatePenggunaanPerlengkapan, updatePenggunaanPerlengkapanByUUID } from "./penggunaanPerlengkapan.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/", authTokenMiddleware(), getAllPenggunaanPerlengkapans)
router.get("/:uuid", authTokenMiddleware(), getPenggunaanPerlengkapanByUUID)
router.post("/", authTokenMiddleware(), postCreatePenggunaanPerlengkapan)
router.put("/:uuid", authTokenMiddleware(), updatePenggunaanPerlengkapanByUUID)
router.delete("/:uuid", authTokenMiddleware(), deletePenggunaanPerlengkapanByUUID)

export const getPenggunaanPerlengkapanRoute = () => {
    return {
        controller: router,
        prefix: "/penggunaan_perlengkapan"
    }
}