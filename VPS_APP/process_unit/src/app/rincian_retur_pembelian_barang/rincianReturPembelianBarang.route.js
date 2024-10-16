import express from "express"
import { deleteRincianReturPembelianBarangByUUID, getAllRincianPesananPembelianBarangByReturPembelian, getAllRincianReturPembelianBarangs, getRincianReturPembelianBarangByUUID, postCreateRincianReturPembelianBarang, updateRincianReturPembelianBarangByUUID } from "./rincianReturPembelianBarang.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/", authTokenMiddleware(), getAllRincianReturPembelianBarangs)
router.get("/pesanan/:uuid", authTokenMiddleware(), getAllRincianPesananPembelianBarangByReturPembelian)
router.get("/:uuid", authTokenMiddleware(), getRincianReturPembelianBarangByUUID)
router.post("/", authTokenMiddleware(), postCreateRincianReturPembelianBarang)
router.put("/:uuid", authTokenMiddleware(), updateRincianReturPembelianBarangByUUID)
router.delete("/:uuid", authTokenMiddleware(), deleteRincianReturPembelianBarangByUUID)

export const getRincianReturPembelianBarangRoute = () => {
    return {
        controller: router,
        prefix: "/rincian_retur_pembelian_barang"
    }
}