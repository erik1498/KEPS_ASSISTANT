import express from "express"
import { deleteSatuanBahanBakuByUUID, getAllSatuanBahanBakus, getSatuanBahanBakuByUUID, postCreateSatuanBahanBaku, updateSatuanBahanBakuByUUID } from "./satuanBahanBaku.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/", authTokenMiddleware(), getAllSatuanBahanBakus)
router.get("/:uuid", authTokenMiddleware(), getSatuanBahanBakuByUUID)
router.post("/", authTokenMiddleware(), postCreateSatuanBahanBaku)
router.put("/:uuid", authTokenMiddleware(), updateSatuanBahanBakuByUUID)
router.delete("/:uuid", authTokenMiddleware(), deleteSatuanBahanBakuByUUID)

export const getSatuanBahanBakuRoute = () => {
    return {
        controller: router,
        prefix: "/satuan_bahan_baku"
    }
}