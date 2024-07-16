import { app, BrowserWindow } from "electron"
import { readFileData } from "./utils/fileUtils.js";
import { getEnv, getEnV } from "./utils/envUtils.js";
import { decryptKeygenString, encryptString } from "./utils/encryptUtil.js";
import getmac from "getmac"
import { PERMISSION_METHOD } from "./constant/method.constant.js";
import { CLIENT_ID, HOME_URL, KEPS_ASSISTANT_PATH, LICENSE_PATH, MAC_ADDRESS, OS_INFO, USER_PARAMETER_KEY } from "./constant/environtment.constant.js";
import chalk from "chalk";
import http from "http"
import { URL } from "node:url"
import os from "os"

let intervalId;
let interval;
let index = 0
let UserPermission = null;

let keps_assistant_path = null

const createWindow = async () => {
    if (keps_assistant_path) {
        const win = new BrowserWindow({
            autoHideMenuBar: true,
            webPreferences: {
                devTools: false,
                nodeIntegration: true,
                contextIsolation: false,
                zoomFactor: 0.75
            },
        })

        win.webContents.on('devtools-closed', () => {
            win.webContents.executeJavaScript(`window.showErrorMessage('DevTools was disconnected from the page.');`);
        });

        win.webContents.on('crashed', () => {
            console.error('Halaman renderer crash.');
        });

        const sesiBrowser = win.webContents.session;

        sesiBrowser.webRequest.onBeforeSendHeaders((details, callback) => {
            try {
                let detailsCopy = { ...details }

                detailsCopy.requestHeaders['Mode'] = "Desktop"
                detailsCopy.requestHeaders['Client_id'] = getEnV(keps_assistant_path, CLIENT_ID)
                detailsCopy.requestHeaders['User-Parameters'] = encryptString(JSON.stringify({
                    timestamp: detailsCopy.timestamp,
                    macAddr: getmac(),
                    osInfo: getOSInfo()
                }), getEnV(keps_assistant_path, USER_PARAMETER_KEY))

                if (PERMISSION_METHOD.indexOf(detailsCopy.method) > -1 && detailsCopy.uploadData) {
                    detailsCopy.requestHeaders['User-Parameters'] = encryptString(JSON.stringify({
                        payload: detailsCopy.uploadData[0].bytes.toString(),
                        timestamp: detailsCopy.timestamp,
                        macAddr: getmac(),
                        osInfo: getOSInfo()
                    }), getEnV(keps_assistant_path, USER_PARAMETER_KEY))
                }
                detailsCopy.requestHeaders['User-Permission'] = UserPermission

                callback({
                    cancel: false,
                    requestHeaders: details.requestHeaders
                })
            } catch (error) {
                console.log(error)
                callback({})
            }
        })

        win.maximize()
        win.loadURL(getEnV(keps_assistant_path, HOME_URL), {
            extraHeaders: 'Mode: Desktop'
        })

        win.webContents.on('did-finish-load', () => {
            // intervalId = setInterval(callAPI, 5000);
            try {
                win.webContents.debugger.attach('1.3');
                console.log('Debugger attached');

                // Example: Enable network domain
                win.webContents.debugger.sendCommand('Network.enable')
                    .then(() => {
                        console.log('Network domain enabled');
                    })
                    .catch(err => {
                        console.error('Failed to enable Network domain:', err);
                    });
            } catch (err) {
                console.error('Debugger attach failed:', err);
            }
        });

        win.on('closed', () => {
            clearInterval(intervalId);
        });
    } else {
        console.clear()
        console.log(chalk.green(`
            ░█░█░█▀▀░█▀█░█▀▀
            ░█▀▄░█▀▀░█▀▀░▀▀█
            ░▀░▀░▀▀▀░▀░░░▀▀▀
            ░█▀█░█▀▀░█▀▀░▀█▀░█▀▀░▀█▀░█▀█░█▀█░▀█▀
            ░█▀█░▀▀█░▀▀█░░█░░▀▀█░░█░░█▀█░█░█░░█░
            ░▀░▀░▀▀▀░▀▀▀░▀▀▀░▀▀▀░░▀░░▀░▀░▀░▀░░▀░
            ░▀█▀░█▀█░█▀▀░▀█▀░█▀█░█░░░█░░░█▀▀░█▀▄
            ░░█░░█░█░▀▀█░░█░░█▀█░█░░░█░░░█▀▀░█▀▄
            ░▀▀▀░▀░▀░▀▀▀░░▀░░▀░▀░▀▀▀░▀▀▀░▀▀▀░▀░▀
        `))
        console.log(chalk.green(`        - SEDANG MEMULAI INSTALLER ....`))
        interval = setInterval(commandStep, 2500)
    }
}

function getOSInfo() {
    return {
        hostname: os.hostname(),
        arch: os.arch(),
        platform: os.platform(),
        type: os.type(),
        memory: os.totalmem().toString().slice(0, 2),
        cpu: os.cpus().at(0).model
    }
}

let answerList = ``
async function commandStep() {
    let date = new Date();
    if (index == 0) {
        console.log(chalk.green(`        [${date.getDate()}-${date.getMonth()}-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}:${date.getMilliseconds()}] MENUNGGU KONFIRMASI SERVER ....`))
        index++
        return
    }
    if (index == 1) {
        console.log(chalk.green(`        [${date.getDate()}-${date.getMonth()}-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}:${date.getMilliseconds()}] MENYEDIAKAN FILE REQUEST ....`))
        index++
        answerList = decryptKeygenString(await readFileData("./KEYGEN.keps")).split(",")
        answerList.push(getmac())
        answerList.push(getOSInfo())
        return
    }
    if (index == 2) {
        console.log(chalk.green(`        [${date.getDate()}-${date.getMonth()}-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}:${date.getMilliseconds()}] MENTERJEMAHKAN KODE ENKRIPSI REQUEST ....`))
        index++
        return
    }
    if (index == 3) {
        console.log(chalk.green(`        [${date.getDate()}-${date.getMonth()}-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}:${date.getMilliseconds()}] MEMBANGUN PENGATURAN REQUEST ....`))
        index++
        return
    }
    if (index == 4) {
        console.log(chalk.green(`        [${date.getDate()}-${date.getMonth()}-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}:${date.getMilliseconds()}] MENGIRIM PERMINTAAN KE SERVER INSTALLER ....`))
        index++
        return
    }
    if (index == 5) {
        console.log(chalk.green(`        [${date.getDate()}-${date.getMonth()}-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}:${date.getMilliseconds()}] MENUNGGU RESPONSE DARI SERVER, MUNGKIN MEMAKAN WAKTU 3s LEBIH ....`))
        index++
        return
    }
    if (index == 6) {
        const urlParths = new URL(answerList[0])

        const requestOptions = {
            hostname: urlParths.hostname,
            port: urlParths.port,
            path: urlParths.pathname,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': JSON.stringify(answerList).length
            }
        }

        const req = http.request(requestOptions, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                console.log(chalk.green(`        [${date.getDate()}-${date.getMonth()}-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}:${date.getMilliseconds()}] SELESAI ....`))
                data = JSON.parse(data)
                console.log(chalk.yellow("        ======================================================KEPS ASSISTANT PATH VALUE================================================================================="))
                console.log(`        - ${data.data.KEPS_ASSISTANT_PATH}`)
                console.log(chalk.yellow("        ==========================================================LICENSE CODE VALUE===================================================================================="))
                console.log(`        - ${data.data.LICENSE_DATA}`)
            });
        });


        req.on('error', (error) => {
            console.error(error);
        });

        req.write(JSON.stringify(answerList));

        req.end();
    }
    clearInterval(interval)
}

async function callAPI() {
    try {
        if (getmac() != getEnV(keps_assistant_path, MAC_ADDRESS) || JSON.stringify(getOSInfo()) != JSON.stringify(getEnV(keps_assistant_path, OS_INFO))) {
            app.quit();
        }
    } catch (error) {
        console.error('Error calling API:', error.message);
    }
}

function chekcLicense() {
    return new Promise(async (res, rej) => {
        keps_assistant_path = await getEnv(KEPS_ASSISTANT_PATH)
        if (keps_assistant_path) {
            UserPermission = await readFileData(getEnV(keps_assistant_path, LICENSE_PATH))
            if (!UserPermission) {
                rej(false)
                // deleteFolderRecursive("./")
                app.quit()
            }
        }
        res(true)
    })
}

app.whenReady().then(async () => {
    await chekcLicense()
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})