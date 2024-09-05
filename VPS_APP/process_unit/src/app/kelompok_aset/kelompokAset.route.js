import express from "express"
import { deleteKelompokAsetByUUID, getAllKelompokAsets, getKelompokAsetByUUID, postCreateKelompokAset, updateKelompokAsetByUUID } from "./kelompokAset.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/", authTokenMiddleware(), getAllKelompokAsets)
router.get("/:uuid", authTokenMiddleware(), getKelompokAsetByUUID)
router.post("/", authTokenMiddleware(), postCreateKelompokAset)
router.put("/:uuid", authTokenMiddleware(), updateKelompokAsetByUUID)
router.delete("/:uuid", authTokenMiddleware(), deleteKelompokAsetByUUID)

export const getKelompokAsetRoute = () => {
    return {
        controller: router,
        prefix: "/kelompok_aset"
    }
}