import express from "express"
import { deletePerintahStokOpnameByUUID, getAllPerintahStokOpnames, getJurnalByPerintahStokOpname, getPerintahStokOpnameByUUID, postCreatePerintahStokOpname, updatePerintahStokOpnameByUUID, validasiPerintahStokOpname } from "./perintahStokOpname.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/", authTokenMiddleware(), getAllPerintahStokOpnames)
router.get("/:uuid", authTokenMiddleware(), getPerintahStokOpnameByUUID)
router.get("/jurnal/:uuid", authTokenMiddleware(), getJurnalByPerintahStokOpname)
router.post("/", authTokenMiddleware(), postCreatePerintahStokOpname)
router.put("/validasi", authTokenMiddleware(), validasiPerintahStokOpname)
router.put("/:uuid", authTokenMiddleware(), updatePerintahStokOpnameByUUID)
router.delete("/:uuid", authTokenMiddleware(), deletePerintahStokOpnameByUUID)

export const getPerintahStokOpnameRoute = () => {
    return {
        controller: router,
        prefix: "/perintah_stok_opname"
    }
}