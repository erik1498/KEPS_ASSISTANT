import { getEnv } from "../../utils/envUtils.js"
import { LOGGER, logType } from "../../utils/loggerUtil.js"
import { createUserService, getUserByUsername, getUserByUuid } from "./user.services.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { userValidation } from "./user.validation.js"
import { getExpiredTimeFromToken } from "../../utils/jwtUtils.js"

export const loginUser = async (req, res) => {
    LOGGER(logType.INFO, "Start loginUser", req.body, req.id)
    try {
        let { username, password } = req.body

        let user = await getUserByUsername({
            username
        }, req.id)

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            throw Error(JSON.stringify({
                message: "Akun Tidak Terdaftar",
                field: "username"
            }))
        }

        const token = jwt.sign({
            userId: user.uuid,
            userRole: user.role
        }, getEnv("JWT_SECRET"), {
            expiresIn: '1h',
        });

        const refreshToken = jwt.sign({
            userId: user.uuid
        }, getEnv("REFRESH_SECRET"), {
            expiresIn: '1d'
        });

        const tokenExpired = getExpiredTimeFromToken(token)

        res.status(200).json({
            token,
            refreshToken,
            tokenExpired
        });
    } catch (error) {
        LOGGER(logType.ERROR, "Error ", error.stack)
        res.status(401).json({
            message: error.message
        })
    }
}



export const postCreateUser = async (req, res) => {
    LOGGER(logType.INFO, "Start postCreateUser", req.body, req.id)
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

        const user = await createUserService(value, req.id)
        res.json({
            data: user,
            message: "Create data Success"
        })
    } catch (error) {
        LOGGER(logType.ERROR, "Error ", error.stack)
        res.status(500).json({
            type: "internalServerError",
            message: error.message
        })
    }
}

export const refreshToken = async (req, res) => {
    try {
        let decode = jwt.decode(req.body.refreshToken, getEnv("JWT_SECRET"))
        let user = await getUserByUuid({
            uuid: decode.userId
        }, req.id)

        const token = jwt.sign({
            userId: user.uuid,
            userRole: user.role
        }, getEnv("JWT_SECRET"), {
            expiresIn: '1h',
        });

        const refreshToken = jwt.sign({
            userId: user.uuid
        }, getEnv("REFRESH_SECRET"), {
            expiresIn: '1d'
        });

        const tokenExpired = getExpiredTimeFromToken(token)

        res.status(200).json({
            token,
            refreshToken,
            tokenExpired
        })
    } catch (error) {
        LOGGER(logType.ERROR, "Error ", error.stack)
        res.status(500).json({
            type: "internalServerError",
            message: 'Authentication failed'
        })
    }
}