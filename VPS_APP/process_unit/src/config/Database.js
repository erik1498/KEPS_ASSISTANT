import { Sequelize } from "sequelize";
import { getEnv } from "../utils/envUtils.js";
import { LOGGER, logType } from "../utils/loggerUtil.js";

const db = new Sequelize({
    host: getEnv("DB_HOST"),
    port: getEnv("DB_PORT"),
    username: getEnv("DB_USER"),
    password: getEnv("DB_PASSWORD"),
    dialect: "mysql",
    logging: true
})

export const connectDatabase = () => {
    return new Promise(async (res) => {
        try {
            await db.authenticate()
            LOGGER(logType.INFO, "DATABASE TERKONEKSI !!!")
            res(true)
        } catch (error) {
            LOGGER(logType.INFO, "KONEKSI DATABASE GAGAL, AKAN DICOBA 5 DETIK LAGI !!!", {
                host: getEnv("DB_HOST"),
                port: getEnv("DB_PORT"),
                dialect: "mysql",
                logging: false
            })
            setTimeout(connectDatabase, 5000)
        }
    })
}

export default db;