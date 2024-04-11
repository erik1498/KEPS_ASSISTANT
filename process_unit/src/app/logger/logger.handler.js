import { getLoggerData } from "./logger.services.js"
import fs from "fs"
import jwt from "jsonwebtoken"
import { getEnv } from "../../utils/envUtils.js"

export const backupLogger = async (req, res) => {
    try {
        const loggerData = await getLoggerData()
        fs.writeFile('data2.txt', jwt.sign(JSON.stringify(loggerData), getEnv("REFRESH_SECRET")), (err) => {
            if (err) throw err;
            console.log('Data has been downloaded to data.json');
        });
        res.json({
            message: "Backup Data Success"
        })
    } catch (error) {
        LOGGER(logType.ERROR, "Error ", error.stack, req.identity, req.originalUrl, req.method, true)
        res.status(500).json({
            type: "internalServerError",
            message: error.message
        })
    }
}