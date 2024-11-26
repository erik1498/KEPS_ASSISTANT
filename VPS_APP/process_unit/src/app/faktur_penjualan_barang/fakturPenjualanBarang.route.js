import express from "express"
import { deleteFakturPenjualanBarangByUUID, getAllFakturPenjualanBarangs, getFakturPenjualanBarangByPesananPenjualanBarangUUID, getFakturPenjualanBarangByUUID, getFakturReportPenjualanBarangs, getRiwayatTransaksiPenjualanBarangByFakturPenjualanBarangUUID, postCreateFakturPenjualanBarang, updateFakturPenjualanBarangByUUID } from "./fakturPenjualanBarang.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/", authTokenMiddleware(), getAllFakturPenjualanBarangs)
router.get("/faktur_report", authTokenMiddleware(), getFakturReportPenjualanBarangs)
router.get("/riwayat_transaksi/:uuid", authTokenMiddleware(), getRiwayatTransaksiPenjualanBarangByFakturPenjualanBarangUUID)
router.get("/pesanan_penjualan_barang/:pesanan_penjualan_barang", authTokenMiddleware(), getFakturPenjualanBarangByPesananPenjualanBarangUUID)
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