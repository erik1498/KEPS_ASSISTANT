import { Sequelize } from "sequelize";
import { getEnv } from "../utils/envUtils.js";
import { LOGGER, logType } from "../utils/loggerUtil.js";

const db = new Sequelize({
    host: getEnv("DB_HOST"),
    port: getEnv("DB_PORT"),
    username: getEnv("DB_USER"),
    password: getEnv("DB_PASSWORD"),
    dialect: "mysql",
    logging: true,
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000,
        evict: 10000
    }
})

export const connectDatabase = () => {
    return new Promise(async (res) => {
        try {
            await db.authenticate()
            LOGGER(logType.INFO, "DATABASE TERKONEKSI !!!", null, null, null, null, false)
            res(true)
        } catch (error) {
            LOGGER(logType.INFO, "KONEKSI DATABASE GAGAL, AKAN DICOBA 5 DETIK LAGI !!!", null, null, null, null, false)
            setTimeout(connectDatabase, 5000)
        }
    })
}

export default db;