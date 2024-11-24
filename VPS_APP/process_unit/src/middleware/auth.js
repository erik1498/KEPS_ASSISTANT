import jwt from "jsonwebtoken"
import { getEnv } from "../utils/envUtils.js";
import { decryptString } from "../utils/encryptUtil.js";
import { LOGGER, logType } from "../utils/loggerUtil.js";
import { allowedMethod } from "../constant/demoConstant.js";
import { incrementJumlahUserEntryDataService } from "../app/user/user.services.js";
import { getDateTimeNow } from "../utils/dateUtil.js";

export const authTokenMiddleware = (roles = []) => {
    return (req, res, next) => {
        if (getEnv("USER_PERMISSION_SECURITY_ENABLED") == "true" && !req.header("User-Permission")) {
            LOGGER(logType.ERROR, "User-Permission Is Null", {
                message: "User-Permission Is Null"
            }, req.identity, req.originalUrl, req.method, false)
            return res.status(401).json({
                type: "unauthorizedError",
                errorData: JSON.stringify({
                    message: "Akun Tidak Terdaftar",
                    prop: "error",
                    redirect_to_login: true,
                })
            });
        }

        let userParameter;

        if (getEnv("USER_PARAMETER_SECURITY_ENABLED") == "true") {
            userParameter = JSON.parse(decryptString(req.header("User-Parameters"), getEnv("USER_PARAMETER_KEY")))

            if (Object.keys(req.body).length > 0) {
                if (userParameter.payload != JSON.stringify(req.body)) {
                    LOGGER(logType.ERROR, "User-Parameters Tidak Sesuai", {
                        parameterPayload: userParameter.payload,
                        body: JSON.stringify(req.body)
                    }, req.identity, req.originalUrl, req.method, false)
                    return res.status(401).json({
                        type: "unauthorizedError",
                        errorData: JSON.stringify({
                            message: "Akun Tidak Terdaftar",
                            prop: "error",
                            redirect_to_login: true,
                        })
                    });
                }
            }
        }

        jwt.verify(decryptString(req.header("Authorization").split("Bearer ")[1], getEnv("JWT_ENCRYPT_KEY")), getEnv("JWT_SECRET"), async (err, decode) => {
            if (err) {
                LOGGER(logType.ERROR, "JWT Authorization Error", err.stack, req.identity, req.originalUrl, req.method, false)
                return res.status(401).json({
                    type: "unauthorizedError",
                    errorData: JSON.stringify({
                        message: "Akun Tidak Terdaftar",
                        prop: "error",
                    })
                });
            }

            if (roles.length > 0) {
                if (
                    roles
                        .filter(x => {
                            return JSON.parse(decode.userRole).indexOf(x) > -1
                        }).length == 0
                ) {
                    return res.status(401).json({
                        type: "unauthorizedError",
                        errorData: JSON.stringify({
                            message: "Akun Tidak Diizinkan",
                            prop: "error",
                            redirect_to_login: true,
                        })
                    });
                }
            }

            if (getEnv("USER_PARAMETER_SECURITY_ENABLED") == "true" && userParameter.macAddr != decode.macAddr) {
                LOGGER(logType.ERROR, "Mac Address Tidak Sesuai", {
                    userReqMacAddr: userParameter.macAddr,
                    userRealMacAddr: decode.macAddr
                }, req.identity, req.originalUrl, req.method, false)
                return res.status(401).json({
                    type: "unauthorizedError",
                    errorData: JSON.stringify({
                        message: "Akun Tidak Terdaftar",
                        prop: "error",
                        redirect_to_login: true,
                    })
                });
            }

            if (getEnv("USER_PERMISSION_SECURITY_ENABLED") == "true") {
                let reqKey = decryptString(req.header("User-Permission"), decode.userKey)
                if (reqKey != getEnv("LICENSE_KEY")) {
                    LOGGER(logType.ERROR, "User-Permission Tidak Sesuai Dengan Licence Key", null, req.identity, req.originalUrl, req.method, false)
                    return res.status(401).json({
                        type: "unauthorizedError",
                        errorData: JSON.stringify({
                            message: "Akun Tidak Terdaftar",
                            prop: "error",
                            redirect_to_login: true,
                        })
                    });
                }
            }

            let uuid = JSON.parse(req.identity).id
            req.identity = JSON.stringify({
                "id": uuid,
                "userId": decode.userId,
                "client_id": decode.userClientId,
                "user_request": userParameter?.osInfo
            })

            if (getEnv("DEMO_TYPE") == "true" && decode.userEndDateAkses != "UNLIMITED") {
                if (allowedMethod.includes(req.method)) {
                    if (parseFloat(decode.userJumlahEntryData) <= parseFloat(decode.userBatasEntryData)) {
                        if (req.method == "POST") {
                            await incrementJumlahUserEntryDataService(decode, req.identity)
                        }
                        if (getDateTimeNow(false) > decode.userEndDateAkses) {
                            return res.status(500).json({
                                type: "internalServerError",
                                errorData: JSON.stringify({
                                    message: `Anda Telah Mencapai Batas Waktu Akses`,
                                    prop: "error",
                                    redirect_to_login: true
                                })
                            })
                        }
                    } else {
                        return res.status(500).json({
                            type: "internalServerError",
                            errorData: JSON.stringify({
                                message: `Anda Telah Mencapai Batas Maksimum Entry Data ( ${decode.userBatasEntryData} Data )`,
                                prop: "error"
                            })
                        })
                    }
                } else {
                    return res.status(500).json({
                        type: "internalServerError",
                        errorData: JSON.stringify({
                            message: "Perinah Anda Ditolak",
                            prop: "error"
                        })
                    })
                }
            }
            next();
        })
    }
}

// Fungsi middleware atau handler untuk verifikasi JWT
export const verifyRefreshToken = (req, res, next) => {

    if (getEnv("USER_PERMISSION_SECURITY_ENABLED") == "true" && !req.header("User-Permission")) {
        LOGGER(logType.ERROR, "User-Permission Is Null", null, req.identity, req.originalUrl, req.method, false)
        return res.status(401).json({
            type: "unauthorizedError",
            errorData: JSON.stringify({
                message: "Akun Tidak Terdaftar",
                prop: "error",
                redirect_to_login: true,
            })
        });
    }

    let userParameter;

    if (getEnv("USER_PARAMETER_SECURITY_ENABLED") == "true") {
        userParameter = JSON.parse(decryptString(req.header("User-Parameters"), getEnv("USER_PARAMETER_KEY")))

        if (Object.keys(req.body).length > 0) {
            if (userParameter.payload != JSON.stringify(req.body)) {
                LOGGER(logType.ERROR, "User-Parameters Tidak Sesuai", {
                    parameterPayload: userParameter.payload,
                    body: JSON.stringify(req.body)
                }, req.identity, req.originalUrl, req.method, false)
                return res.status(401).json({
                    type: "unauthorizedError",
                    errorData: JSON.stringify({
                        message: "Akun Tidak Terdaftar",
                        prop: "error",
                        redirect_to_login: true,
                    })
                });
            }
        }
    }

    // Lakukan verifikasi token
    jwt.verify(decryptString(req.body.refreshToken, getEnv("REFRESH_ENCRYPT_KEY")), getEnv("REFRESH_SECRET"), async (err, decode) => {
        if (err) {
            LOGGER(logType.ERROR, "Refresh Token Tidak Sesuai", null, req.identity, req.originalUrl, req.method, false)
            return res.status(401).json({
                type: "unauthorizedError",
                errorData: JSON.stringify({
                    message: "Akun Tidak Terdaftar",
                    prop: "error",
                    redirect_to_login: true,
                })
            });
        }

        if (getEnv("USER_PERMISSION_SECURITY_ENABLED") == "true") {
            let reqKey = decryptString(req.header("User-Permission"), decode.userKey)
            if (reqKey != getEnv("LICENSE_KEY")) {
                LOGGER(logType.ERROR, "User-Permission Tidak Sesuai Dengan Licence Key", null, req.identity, req.originalUrl, req.method, false)
                return res.status(401).json({
                    type: "unauthorizedError",
                    errorData: JSON.stringify({
                        message: "Akun Tidak Terdaftar",
                        prop: "error",
                        redirect_to_login: true,
                    })
                });
            }
        }
        // Jika verifikasi berhasil, lanjutkan ke pemrosesan permintaan selanjutnya
        req.body = decode; // Simpan informasi pengguna dari token di objek req
        next(); // Lanjutkan ke pemrosesan permintaan selanjutnya
    });
};