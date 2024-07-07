import fs from "fs"
import CryptoJS from "crypto-js"

export const encryptFile = (filePath, dataToEncrypt, key) => {
    const encryptedData = CryptoJS.AES.encrypt(dataToEncrypt, key).toString();
    fs.writeFileSync(filePath, encryptedData);
}

export const decryptFile = (filePath, key) => {
    const encryptedData = fs.readFileSync(filePath, 'utf8');
    const decryptedData = CryptoJS.AES.decrypt(encryptedData, key).toString(CryptoJS.enc.Utf8);

    fs.writeFileSync(filePath.replaceAll(".keps", ".json"), decryptedData);
}

export const encryptString = (stringData, key) => {
    return CryptoJS.AES.encrypt(stringData, key).toString()
}

export const decryptString = (stringData, key) => {
    let decrypt = CryptoJS.AES.decrypt(stringData, key)
    return decrypt.toString(CryptoJS.enc.Utf8)
}

export const generateRandomString = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }

    return result;
}