import express from 'express'
import cors from "cors"
import { routerList } from './routes/route.js'
import { LOGGER, logType } from './utils/loggerUtil.js'
import { v4 } from 'uuid'
import { connectDatabase } from './config/Database.js'
import { getEnv } from './utils/envUtils.js'
import { rateLimit } from 'express-rate-limit'

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 15000, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    // store: ... , // Redis, Memcached, etc. See below.
})

const app = express()
app.use(limiter)
app.use(express.json())

const whitelist = JSON.parse(getEnv("CLIENT_HOST"))

LOGGER(logType.INFO, "ALLOWED CLIENT", whitelist);

app.use(cors({
    credentials: true,
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error(`${origin} Not allowed by CORS`))
        }
    }
}))

const PORT = getEnv("PORT")

await connectDatabase();

app.use((req, res, next) => {
    try {
        if (!req.header("Client_id")) {
            throw Error(JSON.stringify({
                message: "Akun Tidak Terdaftar",
                prop: "password"
            }))
        }
        let genUUID = v4()
        req.identity = JSON.stringify({
            "id": genUUID,
            "userId": null,
            "client_id": req.header("Client_id")
        })
        res.setHeader("request-id", genUUID);
        next();
    } catch (error) {
        return res.status(401).json({
            type: "validationError",
            message: [JSON.parse(error.message)]
        })
    }
})

app.disable("x-powered-by")

routerList.map(route => {
    app.use(route.prefix, route.controller)
})

app.listen(PORT, () => {
    LOGGER(logType.INFO, "USER_PERMISSION_SECURITY_ENABLED", getEnv("USER_PERMISSION_SECURITY_ENABLED"))
    LOGGER(logType.INFO, "USER_PARAMETER_SECURITY_ENABLED", getEnv("USER_PARAMETER_SECURITY_ENABLED"))
    LOGGER(logType.INFO, "KEPS AKUTANSI API RUNNING ON " + PORT)
})