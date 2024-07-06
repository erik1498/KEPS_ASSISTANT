import express from "express"
import { getAllLabaRugiByBulanController } from "./labaRugi.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/:bulan/:tahun", authTokenMiddleware(), getAllLabaRugiByBulanController)

export const getLabaRugiRoute = () => {
    return {
        controller: router,
        prefix: "/laba_rugi"
    }
}