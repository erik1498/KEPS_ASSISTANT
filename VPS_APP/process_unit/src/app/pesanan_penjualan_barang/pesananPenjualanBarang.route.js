import express from "express"
import { deletePesananPenjualanBarangByUUID, getAllPesananPenjualanBarangs, getPesananPenjualanBarangByUUID, postCreatePesananPenjualanBarang, updatePesananPenjualanBarangByUUID } from "./pesananPenjualanBarang.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/", authTokenMiddleware(), getAllPesananPenjualanBarangs)
router.get("/:uuid", authTokenMiddleware(), getPesananPenjualanBarangByUUID)
router.post("/", authTokenMiddleware(), postCreatePesananPenjualanBarang)
router.put("/:uuid", authTokenMiddleware(), updatePesananPenjualanBarangByUUID)
router.delete("/:uuid", authTokenMiddleware(), deletePesananPenjualanBarangByUUID)

export const getPesananPenjualanBarangRoute = () => {
    return {
        controller: router,
        prefix: "/pesanan_penjualan_barang"
    }
}