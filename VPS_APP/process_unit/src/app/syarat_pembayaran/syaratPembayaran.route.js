import express from "express"
import { deleteSyaratPembayaranByUUID, getAllSyaratPembayaranByTipePembayaranUUID, getAllSyaratPembayarans, getSyaratPembayaranByUUID, postCreateSyaratPembayaran, updateSyaratPembayaranByUUID } from "./syaratPembayaran.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/", authTokenMiddleware(), getAllSyaratPembayarans)
router.get("/type/:tipe_pembayaran", getAllSyaratPembayaranByTipePembayaranUUID)
router.get("/:uuid", authTokenMiddleware(), getSyaratPembayaranByUUID)
router.post("/", authTokenMiddleware(), postCreateSyaratPembayaran)
router.put("/:uuid", authTokenMiddleware(), updateSyaratPembayaranByUUID)
router.delete("/:uuid", authTokenMiddleware(), deleteSyaratPembayaranByUUID)

export const getSyaratPembayaranRoute = () => {
    return {
        controller: router,
        prefix: "/syarat_pembayaran"
    }
}