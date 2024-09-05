import express from "express"
import { deleteJenisGudangByUUID, getAllJenisGudangs, getJenisGudangByUUID, postCreateJenisGudang, updateJenisGudangByUUID } from "./jenisGudang.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/", authTokenMiddleware(), getAllJenisGudangs)
router.get("/:uuid", authTokenMiddleware(), getJenisGudangByUUID)
router.post("/", authTokenMiddleware(), postCreateJenisGudang)
router.put("/:uuid", authTokenMiddleware(), updateJenisGudangByUUID)
router.delete("/:uuid", authTokenMiddleware(), deleteJenisGudangByUUID)

export const getJenisGudangRoute = () => {
    return {
        controller: router,
        prefix: "/jenis_gudang"
    }
}