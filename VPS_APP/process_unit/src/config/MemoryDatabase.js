import { Sequelize } from "sequelize";
import { LOGGER, logType } from "../utils/loggerUtil.js";

// Koneksi SQLite (in-memory)
const sqliteSequelize = new Sequelize({
    dialect: 'sqlite',
    storage: ':memory:', // In-memory database
    logging: false
});


export const connectDatabaseMemory = () => {
    return new Promise(async (res) => {
        try {
            await sqliteSequelize.authenticate()
            LOGGER(logType.INFO, "DATABASE MEMORY TERKONEKSI !!!")
                sqliteSequelize.sync({
                    alter: true,
                }).then(() => {
                    console.log('Database & tables synced!');
                }).catch((error) => {
                    console.error('Error syncing database:', error);
                });
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

export default sqliteSequelize

