import express from "express"
import { deleteGajiByUUID, getAllGajis, getGajiByPegawaiUUID, postCreateGaji, updateGajiByUUID } from "./gaji.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/", authTokenMiddleware(), getAllGajis)
router.get("/:uuid/:periode/:tahun", authTokenMiddleware(), getGajiByPegawaiUUID)
router.post("/", authTokenMiddleware(), postCreateGaji)
router.put("/:uuid", authTokenMiddleware(), updateGajiByUUID)
router.delete("/:uuid", authTokenMiddleware(), deleteGajiByUUID)

export const getGajiRoute = () => {
    return {
        controller: router,
        prefix: "/gaji"
    }
}