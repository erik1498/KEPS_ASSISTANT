import express from "express"
import { deletePenyesuaianPersediaanByUUID, getAllPenyesuaianPersediaans, getPenyesuaianPersediaanByUUID, postCreatePenyesuaianPersediaan, updatePenyesuaianPersediaanByUUID } from "./penyesuaianPersediaan.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/", authTokenMiddleware(), getAllPenyesuaianPersediaans)
router.get("/:uuid", authTokenMiddleware(), getPenyesuaianPersediaanByUUID)
router.post("/", authTokenMiddleware(), postCreatePenyesuaianPersediaan)
router.put("/:uuid", authTokenMiddleware(), updatePenyesuaianPersediaanByUUID)
router.delete("/:uuid", authTokenMiddleware(), deletePenyesuaianPersediaanByUUID)

export const getPenyesuaianPersediaanRoute = () => {
    return {
        controller: router,
        prefix: "/penyesuaian_persediaan"
    }
}