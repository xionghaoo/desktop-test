const {app, BrowserWindow, screen} = require('electron')
const path = require('path')
// const url = require("url");

require('@electron/remote/main').initialize()

const ipc = require('electron').ipcMain
const dialog = require('electron').dialog

let windowList = [];
let currentType = '';

ipc.on('show-message-dialog', function (e, msg) {
    dialog.showMessageBox({message: msg})
})
ipc.on('show-open-dialog', function () {
    dialog.showOpenDialog({properties: ['openFile', 'openDirectory', 'multiSelections']})
})
ipc.on('showContent', function (e, args) {
    let index = args.display;
    if (windowList[index]) {
        windowList[index].webContents.postMessage('onShowContent', args, [])
    }

    if (currentType !== args.type) {
        // 给渲染窗口发送消息
        for (let i = 0; i < windowList.length; i++) {
            if (index !== i) {
                windowList[i].webContents.postMessage('onShowContent', {
                    display: i,
                    type: args.type,
                    content: 2
                }, [])
            }
        }
        currentType = args.type;
    }


    // switch (display) {
    // case 0:
    //     break;
    // }
})
ipc.on('stopContent', function (e, args) {
    // 给渲染窗口发送消息
    for (let i = 0; i < windowList.length; i++) {
        windowList[i].webContents.postMessage('onStopContent', args, [])
    }
})

const createMultiWindow = () => {
    let displays = screen.getAllDisplays()
    displays.find((display) => {
        console.log(`find display id: ${display.id}, ${display.bounds.width} x ${display.bounds.height}`)
    })
    windowList = []
    let screenIndexes = [];
    for (let i = 0; i < displays.length; i++) {
        let display = displays[i];

        let x = display.bounds.x;
        let y = display.bounds.y;

        let w = 1920;
        let h = 1080
        let threshold = 10;
        let start = -10;
        if (x >= start && x <= threshold && y >= start && y <= threshold) {
            // 第一块屏幕
            screenIndexes.push({
                x: x,
                y: y,
                index: 0
            });
        }
        if (x >= w && x <= w + threshold && y >= start && y <= threshold) {
            // 第二块屏幕
            screenIndexes.push({
                x: x,
                y: y,
                index: 1
            });
        }
        if (x >= start && x <= threshold && y >= h && y <= h + threshold) {
            // 第三块屏幕
            screenIndexes.push({
                x: x,
                y: y,
                index: 2
            });
        }
        if (x >= w && x <= w + threshold && y >= h && y <= h + threshold) {
            // 第四块屏幕
            screenIndexes.push({
                x: x,
                y: y,
                index: 3
            });
        }

    }

    for (let i = 0; i < screenIndexes.length; i++) {
        let screen = screenIndexes[i];

        const win = new BrowserWindow({
            width: 800,
            height: 600,
            x: screen.x,
            y: screen.y,
            frame: false,
            titleBarStyle: 'hidden',
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
                preload: path.join(__dirname, `preload${screen.index}.js`)
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


