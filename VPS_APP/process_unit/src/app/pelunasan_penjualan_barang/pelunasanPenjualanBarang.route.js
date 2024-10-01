import express from "express"
import { deletePelunasanPenjualanBarangByUUID, getAllPelunasanPenjualanBarangs, getPelunasanPenjualanBarangByUUID, postCreatePelunasanPenjualanBarang, updatePelunasanPenjualanBarangByUUID } from "./pelunasanPenjualanBarang.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/", authTokenMiddleware(), getAllPelunasanPenjualanBarangs)
router.get("/:uuid", authTokenMiddleware(), getPelunasanPenjualanBarangByUUID)
router.post("/", authTokenMiddleware(), postCreatePelunasanPenjualanBarang)
router.put("/:uuid", authTokenMiddleware(), updatePelunasanPenjualanBarangByUUID)
router.delete("/:uuid", authTokenMiddleware(), deletePelunasanPenjualanBarangByUUID)

export const getPelunasanPenjualanBarangRoute = () => {
    return {
        controller: router,
        prefix: "/pelunasan_penjualan_barang"
    }
}