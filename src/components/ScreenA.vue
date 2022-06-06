<template>
  <div class="fullscreen">
    <video id="screenA_video" width="100%" height="100%" loop>
      <source :src="video_url" type="video/mp4">
      Your browser does not support the video tag.
    </video>
  </div>
</template>

<script>
import video_url from "../assets/bbb_sunflower_1080p_30fps_normal.mp4";

export default {
  name: "ScreenA",
  data() {
    return {
      window: window,
      video_url: video_url
    }
  },
  props: {
    msg: String
  },
  mounted() {
    let video = document.getElementById("screenA_video");
    const ipc = this.window.require('electron').ipcRenderer
    ipc.on('onShowContent', (e, args) => {
      console.log("this is page A onContentChange: " + args);
      video.play();
    })

    ipc.on('onStopContent', (e, args) => {
      console.log("this is page A onStopChange: " + args);
      video.pause();
    })
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

<style scoped>
  .fullscreen {
    width: 100%;
    height: 100%;
  }
</style>