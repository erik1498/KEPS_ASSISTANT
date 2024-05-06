import { Sequelize } from "sequelize";
import { getEnv } from "../utils/envUtils.js";
import { LOGGER, logType } from "../utils/loggerUtil.js";

const db = new Sequelize(getEnv("DB_NAME"), getEnv("DB_USER"), getEnv("DB_PASSWORD"), {
    host: getEnv("DB_HOST"),
    port: getEnv("DB_PORT"),
    dialect: "mysql",
    logging: true
})

export const connectDatabase = () => {
    return new Promise(async (res) => {
        try {
            await db.authenticate()
            LOGGER(logType.INFO, "DATABASE TERKONEKSI !!!")
            db.sync()
            res(true)
        } catch (error) {
            LOGGER(logType.INFO, "KONEKSI DATABASE GAGAL, AKAN DICOBA 5 DETIK LAGI !!! " + getEnv("DB_HOST") + " - " + getEnv("DB_PORT") )
            setTimeout(connectDatabase, 5000)
        }
    })
}

export default db;