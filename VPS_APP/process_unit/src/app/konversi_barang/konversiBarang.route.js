import express from "express"
import { deleteKonversiBarangByUUID, getAllKonversiBarangs, getKonversiBarangByUUID, postCreateKonversiBarang, updateKonversiBarangByUUID } from "./konversiBarang.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/", authTokenMiddleware(), getAllKonversiBarangs)
router.get("/:uuid", authTokenMiddleware(), getKonversiBarangByUUID)
router.post("/", authTokenMiddleware(), postCreateKonversiBarang)
router.put("/:uuid", authTokenMiddleware(), updateKonversiBarangByUUID)
router.delete("/:uuid", authTokenMiddleware(), deleteKonversiBarangByUUID)

export const getKonversiBarangRoute = () => {
    return {
        controller: router,
        prefix: "/konversi_barang"
    }
}