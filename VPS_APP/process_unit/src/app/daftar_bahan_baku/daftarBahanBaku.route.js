import express from "express"
import { deleteDaftarBahanBakuByUUID, getAllDaftarBahanBakus, getAllDaftarBahanBakusAktifByDaftarGudang, getAllDaftarBahanBakuUntukTransaksi, getDaftarBahanBakuByUUID, postCreateDaftarBahanBaku, updateDaftarBahanBakuByUUID } from "./daftarBahanBaku.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/", authTokenMiddleware(), getAllDaftarBahanBakus)
router.get("/transaksi", authTokenMiddleware(), getAllDaftarBahanBakuUntukTransaksi)
router.get("/by_gudang/:daftar_gudang", authTokenMiddleware(), getAllDaftarBahanBakusAktifByDaftarGudang)
router.get("/:uuid", authTokenMiddleware(), getDaftarBahanBakuByUUID)
router.post("/", authTokenMiddleware(), postCreateDaftarBahanBaku)
router.put("/:uuid", authTokenMiddleware(), updateDaftarBahanBakuByUUID)
router.delete("/:uuid", authTokenMiddleware(), deleteDaftarBahanBakuByUUID)

export const getDaftarBahanBakuRoute = () => {
    return {
        controller: router,
        prefix: "/daftar_bahan_baku"
    }
}