import express from "express"
import { deleteReturPembelianBarangByUUID, getAllReturPembelianBarangs, getReturPembelianBarangByUUID, postCreateReturPembelianBarang, updateReturPembelianBarangByUUID } from "./returPembelianBarang.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/", authTokenMiddleware(), getAllReturPembelianBarangs)
router.get("/:uuid", authTokenMiddleware(), getReturPembelianBarangByUUID)
router.post("/", authTokenMiddleware(), postCreateReturPembelianBarang)
router.put("/:uuid", authTokenMiddleware(), updateReturPembelianBarangByUUID)
router.delete("/:uuid", authTokenMiddleware(), deleteReturPembelianBarangByUUID)

export const getReturPembelianBarangRoute = () => {
    return {
        controller: router,
        prefix: "/retur_pembelian_barang"
    }
}