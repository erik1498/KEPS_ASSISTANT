import express from "express"
import { deleteStatusTanggunganByUUID, getAllStatusTanggungans, getStatusTanggunganByUUID, postCreateStatusTanggungan, updateStatusTanggunganByUUID } from "./statusTanggungan.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/", authTokenMiddleware(), getAllStatusTanggungans)
router.get("/:uuid", authTokenMiddleware(), getStatusTanggunganByUUID)
router.post("/", authTokenMiddleware(), postCreateStatusTanggungan)
router.put("/:uuid", authTokenMiddleware(), updateStatusTanggunganByUUID)
router.delete("/:uuid", authTokenMiddleware(), deleteStatusTanggunganByUUID)

export const getStatusTanggunganRoute = () => {
    return {
        controller: router,
        prefix: "/status_tanggungan"
    }
}