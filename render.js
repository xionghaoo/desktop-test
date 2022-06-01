// 未用到
const ipc = require('electron').ipcRenderer

document.getElementById("btn1").addEventListener('click', showDialog)
document.getElementById("btn2").addEventListener('click', showAlert)

function showDialog() {
    ipc.send('show-open-dialog', 'jiajiajijia')
}

function showAlert() {
    // TODO 存在bug：Invalid value used as weak map key
    const { webContents } = require('electron')
    require("@electron/remote/main").enable(webContents)
    const { dialog } = require('@electron/remote')
    console.log(dialog)
    alert('hello')
}