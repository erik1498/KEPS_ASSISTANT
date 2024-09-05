import express from "express"
import { deleteMetodePenyusutanByUUID, getAllMetodePenyusutans, getMetodePenyusutanByUUID, postCreateMetodePenyusutan, updateMetodePenyusutanByUUID } from "./metodePenyusutan.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/", authTokenMiddleware(), getAllMetodePenyusutans)
router.get("/:uuid", authTokenMiddleware(), getMetodePenyusutanByUUID)
router.post("/", authTokenMiddleware(), postCreateMetodePenyusutan)
router.put("/:uuid", authTokenMiddleware(), updateMetodePenyusutanByUUID)
router.delete("/:uuid", authTokenMiddleware(), deleteMetodePenyusutanByUUID)

export const getMetodePenyusutanRoute = () => {
    return {
        controller: router,
        prefix: "/metode_penyusutan"
    }
}