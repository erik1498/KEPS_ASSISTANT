import fs from "fs"

export const generateBase64FromPath = (filePath, mimetype) => {
    return "data:" + mimetype + ";base64," + fs.readFileSync(filePath, {
        encoding: "base64"
    })
}