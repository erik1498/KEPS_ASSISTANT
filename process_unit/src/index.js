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

app.use((req, res, next) => {
    let genUUID = v4()
    req.identity = JSON.stringify({
        "id": genUUID,
        "userId": null,
        "client_id": req.header("Client_id")
    })
    res.setHeader("request-id", genUUID)
    res.setHeader("X-Powered-By", "KEPS-ASSISTANT")
    next()
})

routerList.map(route => {
    app.use(route.prefix, route.controller)
})

app.listen(PORT, () => {
    LOGGER(logType.INFO, "KEPS AKUTANSI API RUNNING ON " + PORT)
})