import express from "express"
import { deleteKategoriAsetByUUID, getAllKategoriAsets, getKategoriAsetByUUID, postCreateKategoriAset, updateKategoriAsetByUUID } from "./kategoriAset.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/", authTokenMiddleware(), getAllKategoriAsets)
router.get("/:uuid", authTokenMiddleware(), getKategoriAsetByUUID)
router.post("/", authTokenMiddleware(), postCreateKategoriAset)
router.put("/:uuid", authTokenMiddleware(), updateKategoriAsetByUUID)
router.delete("/:uuid", authTokenMiddleware(), deleteKategoriAsetByUUID)

export const getKategoriAsetRoute = () => {
    return {
        controller: router,
        prefix: "/kategori_aset"
    }
}