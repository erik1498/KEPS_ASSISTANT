import express from 'express'
import cors from "cors"
import { routerList } from './routes/route.js'
import { LOGGER, logType } from './utils/loggerUtil.js'
import { v4 } from 'uuid'
import db from './config/Database.js'
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
app.use(cors({
    credentials: true,
    origin:`${getEnv("CLIENT_HOST")}`
}))

const PORT = getEnv("PORT")

db.sync()

app.use((req, res, next) => {
    let genUUID = v4()
    req.identity = JSON.stringify({
        "id" : genUUID,
        "userId": null
    })
    res.setHeader("request-id", genUUID)
    next()
})

routerList.map(route => {
    app.use(route.prefix, route.controller)
})

app.listen(PORT, () => {
    LOGGER(logType.INFO, "KEPS AKUTANSI API RUNNING ON " + PORT)
})