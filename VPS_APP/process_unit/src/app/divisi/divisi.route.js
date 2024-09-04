import express from "express"
import { deleteDivisiByUUID, getAllDivisis, getDivisiByUUID, postCreateDivisi, updateDivisiByUUID } from "./divisi.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/", authTokenMiddleware(), getAllDivisis)
router.get("/:uuid", authTokenMiddleware(), getDivisiByUUID)
router.post("/", authTokenMiddleware(), postCreateDivisi)
router.put("/:uuid", authTokenMiddleware(), updateDivisiByUUID)
router.delete("/:uuid", authTokenMiddleware(), deleteDivisiByUUID)

export const getDivisiRoute = () => {
    return {
        controller: router,
        prefix: "/divisi"
    }
}