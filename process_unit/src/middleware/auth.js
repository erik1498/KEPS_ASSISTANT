import jwt from "jsonwebtoken"
import { getEnv } from "../utils/envUtils.js";

export const authTokenMiddleware = (roles) => {
    return (req, res, next) => {
        try {
            let decode = jwt.verify(req.header("Authorization").split("Bearer ")[1], getEnv("JWT_SECRET"))
            let uuid = JSON.parse(req.identity).id
            req.identity = JSON.stringify({
                "id" : uuid,
                "userId": decode.userId
            })
            next();
        } catch {
            res.status(401).json({
                type: "unauthorizedError",
                message: new Error('Invalid request!')
            });
        }
    }
}