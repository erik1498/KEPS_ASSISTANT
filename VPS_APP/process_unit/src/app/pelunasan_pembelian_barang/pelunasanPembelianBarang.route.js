import express from "express"
import { deletePelunasanPembelianBarangByUUID, getAllPelunasanPembelianBarangs, getPelunasanPembelianBarangByUUID, postCreatePelunasanPembelianBarang, updatePelunasanPembelianBarangByUUID } from "./pelunasanPembelianBarang.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/", authTokenMiddleware(), getAllPelunasanPembelianBarangs)
router.get("/:uuid", authTokenMiddleware(), getPelunasanPembelianBarangByUUID)
router.post("/", authTokenMiddleware(), postCreatePelunasanPembelianBarang)
router.put("/:uuid", authTokenMiddleware(), updatePelunasanPembelianBarangByUUID)
router.delete("/:uuid", authTokenMiddleware(), deletePelunasanPembelianBarangByUUID)

export const getPelunasanPembelianBarangRoute = () => {
    return {
        controller: router,
        prefix: "/pelunasan_pembelian_barang"
    }
}