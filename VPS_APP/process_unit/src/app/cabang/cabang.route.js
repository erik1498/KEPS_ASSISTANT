import express from "express"
import { deleteCabangByUUID, getAllCabangs, getCabangByUUID, postCreateCabang, updateCabangByUUID } from "./cabang.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/", authTokenMiddleware(), getAllCabangs)
router.get("/:uuid", authTokenMiddleware(), getCabangByUUID)
router.post("/", authTokenMiddleware(), postCreateCabang)
router.put("/:uuid", authTokenMiddleware(), updateCabangByUUID)
router.delete("/:uuid", authTokenMiddleware(), deleteCabangByUUID)

export const getCabangRoute = () => {
    return {
        controller: router,
        prefix: "/cabang"
    }
}