<template>
  <div class="fullscreen">
    <video width="100%" height="100%" autoplay loop>
      <source :src="video_url" type="video/mp4">
      Your browser does not support the video tag.
    </video>
  </div>
</template>

<script>
import video_url from "../assets/mov_bbb.mp4";

export default {
  name: "ScreenB",
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
    const ipc = this.window.require('electron').ipcRenderer
    ipc.on('onContentChange', (e, contentId) => {
      console.log("this is page B onContentChange: " + contentId);
    })
  }
}
</script>

<style scoped>
  .fullscreen {
    width: 100%;
    height: 100%;
  }
</style>