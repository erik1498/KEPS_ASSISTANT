import express from "express"
import { deleteDaftarBarangByUUID, getAllDaftarBarangs, getAllDaftarBarangUntukTransaksi, getDaftarBarangByUUID, postCreateDaftarBarang, updateDaftarBarangByUUID } from "./daftarBarang.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/", authTokenMiddleware(), getAllDaftarBarangs)
router.get("/transaksi", getAllDaftarBarangUntukTransaksi)
router.get("/:uuid", authTokenMiddleware(), getDaftarBarangByUUID)
router.post("/", authTokenMiddleware(), postCreateDaftarBarang)
router.put("/:uuid", authTokenMiddleware(), updateDaftarBarangByUUID)
router.delete("/:uuid", authTokenMiddleware(), deleteDaftarBarangByUUID)

export const getDaftarBarangRoute = () => {
    return {
        controller: router,
        prefix: "/daftar_barang"
    }
}