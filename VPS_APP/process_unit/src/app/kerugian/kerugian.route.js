import express from "express"
import { deleteKerugianByUUID, getAllKerugians, getKerugianByPegawaiUUID, postCreateKerugian, updateKerugianByUUID } from "./kerugian.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/", authTokenMiddleware(), getAllKerugians)
router.get("/:uuid/:periode/:tahun", authTokenMiddleware(), getKerugianByPegawaiUUID)
router.post("/", authTokenMiddleware(), postCreateKerugian)
router.put("/:uuid", authTokenMiddleware(), updateKerugianByUUID)
router.delete("/:uuid", authTokenMiddleware(), deleteKerugianByUUID)

export const getKerugianRoute = () => {
    return {
        controller: router,
        prefix: "/kerugian"
    }
}