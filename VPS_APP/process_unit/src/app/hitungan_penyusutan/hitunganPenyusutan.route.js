import express from "express"
import { deleteHitunganPenyusutanByUUID, getHitunganPenyusutanByUUID, getJurnalHitunganPenyusutan, postCreateHitunganPenyusutan } from "./hitunganPenyusutan.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/jurnal/:bulan/:tahun", authTokenMiddleware(), getJurnalHitunganPenyusutan)
router.get("/:uuid", authTokenMiddleware(), getHitunganPenyusutanByUUID)
router.post("/", authTokenMiddleware(), postCreateHitunganPenyusutan)
router.delete("/:uuid", authTokenMiddleware(), deleteHitunganPenyusutanByUUID)

export const getHitunganPenyusutanRoute = () => {
    return {
        controller: router,
        prefix: "/hitungan_penyusutan"
    }
}