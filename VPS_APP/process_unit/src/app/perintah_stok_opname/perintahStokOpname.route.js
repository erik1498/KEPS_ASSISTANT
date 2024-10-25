import express from "express"
import { deletePerintahStokOpnameByUUID, getAllPerintahStokOpnames, getPerintahStokOpnameByUUID, postCreatePerintahStokOpname, updatePerintahStokOpnameByUUID } from "./perintahStokOpname.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/", authTokenMiddleware(), getAllPerintahStokOpnames)
router.get("/:uuid", authTokenMiddleware(), getPerintahStokOpnameByUUID)
router.post("/", authTokenMiddleware(), postCreatePerintahStokOpname)
router.put("/:uuid", authTokenMiddleware(), updatePerintahStokOpnameByUUID)
router.delete("/:uuid", authTokenMiddleware(), deletePerintahStokOpnameByUUID)

export const getPerintahStokOpnameRoute = () => {
    return {
        controller: router,
        prefix: "/perintah_stok_opname"
    }
}