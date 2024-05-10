import { getEnv } from "../../utils/envUtils.js"
import { LOGGER, logType } from "../../utils/loggerUtil.js"
import { createUserService, getUserByUsername, getUserByUuid, updateUserActiveService } from "./user.services.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { userValidation } from "./user.validation.js"
import { getExpiredTimeFromToken } from "../../utils/jwtUtils.js"
import { decryptString, encryptString } from "../../utils/encryptUtil.js"

export const loginUser = async (req, res) => {
    LOGGER(logType.INFO, "Start loginUser", req.body, req.identity)
    try {
        let { username, password } = req.body

        // if (!req.header("User-Permission") && !req.header("User-Parameters")) {
        //     throw Error(JSON.stringify({
        //         message: "Akun Tidak Terdaftar",
        //         field: "password"
        //     }))
        // }

        // let userParameter = JSON.parse(decryptString(req.header("User-Parameters"), getEnv("USER_PARAMETER_KEY")))

        // if (userParameter.payload != JSON.stringify(req.body)) {
        //     throw Error(JSON.stringify({
        //         message: "Akun Tidak Terdaftar",
        //         field: "password"
        //     }))
        // }

        let user = await getUserByUsername(username, false, req.identity)

        // if (decryptString(userParameter.macAddr, getEnv("MAC_PARAMETER_KEY")) != user.mac_address) {
        //     throw Error(JSON.stringify({
        //         message: "Akun Tidak Terdaftar",
        //         field: "password"
        //     }))
        // }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            throw Error(JSON.stringify({
                message: "Akun Tidak Terdaftar",
                field: "password"
            }))
        }

        // const reqKey = decryptString(req.header("User-Permission"), user.serial_key)

        // if (reqKey != getEnv("LICENSE_KEY")) {
        //     throw Error(JSON.stringify({
        //         message: "Akun Tidak Terdaftar",
        //         field: "password"
        //     }))
        // }

        await updateUserActiveService(user.uuid, true, req.identity)

        const token = jwt.sign({
            userId: user.uuid,
            userRole: user.role,
            userKey: user.serial_key,
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
            tokenExpired
        });
    } catch (error) {
        LOGGER(logType.ERROR, "Error ", error.stack, JSON.stringify({
            "id": "NULL",
            "userId": "NULL"
        }), req.originalUrl, req.method, false)
        res.status(401).json({
            message: error.message
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
            userRole: user.role,
            userKey: user.serial_key,
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
            tokenExpired
        })
    } catch (error) {
        LOGGER(logType.ERROR, "Error ", error.stack, req.identity, req.originalUrl, req.method, true)
        res.status(401).json({
            type: "unauthorizedError",
            message: new Error('Invalid request!')
        });
    }
}


export const logoutUser = async (req, res) => {
    try {
        let user = await getUserByUuid({ uuid: JSON.parse(req.identity).userId }, req.identity)

        if (!user) {
            throw Error(JSON.stringify({
                message: "User Not Found",
                field: "error"
            }))
        }

        user = await getUserByUsername(user.username, true, req.identity)

        if (!user) {
            throw Error(JSON.stringify({
                message: "User Not Found",
                field: "error"
            }))
        }

        await updateUserActiveService(user.uuid, false, req.identity)
        res.status(200).json({
            message: "Logout Success"
        })
    } catch (error) {
        LOGGER(logType.ERROR, "Error ", error.stack, req.identity, req.originalUrl, req.method, true)
        res.status(401).json({
            type: "unauthorizedError",
            message: new Error('Invalid request!')
        });
    }
}