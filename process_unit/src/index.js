import express from 'express'
import cors from "cors"
import { routerList } from './routes/route.js'
import { LOGGER, logType } from './utils/loggerUtil.js'
import { v4 } from 'uuid'
import db, { connectDatabase } from './config/Database.js'
import { getEnv } from './utils/envUtils.js'
import { rateLimit } from 'express-rate-limit'
import { Sequelize } from 'sequelize'


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
            callback(new Error('Not allowed by CORS'))
        }
    }
}))

const PORT = getEnv("PORT")

await connectDatabase();

app.use(async (req, res, next) => {
    if (!req.header("Client_id")) {
        return res.status(401).json({
            errorData: JSON.stringify({
                message: "Akun Tidak Terdaftar",
                field: "password"
            })
        })
    }
    let genUUID = v4()
    req.identity = JSON.stringify({
        "id": genUUID,
        "userId": null,
        "client_id": req.header("Client_id")
    })
    res.setHeader("request-id", genUUID)
    res.setHeader("X-Powered-By", "KEPS-ASSISTANT")

    let databaseConnectInCorrect = true
    do {
        await db.query(
            `USE db_keps_assistant_${req.header("Client_id")}`
            ,
            { type: Sequelize.QueryTypes.RAW }
        );

        const [results] = await db.query('SELECT DATABASE()', { type: Sequelize.QueryTypes.SELECT });

        LOGGER(logType.INFO, "DATABASE USE CHECK", {
            dbConnect: results["DATABASE()"],
            dbExpectation: `db_keps_assistant_${req.header("Client_id")}`,
            checkResult: results["DATABASE()"] == `db_keps_assistant_${req.header("Client_id")}` && results["DATABASE()"] != null
        })
        LOGGER(logType.INFO, "RECONNECT DATABASE")

        console.log("CONSOLE DATABASES USE ", results["DATABASE()"], `db_keps_assistant_${req.header("Client_id")}`, results["DATABASE()"] == `db_keps_assistant_${req.header("Client_id")}`)

        if (results["DATABASE()"] == `db_keps_assistant_${req.header("Client_id")}` && results["DATABASE()"] != null) {
            databaseConnectInCorrect = false;
            next();
        }
    } while (databaseConnectInCorrect)
})

routerList.map(route => {
    app.use(route.prefix, route.controller)
})

app.listen(PORT, () => {
    LOGGER(logType.INFO, "USER_PERMISSION_SECURITY_ENABLED", getEnv("USER_PERMISSION_SECURITY_ENABLED"))
    LOGGER(logType.INFO, "USER_PARAMETER_SECURITY_ENABLED", getEnv("USER_PARAMETER_SECURITY_ENABLED"))
    LOGGER(logType.INFO, "KEPS AKUTANSI API RUNNING ON " + PORT)
})