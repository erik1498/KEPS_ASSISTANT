import express from "express"
import { deletePersentasePenyusutanByUUID, getAllPersentasePenyusutans, getPersentasePenyusutanByUUID, postCreatePersentasePenyusutan, updatePersentasePenyusutanByUUID } from "./persentasePenyusutan.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/", authTokenMiddleware(), getAllPersentasePenyusutans)
router.get("/:uuid", authTokenMiddleware(), getPersentasePenyusutanByUUID)
router.post("/", authTokenMiddleware(), postCreatePersentasePenyusutan)
router.put("/:uuid", authTokenMiddleware(), updatePersentasePenyusutanByUUID)
router.delete("/:uuid", authTokenMiddleware(), deletePersentasePenyusutanByUUID)

export const getPersentasePenyusutanRoute = () => {
    return {
        controller: router,
        prefix: "/persentase_penyusutan"
    }
}