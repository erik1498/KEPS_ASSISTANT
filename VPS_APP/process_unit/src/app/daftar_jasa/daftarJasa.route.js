import express from "express"
import { deleteDaftarJasaByUUID, getAllDaftarJasas, getAllDaftarJasasAktifByDaftarGudang, getAllDaftarJasaUntukTransaksi, getDaftarJasaByUUID, postCreateDaftarJasa, updateDaftarJasaByUUID } from "./daftarJasa.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/", authTokenMiddleware(), getAllDaftarJasas)
router.get("/transaksi", authTokenMiddleware(), getAllDaftarJasaUntukTransaksi)
router.get("/by_gudang/:daftar_gudang", authTokenMiddleware(), getAllDaftarJasasAktifByDaftarGudang)
router.get("/:uuid", authTokenMiddleware(), getDaftarJasaByUUID)
router.post("/", authTokenMiddleware(), postCreateDaftarJasa)
router.put("/:uuid", authTokenMiddleware(), updateDaftarJasaByUUID)
router.delete("/:uuid", authTokenMiddleware(), deleteDaftarJasaByUUID)

export const getDaftarJasaRoute = () => {
    return {
        controller: router,
        prefix: "/daftar_jasa"
    }
}