import express from 'express'
import cors from "cors"
import { routerList } from './routes/route.js'
import { LOGGER, logType } from './utils/loggerUtil.js'
import { v4 } from 'uuid'
import { connectDatabase } from './config/Database.js'
import { getEnv } from './utils/envUtils.js'
import { rateLimit } from 'express-rate-limit'
import path from 'path';
import { fileURLToPath } from 'url';

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 15000, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    // store: ... , // Redis, Memcached, etc. See below.
})

if (getEnv("USE_INTERACTION") == "true") {

    // Utilitas untuk mendapatkan __dirname
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const interaction = express()

    interaction.listen(5173, () => {
        LOGGER(logType.INFO, "INTERACTION RUNNING ON 5173")
    })

    // Sajikan file build React
    interaction.use(express.static(path.join(__dirname, '../../interaction_unit/build')));

    interaction.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../../interaction_unit/build', 'index.html'));
    });
}

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
            callback("Not Allowed by CORS")
        }
    }
}))

const PORT = getEnv("PORT")

await connectDatabase();

app.use((req, res, next) => {
    try {
        // if (!req.header("Client_id")) {
        //     throw Error(JSON.stringify({
        //         message: "Akun Tidak Terdaftar",
        //         prop: "password"
        //     }))
        // }
        let genUUID = v4()
        req.identity = JSON.stringify({
            "id": genUUID,
            "userId": null,
            // "client_id": req.header("Client_id")
            "client_id": "alor"
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
    LOGGER(logType.INFO, "DEMO_TYPE", getEnv("DEMO_TYPE"))
    LOGGER(logType.INFO, "KEPS AKUTANSI API RUNNING ON " + PORT)
})