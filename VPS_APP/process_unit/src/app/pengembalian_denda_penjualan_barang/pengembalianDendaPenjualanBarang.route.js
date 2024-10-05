import express from "express"
import { deletePengembalianDendaPenjualanBarangByUUID, getAllPengembalianDendaPenjualanBarangs, getPengembalianDendaPenjualanBarangByUUID, postCreatePengembalianDendaPenjualanBarang, updatePengembalianDendaPenjualanBarangByUUID } from "./pengembalianDendaPenjualanBarang.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/", authTokenMiddleware(), getAllPengembalianDendaPenjualanBarangs)
router.get("/:uuid", authTokenMiddleware(), getPengembalianDendaPenjualanBarangByUUID)
router.post("/", authTokenMiddleware(), postCreatePengembalianDendaPenjualanBarang)
router.put("/:uuid", authTokenMiddleware(), updatePengembalianDendaPenjualanBarangByUUID)
router.delete("/:uuid", authTokenMiddleware(), deletePengembalianDendaPenjualanBarangByUUID)

export const getPengembalianDendaPenjualanBarangRoute = () => {
    return {
        controller: router,
        prefix: "/pengembalian_denda_penjualan_barang"
    }
}