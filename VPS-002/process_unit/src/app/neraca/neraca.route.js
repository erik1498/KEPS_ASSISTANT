import express from "express"
import { checkValidasiNeracaController, deleteValidasiNeracaByBulanAndTahunController, getAllNeracaByBulanController, validasiNeracaController } from "./neraca.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/:bulan/:tahun", authTokenMiddleware(), getAllNeracaByBulanController)
router.get("/validasi_status/:bulan/:tahun", authTokenMiddleware(), checkValidasiNeracaController)
router.post("/validasi", authTokenMiddleware(), validasiNeracaController)
router.delete("/validasi", authTokenMiddleware(), deleteValidasiNeracaByBulanAndTahunController)

export const getNeracaRoute = () => {
    return {
        controller: router,
        prefix: "/neraca"
    }
}