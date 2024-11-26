import express from "express"
import { deleteFakturPembelianBarangByUUID, getAllFakturPembelianBarangs, getFakturPembelianBarangByPesananPembelianBarangUUID, getFakturPembelianBarangByUUID, getFakturReportPembelianBarangs, getRiwayatTransaksiPembelianBarangByFakturPembelianBarangUUID, postCreateFakturPembelianBarang, updateFakturPembelianBarangByUUID } from "./fakturPembelianBarang.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/", authTokenMiddleware(), getAllFakturPembelianBarangs)
router.get("/faktur_report", authTokenMiddleware(), getFakturReportPembelianBarangs)
router.get("/riwayat_transaksi/:uuid", authTokenMiddleware(), getRiwayatTransaksiPembelianBarangByFakturPembelianBarangUUID)
router.get("/pesanan_pembelian_barang/:pesanan_pembelian_barang", authTokenMiddleware(), getFakturPembelianBarangByPesananPembelianBarangUUID)
router.get("/:uuid", authTokenMiddleware(), getFakturPembelianBarangByUUID)
router.post("/", authTokenMiddleware(), postCreateFakturPembelianBarang)
router.put("/:uuid", authTokenMiddleware(), updateFakturPembelianBarangByUUID)
router.delete("/:uuid", authTokenMiddleware(), deleteFakturPembelianBarangByUUID)

export const getFakturPembelianBarangRoute = () => {
    return {
        controller: router,
        prefix: "/faktur_pembelian_barang"
    }
}