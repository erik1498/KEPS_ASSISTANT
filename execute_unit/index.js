const { app, BrowserWindow } = require("electron")

const createWindow = () => {
    const win = new BrowserWindow({
        autoHideMenuBar: true,
        webPreferences: {
            zoomFactor: 0.75
        }
    })

    win.maximize()
    win.loadURL("http://172.30.0.4:5173/")
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})