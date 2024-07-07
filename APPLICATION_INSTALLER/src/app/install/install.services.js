import { encryptString, generateRandomString } from "../../utils/encrypt.js"
import { v4 } from 'uuid'
import bcrypt from "bcrypt"
import { getEnv } from "../../utils/envUtils.js"
import { createFile } from "../../utils/fileUtil.js"

export const generateInstallerKey = async (data) => {
    const {
        license_path,
        home_url,
        mac_address,
        serial_key,
        username,
        name,
        client_id,
        os_info
    } = data

    let { password } = data

    let keps_assistant_path = {
        license_path,
        home_url,
        mac_address,
        user_parameter_key: getEnv("USER_PARAMETER_KEY"),
        client_id: client_id,
        os_info
    }

    password = await bcrypt.hash(password, 10);

    let date = new Date()

    await createFile(`./user_generate/${client_id}/${username}.sql`, `INSERT INTO user_tab (
        id, 
        uuid, 
        username, 
        password, 
        name, 
        role, 
        serial_key, 
        mac_address, 
        createdAt, 
        updatedAt,
        os_info
    ) VALUES (
        NULL, 
        '${v4()}', 
        '${username}', 
        '${password}', 
        '${name}', 
        'Admin', 
        '${serial_key}', 
        '${mac_address}', 
        '${date.getFullYear()}-${date.getMonth() < 10 ? `0${date.getMonth()}` : `${date.getMonth()}`}-${date.getDate() < 10 ? `0${date.getDate()}` : `${date.getDate()}`} ${date.getHours() < 10 ? `0${date.getHours()}` : `${date.getHours()}`}:${date.getMinutes() < 10 ? `0${date.getMinutes()}` : `${date.getMinutes()}`}:${date.getSeconds() < 10 ? `0${date.getSeconds()}` : `${date.getSeconds()}`}',
        '${date.getFullYear()}-${date.getMonth() < 10 ? `0${date.getMonth()}` : `${date.getMonth()}`}-${date.getDate() < 10 ? `0${date.getDate()}` : `${date.getDate()}`} ${date.getHours() < 10 ? `0${date.getHours()}` : `${date.getHours()}`}:${date.getMinutes() < 10 ? `0${date.getMinutes()}` : `${date.getMinutes()}`}:${date.getSeconds() < 10 ? `0${date.getSeconds()}` : `${date.getSeconds()}`}',
        '${JSON.stringify(os_info)}' 
    )`)

    return {
        KEPS_ASSISTANT_PATH: `${encryptString(JSON.stringify(keps_assistant_path), getEnv("KEPS_ASSISTANT_KEY"))}${getEnv("KEPS_ASSISTANT_KEY")}`,
        LICENSE_DATA: `${encryptString(getEnv("LICENSE_KEY"), serial_key)}`
    }
}

export const generateKeyGen = async (body) => {
    let jsonBody = [
        "hostname",
        "serial_key",
        "license_path",
        "home_url",
        "username",
        "password",
        "name",
        "client_id"
    ];

    let bodyNormalize = jsonBody.map(item => body[item]).join(",")
    let lengthKey = Math.floor(Math.random() * 1000);
    let generateString = generateRandomString(lengthKey)

    console.log({
        bodyNormalize,
        lengthKey,
        generateString,
        key: `${encryptString(bodyNormalize, generateString)}${generateString}${lengthKey}`
    })
    return {
        KEY: `${encryptString(bodyNormalize, generateString)}${generateString}${lengthKey}`
    }
}