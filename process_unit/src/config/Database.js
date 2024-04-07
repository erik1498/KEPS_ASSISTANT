import { Sequelize } from "sequelize";
import { getEnv } from "../utils/envUtils.js";

const db = new Sequelize(getEnv("DB_NAME"), getEnv("DB_USER"), getEnv("DB_PASSWORD"), {
    host: getEnv("DB_HOST"),
    port: getEnv("DB_PORT"),
    dialect: "mysql",
    logging: false
})

export const waitForDBConnection = async () => {
    while (true) {
        try {
            await db.authenticate();
            console.log('Connected to database!');
            break;
        } catch (error) {
            console.error('Error connecting to database:', error);
            console.log('Retrying in 2 seconds...');
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }
}

export default db;