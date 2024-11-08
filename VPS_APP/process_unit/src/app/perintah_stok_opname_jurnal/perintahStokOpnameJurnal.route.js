import express from "express"
import { deletePerintahStokOpnameJurnalByUUID, getAllPerintahStokOpnameJurnals, getPerintahStokOpnameJurnalByUUID, postCreatePerintahStokOpnameJurnal, updatePerintahStokOpnameJurnalByUUID } from "./perintahStokOpnameJurnal.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/", authTokenMiddleware(), getAllPerintahStokOpnameJurnals)
router.get("/:uuid", authTokenMiddleware(), getPerintahStokOpnameJurnalByUUID)
router.post("/", authTokenMiddleware(), postCreatePerintahStokOpnameJurnal)
router.put("/:uuid", authTokenMiddleware(), updatePerintahStokOpnameJurnalByUUID)
router.delete("/:uuid", authTokenMiddleware(), deletePerintahStokOpnameJurnalByUUID)

export const getPerintahStokOpnameJurnalRoute = () => {
    return {
        controller: router,
        prefix: "/perintah_stok_opname_jurnal"
    }
}