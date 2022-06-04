const {app, BrowserWindow, screen} = require('electron')
const path = require('path')
// const url = require("url");

require('@electron/remote/main').initialize()

const ipc = require('electron').ipcMain
const dialog = require('electron').dialog

var windowList = [];

ipc.on('show-message-dialog', function (e, msg) {
    dialog.showMessageBox({message: msg})
})
ipc.on('show-open-dialog', function () {
    dialog.showOpenDialog({properties: ['openFile', 'openDirectory', 'multiSelections']})
})
ipc.on('showContent', function (e, contentId) {
    // 给渲染窗口发送消息
    for (let i = 0; i < windowList.length; i++) {
        windowList[i].webContents.postMessage('onContentChange', contentId, [])
    }
})

const createMultiWindow = () => {
    let displays = screen.getAllDisplays()
    displays.find((display) => {
        console.log(`find display id: ${display.id}, ${display.bounds.width} x ${display.bounds.height}`)
    })
    windowList = []
    for (let i = 0; i < displays.length; i++) {
        let display = displays[i];

        const win = new BrowserWindow({
            width: 800,
            height: 600,
            x: display.bounds.x,
            y: display.bounds.y,
            frame: false,
            titleBarStyle: 'hidden',
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
                preload: path.join(__dirname, `preload${i}.js`)
            }
        })
        win.setFullScreen(true)
        win.loadFile('./dist/index.html')
        windowList.push(win);
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


