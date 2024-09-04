import { Sequelize } from "sequelize";
import { getEnv } from "../utils/envUtils.js";
import { LOGGER, logType } from "../utils/loggerUtil.js";
import fs from "fs"

const { DataTypes } = Sequelize;

let db;
let logStream;

if (getEnv("DB_MIGRATION") == "true") {
    // Membuat stream untuk menulis ke file
    logStream = fs.createWriteStream(`migrations/migrations_${getEnv("DB_NAME")}_${new Date().getTime()}.sql`, { flags: 'a' });

    const commandAllow = ["CREATE", "ALTER"]

    db = new Sequelize({
        host: getEnv("DB_HOST"),
        port: getEnv("DB_PORT"),
        database: getEnv("DB_NAME"),
        username: getEnv("DB_USER"),
        password: getEnv("DB_PASSWORD"),
        dialect: "mysql",
        timezone: '+08:00',
        logging: (msg) => {
            const message = msg.split(": ")[1]

            if (commandAllow.indexOf(message.split(" ").at(0)) != -1) {
                logStream.write(message + '\n');
            }
        },
    })
} else {
    db = new Sequelize({
        host: getEnv("DB_HOST"),
        port: getEnv("DB_PORT"),
        username: getEnv("DB_USER"),
        password: getEnv("DB_PASSWORD"),
        dialect: "mysql",
        timezone: '+08:00',
        logging: false
    })
}

export const connectDatabase = () => {
    return new Promise(async (res) => {
        try {
            await db.authenticate()
            LOGGER(logType.INFO, "DATABASE TERKONEKSI !!!")
            if (getEnv("DB_MIGRATION") == "true") {
                db.sync({
                    alter: true,
                }).then(() => {
                    console.log('Database & tables synced!');
                    logStream.end(); // Menutup stream setelah sinkronisasi selesai
                }).catch((error) => {
                    console.error('Error syncing database:', error);
                    logStream.end(); // Menutup stream setelah sinkronisasi selesai
                });
            }
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

export const defaultModelBuilder = (attributes) => {

    attributes.createdBy = {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    }

    attributes.updatedBy = {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    }

    attributes.enabled = {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    }

    return attributes
}

export default db;