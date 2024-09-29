import express from "express"
import { deleteFakturPenjualanBarangByUUID, getAllFakturPenjualanBarangs, getFakturPenjualanBarangByPesananPenjualanBarangUUID, getFakturPenjualanBarangByUUID, postCreateFakturPenjualanBarang, updateFakturPenjualanBarangByUUID } from "./fakturPenjualanBarang.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/", authTokenMiddleware(), getAllFakturPenjualanBarangs)
router.get("/pesanan_penjualan_barang/:pesanan_penjualan_barang_uuid", getFakturPenjualanBarangByPesananPenjualanBarangUUID)
router.get("/:uuid", authTokenMiddleware(), getFakturPenjualanBarangByUUID)
router.post("/", authTokenMiddleware(), postCreateFakturPenjualanBarang)
router.put("/:uuid", authTokenMiddleware(), updateFakturPenjualanBarangByUUID)
router.delete("/:uuid", authTokenMiddleware(), deleteFakturPenjualanBarangByUUID)

export const getFakturPenjualanBarangRoute = () => {
    return {
        controller: router,
        prefix: "/faktur_penjualan_barang"
    }
}