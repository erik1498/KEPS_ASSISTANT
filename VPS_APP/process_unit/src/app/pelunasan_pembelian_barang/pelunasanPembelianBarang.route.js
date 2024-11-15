import express from "express"
import { deletePelunasanPembelianBarangByUUID, getAllPelunasanPembelianBarangs, getCekDendaByPelunasanPembelianUUID, getPelunasanPembelianBarangByUUID, postCreatePelunasanPembelianBarang, updatePelunasanPembelianBarangByUUID } from "./pelunasanPembelianBarang.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/", authTokenMiddleware(), getAllPelunasanPembelianBarangs)
router.get("/cek_denda_pelunasan_pembelian/:uuid", authTokenMiddleware(), getCekDendaByPelunasanPembelianUUID)
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