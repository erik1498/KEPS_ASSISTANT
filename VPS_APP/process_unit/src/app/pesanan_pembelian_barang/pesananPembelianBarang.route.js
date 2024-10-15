import express from "express"
import { deletePesananPembelianBarangByUUID, getAllPesananPembelianBarangs, getPesananPembelianBarangByUUID, postCreatePesananPembelianBarang, updatePesananPembelianBarangByUUID } from "./pesananPembelianBarang.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/", authTokenMiddleware(), getAllPesananPembelianBarangs)
router.get("/:uuid", authTokenMiddleware(), getPesananPembelianBarangByUUID)
router.post("/", authTokenMiddleware(), postCreatePesananPembelianBarang)
router.put("/:uuid", authTokenMiddleware(), updatePesananPembelianBarangByUUID)
router.delete("/:uuid", authTokenMiddleware(), deletePesananPembelianBarangByUUID)

export const getPesananPembelianBarangRoute = () => {
    return {
        controller: router,
        prefix: "/pesanan_pembelian_barang"
    }
}