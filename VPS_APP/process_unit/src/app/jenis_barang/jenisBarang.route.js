import express from "express"
import { deleteJenisBarangByUUID, getAllJenisBarangs, getJenisBarangByUUID, postCreateJenisBarang, updateJenisBarangByUUID } from "./jenisBarang.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/", authTokenMiddleware(), getAllJenisBarangs)
router.get("/:uuid", authTokenMiddleware(), getJenisBarangByUUID)
router.post("/", authTokenMiddleware(), postCreateJenisBarang)
router.put("/:uuid", authTokenMiddleware(), updateJenisBarangByUUID)
router.delete("/:uuid", authTokenMiddleware(), deleteJenisBarangByUUID)

export const getJenisBarangRoute = () => {
    return {
        controller: router,
        prefix: "/jenis_barang"
    }
}