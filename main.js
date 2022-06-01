const {app, BrowserWindow, screen} = require('electron')
const path = require('path')
// const url = require("url");

require('@electron/remote/main').initialize()

const ipc = require('electron').ipcMain
const dialog = require('electron').dialog

ipc.on('show-message-dialog', function (e, msg) {
    dialog.showMessageBox({message: msg})
})
ipc.on('show-open-dialog', function () {
    dialog.showOpenDialog({properties: ['openFile', 'openDirectory', 'multiSelections']})
})

// const createWindow = () => {
//     const win = new BrowserWindow({
//         width: 800,
//         height: 600,
//         x: 0,
//         y: 0,
//         webPreferences: {
//             nodeIntegration: true,
//             contextIsolation: false,
//             preload: path.join(__dirname, 'preload0.js')
//         }
//     })
//     // 窗口全屏
//     win.setFullScreen(true)
//     win.loadFile('./dist/index.html')
// }

const createMultiWindow = () => {
    let displays = screen.getAllDisplays()
    displays.find((display) => {
        console.log(`find display id: ${display.id}, ${display.bounds.width} x ${display.bounds.height}`)
    })
    for (let i = 0; i < displays.length; i++) {
        let display = displays[i];

        const win = new BrowserWindow({
            width: 800,
            height: 600,
            x: display.bounds.x,
            y: display.bounds.y,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
                preload: path.join(__dirname, `preload${i}.js`)
            }
        })
        win.setFullScreen(true)
        win.loadFile('./dist/index.html')
    }
}

app.whenReady().then(() => {
    // createWindow()
    createMultiWindow()
    // createOtherWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createMultiWindow()
    })

    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            app.quit()
        }
    })
})


