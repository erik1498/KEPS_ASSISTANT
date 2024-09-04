import express from "express"
import { deleteSatuanBarangByUUID, getAllSatuanBarangs, getSatuanBarangByUUID, postCreateSatuanBarang, updateSatuanBarangByUUID } from "./satuanBarang.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/", authTokenMiddleware(), getAllSatuanBarangs)
router.get("/:uuid", authTokenMiddleware(), getSatuanBarangByUUID)
router.post("/", authTokenMiddleware(), postCreateSatuanBarang)
router.put("/:uuid", authTokenMiddleware(), updateSatuanBarangByUUID)
router.delete("/:uuid", authTokenMiddleware(), deleteSatuanBarangByUUID)

export const getSatuanBarangRoute = () => {
    return {
        controller: router,
        prefix: "/satuan_barang"
    }
}