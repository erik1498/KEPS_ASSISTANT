import express from "express"
import { deletePengembalianDendaPembelianBarangByUUID, getAllPengembalianDendaPembelianBarangs, getPengembalianDendaPembelianBarangByUUID, postCreatePengembalianDendaPembelianBarang, updatePengembalianDendaPembelianBarangByUUID } from "./pengembalianDendaPembelianBarang.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/", authTokenMiddleware(), getAllPengembalianDendaPembelianBarangs)
router.get("/:uuid", authTokenMiddleware(), getPengembalianDendaPembelianBarangByUUID)
router.post("/", authTokenMiddleware(), postCreatePengembalianDendaPembelianBarang)
router.put("/:uuid", authTokenMiddleware(), updatePengembalianDendaPembelianBarangByUUID)
router.delete("/:uuid", authTokenMiddleware(), deletePengembalianDendaPembelianBarangByUUID)

export const getPengembalianDendaPembelianBarangRoute = () => {
    return {
        controller: router,
        prefix: "/pengembalian_denda_pembelian_barang"
    }
}