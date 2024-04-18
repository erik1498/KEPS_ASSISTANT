import jwt from "jsonwebtoken"
import { getEnv } from "../utils/envUtils.js";
import { decryptString } from "../utils/encryptUtil.js";

export const authTokenMiddleware = (roles) => {
    return (req, res, next) => {
        try {
            // if (!req.header("User-Permission")) {
            //     throw Error(JSON.stringify({
            //         message: "Akun Tidak Terdaftar",
            //         field: "password"
            //     }))
            // }

            // if (req.header("User-Parameters")) {
            //     let userParameter = JSON.parse(decryptString(req.header("User-Parameters"), getEnv("USER_PARAMETER_KEY")))

            //     if (userParameter.payload != JSON.stringify(req.body)) {
            //         throw Error(JSON.stringify({
            //             message: "Akun Tidak Terdaftar",
            //             field: "password"
            //         }))
            //     }
            // }

            let decode = jwt.verify(decryptString(req.header("Authorization").split("Bearer ")[1], getEnv("JWT_ENCRYPT_KEY")), getEnv("JWT_SECRET"))

            // let reqKey = decryptString(req.header("User-Permission"), decode.userKey)

            // if (reqKey != getEnv("LICENSE_KEY")) {
            //     throw Error(JSON.stringify({
            //         message: "Akun Tidak Terdaftar",
            //         type: "unauthorizedError"
            //     }))
            // }

            let uuid = JSON.parse(req.identity).id
            req.identity = JSON.stringify({
                "id": uuid,
                "userId": decode.userId
            })
            next();
        } catch (e) {
            res.status(401).json({
                type: "unauthorizedError",
                message: new Error('Invalid request!')
            });
        }
    }
}