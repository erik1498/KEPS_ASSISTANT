import express from "express"
import { deleteHasilStokOpnameByUUID, getAllHasilStokOpnames, getHasilStokOpnameByUUID, postCreateHasilStokOpname, updateHasilStokOpnameByUUID } from "./hasilStokOpname.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/", authTokenMiddleware(), getAllHasilStokOpnames)
router.get("/:uuid", authTokenMiddleware(), getHasilStokOpnameByUUID)
router.post("/", authTokenMiddleware(), postCreateHasilStokOpname)
router.put("/:uuid", authTokenMiddleware(), updateHasilStokOpnameByUUID)
router.delete("/:uuid", authTokenMiddleware(), deleteHasilStokOpnameByUUID)

export const getHasilStokOpnameRoute = () => {
    return {
        controller: router,
        prefix: "/hasil_stok_opname"
    }
}