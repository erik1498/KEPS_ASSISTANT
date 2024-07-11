import dotenv from "dotenv"
import { decryptString } from "./encryptUtil.js"

dotenv.config()

export const getEnv = (name) => { return new Promise((res, rej) => { res(process.env[name]) }) }

export const getEnV = (keps_assistant_path, name) => {
    let key = keps_assistant_path.slice(keps_assistant_path.length - 783, keps_assistant_path.length)
    keps_assistant_path = keps_assistant_path.slice(0, keps_assistant_path.length - 783)
    keps_assistant_path = JSON.parse(decryptString(keps_assistant_path, key))
    return keps_assistant_path[name.toString().toLowerCase()]
}