import express from "express"
import { deleteReturPenjualanBarangByUUID, getAllReturPenjualanBarangs, getReturPenjualanBarangByUUID, postCreateReturPenjualanBarang, updateReturPenjualanBarangByUUID } from "./returPenjualanBarang.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/", authTokenMiddleware(), getAllReturPenjualanBarangs)
router.get("/:uuid", authTokenMiddleware(), getReturPenjualanBarangByUUID)
router.post("/", authTokenMiddleware(), postCreateReturPenjualanBarang)
router.put("/:uuid", authTokenMiddleware(), updateReturPenjualanBarangByUUID)
router.delete("/:uuid", authTokenMiddleware(), deleteReturPenjualanBarangByUUID)

export const getReturPenjualanBarangRoute = () => {
    return {
        controller: router,
        prefix: "/retur_penjualan_barang"
    }
}