import express from "express"
import { loginUser, logoutUser, refreshToken } from "./user.handler.js"
import { authTokenMiddleware, verifyRefreshToken } from "../../middleware/auth.js"

const router = express.Router()

router.post("/login", loginUser)
router.post("/refresh", verifyRefreshToken, refreshToken)
router.post("/logout", authTokenMiddleware(), logoutUser)

export const getUserRoute = () => {
    return {
        controller: router,
        prefix: "/user"
    }
}