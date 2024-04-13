import { Sequelize } from "sequelize";
import { getEnv } from "../utils/envUtils.js";

const db = new Sequelize(getEnv("DB_NAME"), getEnv("DB_USER"), getEnv("DB_PASSWORD"), {
    host: getEnv("DB_HOST"),
    port: getEnv("DB_PORT"),
    dialect: "mysql",
    logging: true
})

export default db;