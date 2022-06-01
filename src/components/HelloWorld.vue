<template>
  <div class="hello">
    <h1>当前页面：{{ window.currentScreen }}</h1>
    <p>
      For a guide and recipes on how to configure / customize this project,<br>
      check out the
      <a href="https://cli.vuejs.org" target="_blank" rel="noopener">vue-cli documentation</a>.
    </p>
    <video width="320" height="240" controls>
      <source :src="video_url" type="video/mp4">
      Your browser does not support the video tag.
    </video>

    <h1>Hello World!</h1>
    We are using Node.js <span id="node-version"></span>,
    Chromium <span id="chrome-version"></span>,
    and Electron <span id="electron-version"></span>.
    <br>
    <button id="btn1" v-on:click="showDialog">显示对话框</button><br>
    <button id="btn2" v-on:click="showAlert">alert</button><br>
    <input type="number" name="name">
    <br>
    <textarea name="ta" cols="5" rows="5"></textarea>
  </div>
</template>

<script>
import video_url from "../assets/mov_bbb.mp4";

export default {
  name: 'HelloWorld',
  data() {
    return {
      window: window,
      video_url: video_url
    }
  },
  props: {
    msg: String
  },
  methods: {
    showDialog: function () {
      const ipc = window.require('electron').ipcRenderer
      ipc.send('show-open-dialog', 'jiajiajijia')
    },
    showAlert: function () {
      // TODO 存在bug：Invalid value used as weak map key
      const { webContents } = window.require('electron')
      window.require("@electron/remote/main").enable(webContents)
      const { dialog } = window.require('@electron/remote')
      console.log(dialog)
      alert('hello')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
