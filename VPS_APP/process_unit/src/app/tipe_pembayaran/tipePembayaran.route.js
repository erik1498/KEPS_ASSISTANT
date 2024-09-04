import express from "express"
import { deleteTipePembayaranByUUID, getAllTipePembayarans, getTipePembayaranByUUID, postCreateTipePembayaran, updateTipePembayaranByUUID } from "./tipePembayaran.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/", authTokenMiddleware(), getAllTipePembayarans)
router.get("/:uuid", authTokenMiddleware(), getTipePembayaranByUUID)
router.post("/", authTokenMiddleware(), postCreateTipePembayaran)
router.put("/:uuid", authTokenMiddleware(), updateTipePembayaranByUUID)
router.delete("/:uuid", authTokenMiddleware(), deleteTipePembayaranByUUID)

export const getTipePembayaranRoute = () => {
    return {
        controller: router,
        prefix: "/tipe_pembayaran"
    }
}