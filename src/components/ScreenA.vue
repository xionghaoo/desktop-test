<template>
  <div class="fullscreen">
    <img v-if="content === 1" :src="content_url" width="100%" height="100%">
    <img v-else-if="content === 2" :src="default_content_url" width="100%" height="100%">
    <img v-else :src="cover_url" width="100%" height="100%">
<!--    <video v-else id="screenA_video" width="100%" height="100%" loop>-->
<!--      <source :src="video_url" type="video/mp4">-->
<!--      Your browser does not support the video tag.-->
<!--    </video>-->
  </div>
</template>

<script>
// import video_url from "../assets/bbb_sunflower_1080p_30fps_normal.mp4";
import cover_url from "../assets/cover_left_top.png";
import img_production_default_1 from "../assets/production/default_1.jpg";
import img_company_default_1 from "../assets/company/default_1.jpg";
import img_education_default_1 from "../assets/education/default_1.jpg";
import img_production_content_1 from "../assets/production/content_1.jpg";
import img_company_content_1 from "../assets/company/content_1.jpg";
import img_education_content_1 from "../assets/education/content_1.jpg";

export default {
  name: "ScreenA",
  data() {
    return {
      window: window,
      // video_url: video_url,
      cover_url: cover_url,
      isShowContent: false,
      content: 0,
      content_url: '',
      default_content_url: '',
      img_production_default_1: img_production_default_1,
      img_company_default_1: img_company_default_1,
      img_education_default_1: img_education_default_1,
      img_production_content_1: img_production_content_1,
      img_company_content_1: img_company_content_1,
      img_education_content_1: img_education_content_1,
    }
  },
  props: {
    msg: String
  },
  mounted() {
    const ipc = this.window.require('electron').ipcRenderer
    ipc.on('onShowContent', (e, args) => {
      console.log(`this is page A onContentChange: ${args.display}, ${args.content}, ${args.type}`);
      switch (args.type) {
        case 'production':
          this.content_url = this.img_production_content_1
          this.default_content_url = this.img_production_default_1
          break;
        case 'company':
          this.content_url = this.img_company_content_1
          this.default_content_url = this.img_company_default_1
          break;
        case 'education':
          this.content_url = this.img_education_content_1
          this.default_content_url = this.img_education_default_1
          break;
      }
      this.content = args.content;
    })

    ipc.on('onStopContent', (e, args) => {
      console.log("this is page A onStopChange: " + args);
      this.content = args.content;
      // video.pause();
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