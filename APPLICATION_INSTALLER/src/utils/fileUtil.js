import fs from "fs"

export const createFile = (path, data) => {
    return new Promise((res, rej) => {
        let directoryPath = path.split("/");
        directoryPath = directoryPath.slice(0, directoryPath.length -1).join("/")

        if (!fs.existsSync(directoryPath)) {
            fs.mkdir(`${directoryPath}`, { recursive: true }, (err) => {
                if (err) throw err;
            })
        }
        fs.writeFile(path, data, (err) => {
            if (err) {
                rej("Gagal Membuat File " + path, err.stack)
            }
            res("Berhasil Membuat File", path)
        })
    })
}

export const readFileData = async (pathFile) => {
    try {
        const data = await fs.promises.readFile(pathFile, { encoding: "utf-8" })
        return data
    } catch (error) {
        console.log(error)
        return null
    }
}