import express from "express"
import { getAllNeracaSaldoByBulanController } from "./neracaSaldo.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/:bulan/:tahun", authTokenMiddleware(), getAllNeracaSaldoByBulanController)

export const getNeracaSaldoRoute = () => {
    return {
        controller: router,
        prefix: "/neraca_saldo"
    }
}