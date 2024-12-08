import express from "express"
import { deleteTransferBahanBakuByUUID, getAllTransferBahanBakus, getTransferBahanBakuByUUID, postCreateTransferBahanBaku, updateTransferBahanBakuByUUID } from "./transferBahanBaku.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/", authTokenMiddleware(), getAllTransferBahanBakus)
router.get("/:uuid", authTokenMiddleware(), getTransferBahanBakuByUUID)
router.post("/", authTokenMiddleware(), postCreateTransferBahanBaku)
router.put("/:uuid", authTokenMiddleware(), updateTransferBahanBakuByUUID)
router.delete("/:uuid", authTokenMiddleware(), deleteTransferBahanBakuByUUID)

export const getTransferBahanBakuRoute = () => {
    return {
        controller: router,
        prefix: "/transfer_bahan_baku"
    }
}