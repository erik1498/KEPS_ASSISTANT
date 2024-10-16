import express from "express"
import { deleteRincianPengembalianDendaPembelianBarangByUUID, getAllRincianPengembalianDendaPembelianBarangs, getRincianPengembalianDendaPembelianBarangByFakturPembelianBarangUUID, postCreateRincianPengembalianDendaPembelianBarang, updateRincianPengembalianDendaPembelianBarangByUUID } from "./rincianPengembalianDendaPembelianBarang.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/", authTokenMiddleware(), getAllRincianPengembalianDendaPembelianBarangs)
router.get("/pesanan/:uuid", authTokenMiddleware(), getRincianPengembalianDendaPembelianBarangByFakturPembelianBarangUUID)
router.post("/", authTokenMiddleware(), postCreateRincianPengembalianDendaPembelianBarang)
router.put("/:uuid", authTokenMiddleware(), updateRincianPengembalianDendaPembelianBarangByUUID)
router.delete("/:uuid", authTokenMiddleware(), deleteRincianPengembalianDendaPembelianBarangByUUID)

export const getRincianPengembalianDendaPembelianBarangRoute = () => {
    return {
        controller: router,
        prefix: "/rincian_pengembalian_denda_pembelian_barang"
    }
}