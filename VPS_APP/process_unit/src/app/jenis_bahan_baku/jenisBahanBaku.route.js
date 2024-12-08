import express from "express"
import { deleteJenisBahanBakuByUUID, getAllJenisBahanBakus, getJenisBahanBakuByUUID, postCreateJenisBahanBaku, updateJenisBahanBakuByUUID } from "./jenisBahanBaku.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/", authTokenMiddleware(), getAllJenisBahanBakus)
router.get("/:uuid", authTokenMiddleware(), getJenisBahanBakuByUUID)
router.post("/", authTokenMiddleware(), postCreateJenisBahanBaku)
router.put("/:uuid", authTokenMiddleware(), updateJenisBahanBakuByUUID)
router.delete("/:uuid", authTokenMiddleware(), deleteJenisBahanBakuByUUID)

export const getJenisBahanBakuRoute = () => {
    return {
        controller: router,
        prefix: "/jenis_bahan_baku"
    }
}