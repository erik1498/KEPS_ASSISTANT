import fs from "fs"

export const createFile = (path, data) => {
    return new Promise((res, rej) => {
        let directoryPath = path.split("/");
        directoryPath = directoryPath.slice(0, directoryPath.length - 1).join("/")

        if (!fs.existsSync(directoryPath)) {
            fs.promises.mkdir(`${directoryPath}`, { recursive: true }).then(() => {
                fs.writeFile(path, data, (err) => {
                    if (err) {
                        rej("Gagal Membuat File " + path, err.stack)
                    }
                    res("Berhasil Membuat File", path)
                })
            }).catch(err => {
                if (err) throw err;
            })
        }
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