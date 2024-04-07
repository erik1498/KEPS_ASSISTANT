import express from "express"
import { loginUser, postCreateUser, refreshToken } from "./user.handler.js"

const router = express.Router()

router.post("/login", loginUser)
router.post("/refresh", refreshToken)

export const getUserRoute = () => {
    return {
        controller: router,
        prefix: "/user"
    }
}