import express from "express"
import { deleteGajiByUUID, getGajiByPegawaiUUID, postCreateGaji } from "./gaji.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/:uuid", authTokenMiddleware(), getGajiByPegawaiUUID)
router.post("/", authTokenMiddleware(), postCreateGaji)
router.delete("/:uuid", authTokenMiddleware(), deleteGajiByUUID)

export const getGajiRoute = () => {
    return {
        controller: router,
        prefix: "/gaji"
    }
}