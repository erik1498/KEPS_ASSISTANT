import express from "express"
import { deletePegawaiByUUID, getAllPegawais, getPegawaiByUUID, postCreatePegawai, updatePegawaiByUUID } from "./pegawai.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/", authTokenMiddleware(), getAllPegawais)
router.get("/:uuid", authTokenMiddleware(), getPegawaiByUUID)
router.post("/", authTokenMiddleware(), postCreatePegawai)
router.put("/:uuid", authTokenMiddleware(), updatePegawaiByUUID)
router.delete("/:uuid", authTokenMiddleware(), deletePegawaiByUUID)

export const getPegawaiRoute = () => {
    return {
        controller: router,
        prefix: "/pegawai"
    }
}