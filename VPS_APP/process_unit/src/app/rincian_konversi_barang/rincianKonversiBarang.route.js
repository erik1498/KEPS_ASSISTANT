import express from "express"
import { deleteRincianKonversiBarangByUUID, getAllRincianKonversiBarangs, getRincianKonversiBarangByKonversiBarangUuid, getRincianKonversiBarangByUUID, postCreateRincianKonversiBarang, updateRincianKonversiBarangByUUID } from "./rincianKonversiBarang.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/", authTokenMiddleware(), getAllRincianKonversiBarangs)
router.get("/by_konversi_barang/:konversi_barang", authTokenMiddleware(), getRincianKonversiBarangByKonversiBarangUuid)
router.get("/:uuid", authTokenMiddleware(), getRincianKonversiBarangByUUID)
router.post("/", authTokenMiddleware(), postCreateRincianKonversiBarang)
router.put("/:uuid", authTokenMiddleware(), updateRincianKonversiBarangByUUID)
router.delete("/:uuid", authTokenMiddleware(), deleteRincianKonversiBarangByUUID)

export const getRincianKonversiBarangRoute = () => {
    return {
        controller: router,
        prefix: "/rincian_konversi_barang"
    }
}