import jwt from "jsonwebtoken"
import { getEnv } from "./envUtils.js"

export const getExpiredTimeFromToken = (tokenString) => {
    return jwt.decode(tokenString, getEnv("JWT_SECRET")).exp
}