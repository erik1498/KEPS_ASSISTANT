import express from "express"
import { deleteKategoriBarangByUUID, getAllKategoriBarangs, getKategoriBarangByUUID, postCreateKategoriBarang, updateKategoriBarangByUUID } from "./kategoriBarang.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/", authTokenMiddleware(), getAllKategoriBarangs)
router.get("/:uuid", authTokenMiddleware(), getKategoriBarangByUUID)
router.post("/", authTokenMiddleware(), postCreateKategoriBarang)
router.put("/:uuid", authTokenMiddleware(), updateKategoriBarangByUUID)
router.delete("/:uuid", authTokenMiddleware(), deleteKategoriBarangByUUID)

export const getKategoriBarangRoute = () => {
    return {
        controller: router,
        prefix: "/kategori_barang"
    }
}