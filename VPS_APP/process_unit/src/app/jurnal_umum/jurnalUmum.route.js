import express from "express"
import { deleteJurnalUmumByBuktiTransaksi, deleteJurnalUmumByUUID, getAllJurnalUmumByBulanAndTypeSorting, postCreateJurnalUmum, updateJurnalUmumByUUID } from "./jurnalUmum.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/bulan/:bulan/:tahun/:sorting", authTokenMiddleware(), getAllJurnalUmumByBulanAndTypeSorting)
router.post("/", authTokenMiddleware(), postCreateJurnalUmum)
router.put("/:uuid", authTokenMiddleware(), updateJurnalUmumByUUID)
router.delete("/by_bukti_transaksi", authTokenMiddleware(), deleteJurnalUmumByBuktiTransaksi)
router.delete("/:uuid", authTokenMiddleware(), deleteJurnalUmumByUUID)

export const getJurnalUmumRoute = () => {
    return {
        controller: router,
        prefix: "/jurnal_umum"
    }
}