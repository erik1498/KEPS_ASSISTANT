import express from "express"
import { deleteRincianPengirimanBarangByUUID, getAllRincianPengirimanBarangs, getRincianPengirimanBarangByUUID, postCreateRincianPengirimanBarang, updateRincianPengirimanBarangByUUID } from "./rincianPengirimanBarang.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/", authTokenMiddleware(), getAllRincianPengirimanBarangs)
router.get("/:uuid", authTokenMiddleware(), getRincianPengirimanBarangByUUID)
router.post("/", authTokenMiddleware(), postCreateRincianPengirimanBarang)
router.put("/:uuid", authTokenMiddleware(), updateRincianPengirimanBarangByUUID)
router.delete("/:uuid", authTokenMiddleware(), deleteRincianPengirimanBarangByUUID)

export const getRincianPengirimanBarangRoute = () => {
    return {
        controller: router,
        prefix: "/rincian_pengiriman_barang"
    }
}