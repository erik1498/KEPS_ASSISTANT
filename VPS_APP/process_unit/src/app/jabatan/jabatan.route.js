import express from "express"
import { deleteJabatanByUUID, getAllJabatans, getJabatanByUUID, postCreateJabatan, updateJabatanByUUID } from "./jabatan.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/", authTokenMiddleware(), getAllJabatans)
router.get("/:uuid", authTokenMiddleware(), getJabatanByUUID)
router.post("/", authTokenMiddleware(), postCreateJabatan)
router.put("/:uuid", authTokenMiddleware(), updateJabatanByUUID)
router.delete("/:uuid", authTokenMiddleware(), deleteJabatanByUUID)

export const getJabatanRoute = () => {
    return {
        controller: router,
        prefix: "/jabatan"
    }
}