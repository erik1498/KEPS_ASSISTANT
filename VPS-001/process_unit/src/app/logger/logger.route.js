import express from "express"
import { backupLogger } from "./logger.handler.js"

const router = express.Router()

router.get("/backup", backupLogger)

export const getLoggerRoute = () => {
    return {
        controller: router,
        prefix: "/logger"
    }
}