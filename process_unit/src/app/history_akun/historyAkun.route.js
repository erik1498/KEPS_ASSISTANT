import express from "express"
import { getAllHistoryAkunByUUIDAndBulanController } from "./historyAkun.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/:uuid/:bulan/:tahun", authTokenMiddleware(), getAllHistoryAkunByUUIDAndBulanController)

export const getHistoryAkunRoute = () => {
    return {
        controller: router,
        prefix: "/history_akun"
    }
}