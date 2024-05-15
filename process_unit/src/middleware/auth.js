import jwt from "jsonwebtoken"
import { getEnv } from "../utils/envUtils.js";
import { decryptString } from "../utils/encryptUtil.js";

export const authTokenMiddleware = (roles) => {
    return (req, res, next) => {
        console.log("AUTH TOKEN MIDDLEWARE")
        if (!req.header("User-Permission")) {
            console.log("User-Permission Error")
            return res.status(401).json({
                type: "unauthorizedError",
                message: "Akun Tidak Terdaftar"
            });
        }
        let userParameter = JSON.parse(decryptString(req.header("User-Parameters"), getEnv("USER_PARAMETER_KEY")))

        if (Object.keys(req.body).length > 0) {
            if (userParameter.payload != JSON.stringify(req.body)) {
                console.log("User-Parameters Error")
                return res.status(401).json({
                    type: "unauthorizedError",
                    message: "Akun Tidak Terdaftar"
                });
            }
        }

        jwt.verify(decryptString(req.header("Authorization").split("Bearer ")[1], getEnv("JWT_ENCRYPT_KEY")), getEnv("JWT_SECRET"), (err, decode) => {
            if (err) {
                console.log("Token Verify Error")
                return res.status(401).json({
                    type: "unauthorizedError",
                    message: "Akun Tidak Terdaftar"
                });
            }

            if (decryptString(userParameter.macAddr, getEnv("MAC_PARAMETER_KEY")) != decode.macAddr) {
                return res.status(401).json({
                    type: "unauthorizedError",
                    message: "Akun Tidak Terdaftar"
                });
            }

            let reqKey = decryptString(req.header("User-Permission"), decode.userKey)

            if (reqKey != getEnv("LICENSE_KEY")) {
                return res.status(401).json({
                    type: "unauthorizedError",
                    message: "Akun Tidak Terdaftar"
                });
            }

            let uuid = JSON.parse(req.identity).id
            req.identity = JSON.stringify({
                "id": uuid,
                "userId": decode.userId,
                "client_id": JSON.parse(req.identity).client_id
            })
            next();
        })
    }
}

// Fungsi middleware atau handler untuk verifikasi JWT
export const verifyRefreshToken = (req, res, next) => {

    if (!req.header("User-Permission")) {
        return res.status(401).json({
            type: "unauthorizedError",
            message: "Akun Tidak Terdaftar"
        });
    }

    if (req.header("User-Parameters")) {
        let userParameter = JSON.parse(decryptString(req.header("User-Parameters"), getEnv("USER_PARAMETER_KEY")))

        if (userParameter.payload != JSON.stringify(req.body)) {
            return res.status(401).json({
                type: "unauthorizedError",
                message: "Akun Tidak Terdaftar"
            });
        }
    }

    let decode = jwt.decode(decryptString(req.body.refreshToken, getEnv("REFRESH_ENCRYPT_KEY")), getEnv("REFRESH_SECRET"))

    let reqKey = decryptString(req.header("User-Permission"), decode.userKey)

    if (reqKey != getEnv("LICENSE_KEY")) {
        return res.status(401).json({
            type: "unauthorizedError",
            message: "Akun Tidak Terdaftar"
        });
    }

    // Lakukan verifikasi token
    jwt.verify(decryptString(req.body.refreshToken, getEnv("REFRESH_ENCRYPT_KEY")), getEnv("REFRESH_SECRET"), async (err, decoded) => {
        if (err) {
            // Jika terjadi kesalahan verifikasi, berikan respons ke klien
            return res.status(401).json({
                type: "unauthorizedError",
                message: "Akun Tidak Terdaftar"
            });
        }
        // Jika verifikasi berhasil, lanjutkan ke pemrosesan permintaan selanjutnya
        req.body = decoded; // Simpan informasi pengguna dari token di objek req
        next(); // Lanjutkan ke pemrosesan permintaan selanjutnya
    });
};