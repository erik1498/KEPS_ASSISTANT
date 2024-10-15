import express from "express"
import { deleteFakturPenjualanJasaByUUID, getAllFakturPenjualanJasas, getFakturPenjualanJasaByPesananPenjualanJasaUUID, getFakturPenjualanJasaByUUID, getRiwayatTransaksiPenjualanJasaByFakturPenjualanJasaUUID, postCreateFakturPenjualanJasa, updateFakturPenjualanJasaByUUID } from "./fakturPenjualanJasa.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/", authTokenMiddleware(), getAllFakturPenjualanJasas)
router.get("/riwayat_transaksi/:uuid", authTokenMiddleware(), getRiwayatTransaksiPenjualanJasaByFakturPenjualanJasaUUID)
router.get("/pesanan_penjualan_jasa/:pesanan_penjualan_jasa_uuid", getFakturPenjualanJasaByPesananPenjualanJasaUUID)
router.get("/:uuid", authTokenMiddleware(), getFakturPenjualanJasaByUUID)
router.post("/", authTokenMiddleware(), postCreateFakturPenjualanJasa)
router.put("/:uuid", authTokenMiddleware(), updateFakturPenjualanJasaByUUID)
router.delete("/:uuid", authTokenMiddleware(), deleteFakturPenjualanJasaByUUID)

export const getFakturPenjualanJasaRoute = () => {
    return {
        controller: router,
        prefix: "/faktur_penjualan_jasa"
    }
}