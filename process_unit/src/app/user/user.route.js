import express from "express"
import { loginUser, refreshToken } from "./user.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.post("/login", loginUser)
router.post("/refresh", authTokenMiddleware(), refreshToken)

export const getUserRoute = () => {
    return {
        controller: router,
        prefix: "/user"
    }
}