import express from 'express'
import { getEnv } from './utils/envUtils.js'
import { routerList } from './routes/route.js'


const app = express()
app.use(express.json())

const PORT = getEnv("PORT")

routerList.map(route => {
    app.use(route.prefix, route.controller)
})

app.listen(PORT, () => {
    console.log("KEPS ASSISTANT INSTALLER API RUNNING ON " + PORT)
})