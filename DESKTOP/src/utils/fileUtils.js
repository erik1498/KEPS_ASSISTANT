import fs from "fs"
import path from "path"

export const createFile = (path, data) => {
    return new Promise((res, rej) => {
        fs.writeFile(path, data, (err) => {
            if (err) {
                rej("Gagal Membuat File " + path, err.stack)
            }
            res("Berhasil Membuat File", path)
        })
    })
}

export const deleteFile = (path) => {
    return new Promise((res, rej) => {
        fs.unlink(path, err => {
            if (err) {
                rej("Gagal Menghapus File " + path, err.message)
            }
            res("Berhasil Menghapus File ", path)
        })
    })
}

export async function deleteFolderRecursive(folderPath) {
    if (fs.existsSync(folderPath)) {
        fs.readdirSync(folderPath).forEach((file, index) => {
            const curPath = path.join(folderPath, file);
            if (fs.lstatSync(curPath).isDirectory()) {
                deleteFolderRecursive(curPath);
            } else { // Hapus file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(folderPath); // Hapus folder setelah file-filenya dihapus
        console.log(`Folder ${folderPath} berhasil dihapus.`);
    } else {
        console.log(`Folder ${folderPath} tidak ditemukan.`);
    }
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

export const readAllFileInDirectory = (directoryPath) => {
    return new Promise(async (res, rej) => {
        let dataReturn = []
        try {
            const files = await fs.promises.readdir(directoryPath)
            files.forEach(async (file, idx) => {
                const data = await readFileData(`${directoryPath}/${file}`)
                dataReturn.push(data)
                if (idx + 1 == files.length) {
                    res(dataReturn)
                }
            })
            if (files.length == 0) {
                res(dataReturn)
            }
        } catch (err) {
            res(dataReturn)
        }
    })
}