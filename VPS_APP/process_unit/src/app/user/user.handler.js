import { getEnv } from "../../utils/envUtils.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { createUserService, getUserByUsername, getUserByUuid } from "./user.services.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { userValidation } from "./user.validation.js"
import { getExpiredTimeFromToken } from "../../utils/jwtUtils.js"
import { decryptString, encryptString } from "../../utils/encryptUtil.js"

export const loginUser = async (req, res) => {
    LOGGER(logType.INFO, "Start loginUser", { username: req.body.username }, req.identity)
    try {
        let { username, password } = req.body

        if (getEnv("USER_PERMISSION_SECURITY_ENABLED") == "true" && !req.header("User-Permission")) {
            LOGGER(logType.ERROR, "User-Permission Is Null", {
                message: "User-Permission Is Null",
            }, req.identity, req.originalUrl, req.method, false)
            throw Error(JSON.stringify({
                message: "Akun Tidak Terdaftar",
                prop: "password"
            }))
        }

        let userParameter;

        if (getEnv("USER_PARAMETER_SECURITY_ENABLED") == "true") {
            userParameter = JSON.parse(decryptString(req.header("User-Parameters"), getEnv("USER_PARAMETER_KEY")))
            if (userParameter.payload != JSON.stringify(req.body)) {
                LOGGER(logType.ERROR, "User-Parameters Tidak Sesuai", {
                    parameterPayload: userParameter.payload,
                    body: JSON.stringify(req.body)
                }, req.identity, req.originalUrl, req.method, false)
                throw Error(JSON.stringify({
                    message: "Akun Tidak Terdaftar",
                    prop: "password"
                }))
            }
        }

        let reqJSON = JSON.parse(req.identity)

        req.identity = JSON.stringify({
            "id": reqJSON.uuid,
            "userId": reqJSON.userId,
            "clientId": reqJSON.clientId
        })

        let user = await getUserByUsername(username, req.identity)

        if (getEnv("USER_PARAMETER_SECURITY_ENABLED") == "true" && userParameter.macAddr != user.mac_address) {
            LOGGER(logType.ERROR, "Mac Address Tidak Sesuai", {
                userReqMacAddr: userParameter.macAddr,
                userRealMacAddr: user.mac_address
            }, req.identity, req.originalUrl, req.method, false)
            throw Error(JSON.stringify({
                message: "Akun Tidak Terdaftar",
                prop: "password"
            }))
        }

        if (getEnv("USER_PARAMETER_SECURITY_ENABLED") == "true" && JSON.stringify(userParameter.osInfo) != user.os_info) {
            LOGGER(logType.ERROR, "User OS Info Tidak Sesuai", {
                osInfoUser: JSON.stringify(userParameter.osInfo),
                osInfoReal: user.os_info
            }, req.identity, req.originalUrl, req.method, false)
            throw Error(JSON.stringify({
                message: "Akun Tidak Terdaftar",
                prop: "password"
            }))
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            LOGGER(logType.ERROR, "Password Tidak Sesuai", null, req.identity, req.originalUrl, req.method, false)
            throw Error(JSON.stringify({
                message: "Akun Tidak Terdaftar",
                prop: "password"
            }))
        }

        if (getEnv("USER_PERMISSION_SECURITY_ENABLED") == "true") {
            const reqKey = decryptString(req.header("User-Permission"), user.serial_key)
            if (reqKey != getEnv("LICENSE_KEY")) {
                LOGGER(logType.ERROR, "User-Permission Tidak Sesuai Dengan Licence Key", null, req.identity, req.originalUrl, req.method, false)
                throw Error(JSON.stringify({
                    message: "Akun Tidak Terdaftar",
                    prop: "password"
                }))
            }
        }

        const token = jwt.sign({
            userId: user.uuid,
            userKey: user.serial_key,
            userJumlahEntryData: user.jumlah_entry_data,
            userBatasEntryData: user.batas_entry_data,
            userEndDateAkses: user.end_date_akses,
            macAddr: user.mac_address
        }, getEnv("JWT_SECRET"), {
            expiresIn: '30s',
        });

        const refreshToken = jwt.sign({
            userId: user.uuid,
            userKey: user.serial_key,
        }, getEnv("REFRESH_SECRET"), {
            expiresIn: '1w'
        });

        const tokenExpired = getExpiredTimeFromToken(token)

        const tokenEncrypt = encryptString(token, getEnv("JWT_ENCRYPT_KEY"))
        const refreshTokenEncrypt = encryptString(refreshToken, getEnv("REFRESH_ENCRYPT_KEY"))

        LOGGER_MONITOR(req.originalUrl, req.method, user, req.identity, false)

        res.status(200).json({
            token: tokenEncrypt,
            refreshToken: refreshTokenEncrypt,
            role: user.role,
            name: user.name,
            perusahaan: user.perusahaan,
            demo_permission: getEnv("DEMO_TYPE"),
            tokenExpired
        });
    } catch (error) {
        LOGGER(logType.ERROR, "Error ", error.stack, JSON.stringify({
            "id": "NULL",
            "userId": "NULL"
        }), req.originalUrl, req.method, false)
        res.status(401).json({
            type: "validationError",
            message: [JSON.parse(error.message)]
        })
    }
}



export const postCreateUser = async (req, res) => {
    LOGGER(logType.INFO, "Start postCreateUser", req.body, req.identity)
    try {
        const userData = req.body
        const { error, value } = userValidation(userData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }

        const hashedPassword = await bcrypt.hash(value.password, 10);
        value.password = hashedPassword

        const user = await createUserService(value, req.identity)
        res.json({
            data: user,
            message: "Create data Success"
        })
    } catch (error) {
        LOGGER(logType.ERROR, "Error ", error.stack, req.identity, req.originalUrl, req.method, true)
        res.status(401).json({
            type: "unauthorizedError",
            message: new Error('Invalid request!')
        });
    }
}

export const refreshToken = async (req, res) => {
    try {
        let user = await getUserByUuid({
            uuid: req.body.userId
        }, req.identity)

        const token = jwt.sign({
            userId: user.uuid,
            userKey: user.serial_key,
            userJumlahEntryData: user.jumlah_entry_data,
            userBatasEntryData: user.batas_entry_data,
            userEndDateAkses: user.end_date_akses,
            macAddr: user.mac_address
        }, getEnv("JWT_SECRET"), {
            expiresIn: '30s',
        });

        const refreshToken = jwt.sign({
            userId: user.uuid,
            userKey: user.serial_key
        }, getEnv("REFRESH_SECRET"), {
            expiresIn: '1w'
        });

        const tokenExpired = getExpiredTimeFromToken(token)

        const tokenEncrypt = encryptString(token, getEnv("JWT_ENCRYPT_KEY"))
        const refreshTokenEncrypt = encryptString(refreshToken, getEnv("REFRESH_ENCRYPT_KEY"))

        res.status(200).json({
            token: tokenEncrypt,
            refreshToken: refreshTokenEncrypt,
            role: user.role,
            name: user.name,
            perusahaan: user.perusahaan,
            demo_permission: getEnv("DEMO_TYPE"),
            tokenExpired
        })
    } catch (error) {
        LOGGER(logType.ERROR, "Error ", error.stack, req.identity, req.originalUrl, req.method, true)
        res.status(401).json({
            type: "validationError",
            message: [error.message]
        })
    }
}