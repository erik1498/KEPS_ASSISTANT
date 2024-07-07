import express from "express"

const router = express.Router()

export const getLoggerRoute = () => {
    return {
        controller: router,
        prefix: "/logger"
    }
}