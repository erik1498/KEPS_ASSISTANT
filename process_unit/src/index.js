import express from 'express'
import cors from "cors"
import { routerList } from './routes/route.js'
import { LOGGER, logType } from './utils/loggerUtil.js'
import { v4 } from 'uuid'
import db, { waitForDBConnection } from './config/Database.js'
import { getEnv } from './utils/envUtils.js'

const app = express()


app.use(express.json())
app.use(cors({
    credentials: true,
    origin: `http://${getEnv("CLIENT_HOST")}:${getEnv("CLIENT_PORT")}`
}, (e) => {
    console.log(e)
}))


const PORT = getEnv("PORT")
await waitForDBConnection()

db.sync()

app.use((req, res, next) => {
    let genUUID = v4()
    req.identity = JSON.stringify({
        "id": genUUID,
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