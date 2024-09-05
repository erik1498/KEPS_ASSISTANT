import express from "express"
import { deleteKategoriGudangByUUID, getAllKategoriGudangs, getKategoriGudangByUUID, postCreateKategoriGudang, updateKategoriGudangByUUID } from "./kategoriGudang.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/", authTokenMiddleware(), getAllKategoriGudangs)
router.get("/:uuid", authTokenMiddleware(), getKategoriGudangByUUID)
router.post("/", authTokenMiddleware(), postCreateKategoriGudang)
router.put("/:uuid", authTokenMiddleware(), updateKategoriGudangByUUID)
router.delete("/:uuid", authTokenMiddleware(), deleteKategoriGudangByUUID)

export const getKategoriGudangRoute = () => {
    return {
        controller: router,
        prefix: "/kategori_gudang"
    }
}