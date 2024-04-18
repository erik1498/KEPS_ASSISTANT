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
            LOGGER(logType.INFO, "BERHASIL KONEKSI DATABASE !!!")
            db.sync()
            res(true)
        } catch (error) {
            LOGGER(logType.INFO, "GAGAL KONEKSI DATABASE, 5 DETIK KEMUDIAN AKAN DI KONEKSI LAGI !!!")
            setTimeout(connectDatabase, 5000)
        }
    })
}

export default db;