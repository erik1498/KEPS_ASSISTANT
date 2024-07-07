import dotenv from "dotenv"

dotenv.config()

export const getEnv = (envName) => {
    return process.env[envName]
}