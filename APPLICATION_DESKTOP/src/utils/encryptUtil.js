import CryptoJS from "crypto-js"

export const encryptString = (stringData, key) => {
    return CryptoJS.AES.encrypt(stringData, key).toString()
}

export const decryptString = (stringData, key) => {
    return CryptoJS.AES.decrypt(stringData, key).toString(CryptoJS.enc.Utf8)
}

export const decryptKeygenString = (stringData) => {
    let lengthKey = parseInt(stringData.slice(stringData.length - 3, stringData.length))
    let key = stringData.slice(stringData.length - (lengthKey + 3), stringData.length - 3)
    let decrypt = decryptString(stringData.slice(0, stringData.length - (lengthKey + 3)), key)
    return decrypt
}