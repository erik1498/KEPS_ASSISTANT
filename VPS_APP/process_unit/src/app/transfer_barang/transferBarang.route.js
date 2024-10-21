import express from "express"
import { deleteTransferBarangByUUID, getAllTransferBarangs, getTransferBarangByUUID, postCreateTransferBarang, updateTransferBarangByUUID } from "./transferBarang.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/", authTokenMiddleware(), getAllTransferBarangs)
router.get("/:uuid", authTokenMiddleware(), getTransferBarangByUUID)
router.post("/", authTokenMiddleware(), postCreateTransferBarang)
router.put("/:uuid", authTokenMiddleware(), updateTransferBarangByUUID)
router.delete("/:uuid", authTokenMiddleware(), deleteTransferBarangByUUID)

export const getTransferBarangRoute = () => {
    return {
        controller: router,
        prefix: "/transfer_barang"
    }
}