import jwt from "jsonwebtoken"
import { getEnv } from "../utils/envUtils.js";
import { decryptString } from "../utils/encryptUtil.js";
import { LOGGER, logType } from "../utils/loggerUtil.js";

export const authTokenMiddleware = (roles) => {
    return (req, res, next) => {
        if (getEnv("USER_PERMISSION_SECURITY_ENABLED") && !req.header("User-Permission")) {
            LOGGER(logType.ERROR, "User-Permission Is Null", {
                message: "User-Permission Is Null"
            }, req.identity, req.originalUrl, req.method, false)
            return res.status(401).json({
                type: "unauthorizedError",
                message: "Akun Tidak Terdaftar"
            });
        }

        let userParameter;

        if (getEnv("USER_PARAMETER_SECURITY_ENABLED")) {
            userParameter = JSON.parse(decryptString(req.header("User-Parameters"), getEnv("USER_PARAMETER_KEY")))

            if (Object.keys(req.body).length > 0) {
                if (userParameter.payload != JSON.stringify(req.body)) {
                    LOGGER(logType.ERROR, "User-Parameters Tidak Sesuai", {
                        parameterPayload: userParameter.payload,
                        body: JSON.stringify(req.body)
                    }, req.identity, req.originalUrl, req.method, false)
                    return res.status(401).json({
                        type: "unauthorizedError",
                        message: "Akun Tidak Terdaftar"
                    });
                }
            }
        }

        jwt.verify(decryptString(req.header("Authorization").split("Bearer ")[1], getEnv("JWT_ENCRYPT_KEY")), getEnv("JWT_SECRET"), (err, decode) => {
            if (err) {
                LOGGER(logType.ERROR, "JWT Authorization Error", err.stack, req.identity, req.originalUrl, req.method, false)
                return res.status(401).json({
                    type: "unauthorizedError",
                    message: "Akun Tidak Terdaftar"
                });
            }

            if (getEnv("USER_PARAMETER_SECURITY_ENABLED") && decryptString(userParameter.macAddr, getEnv("MAC_PARAMETER_KEY")) != decode.macAddr) {
                LOGGER(logType.ERROR, "Mac Address Tidak Sesuai", {
                    userReqMacAddr: decryptString(userParameter.macAddr, getEnv("MAC_PARAMETER_KEY")),
                    userRealMacAddr: decode.macAddr
                }, req.identity, req.originalUrl, req.method, false)
                return res.status(401).json({
                    type: "unauthorizedError",
                    message: "Akun Tidak Terdaftar"
                });
            }

            if (getEnv("USER_PERMISSION_SECURITY_ENABLED")) {
                let reqKey = decryptString(req.header("User-Permission"), decode.userKey)
                if (reqKey != getEnv("LICENSE_KEY")) {
                    LOGGER(logType.ERROR, "User-Permission Tidak Sesuai Dengan Licence Key", null, req.identity, req.originalUrl, req.method, false)
                    return res.status(401).json({
                        type: "unauthorizedError",
                        message: "Akun Tidak Terdaftar"
                    });
                }
            }

            let uuid = JSON.parse(req.identity).id
            req.identity = JSON.stringify({
                "id": uuid,
                "userId": decode.userId,
                "client_id": JSON.parse(req.identity).client_id,
                "user_request": userParameter.osInfo
            })
            next();
        })
    }
}

// Fungsi middleware atau handler untuk verifikasi JWT
export const verifyRefreshToken = (req, res, next) => {

    if (getEnv("USER_PERMISSION_SECURITY_ENABLED") && !req.header("User-Permission")) {
        LOGGER(logType.ERROR, "User-Permission Is Null", null, req.identity, req.originalUrl, req.method, false)
        return res.status(401).json({
            type: "unauthorizedError",
            message: "Akun Tidak Terdaftar"
        });
    }

    let userParameter;

    if (getEnv("USER_PARAMETER_SECURITY_ENABLED")) {
        userParameter = JSON.parse(decryptString(req.header("User-Parameters"), getEnv("USER_PARAMETER_KEY")))

        if (Object.keys(req.body).length > 0) {
            if (userParameter.payload != JSON.stringify(req.body)) {
                LOGGER(logType.ERROR, "User-Parameters Tidak Sesuai", {
                    parameterPayload: userParameter.payload,
                    body: JSON.stringify(req.body)
                }, req.identity, req.originalUrl, req.method, false)
                return res.status(401).json({
                    type: "unauthorizedError",
                    message: "Akun Tidak Terdaftar"
                });
            }
        }
    }

    // Lakukan verifikasi token
    jwt.verify(decryptString(req.body.refreshToken, getEnv("REFRESH_ENCRYPT_KEY")), getEnv("REFRESH_SECRET"), async (err, decoded) => {
        if (err) {
            LOGGER(logType.ERROR, "Refresh Token Tidak Sesuai", null, req.identity, req.originalUrl, req.method, false)
            return res.status(401).json({
                type: "unauthorizedError",
                message: "Akun Tidak Terdaftar"
            });
        }

        if (getEnv("USER_PERMISSION_SECURITY_ENABLED")) {
            let reqKey = decryptString(req.header("User-Permission"), decoded.userKey)
            if (reqKey != getEnv("LICENSE_KEY")) {
                LOGGER(logType.ERROR, "User-Permission Tidak Sesuai Dengan Licence Key", null, req.identity, req.originalUrl, req.method, false)
                return res.status(401).json({
                    type: "unauthorizedError",
                    message: "Akun Tidak Terdaftar"
                });
            }
        }
        // Jika verifikasi berhasil, lanjutkan ke pemrosesan permintaan selanjutnya
        req.body = decoded; // Simpan informasi pengguna dari token di objek req
        next(); // Lanjutkan ke pemrosesan permintaan selanjutnya
    });
};