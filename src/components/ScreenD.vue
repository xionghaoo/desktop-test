<template>
  <div class="fullscreen">
    <video v-if="content === 1" id="screenD_video" width="100%" height="100%" autoplay>
      <source :src="content_url" type="video/mp4">
      Your browser does not support the video tag.
    </video>
    <img v-else-if="content === 2" :src="default_content_url" width="100%" height="100%">
    <img v-else :src="cover_url" width="100%" height="100%">
  </div>
</template>

<script>
import img_production_content_4 from "../assets/production/content_4.mp4";
import img_company_content_4 from "../assets/company/content_4.mp4";
import img_education_content_4 from "../assets/education/content_4.mp4";
import cover_url from "@/assets/cover_right_bottom.png";

import img_production_default_4 from "../assets/production/default_4.jpg";
import img_company_default_4 from "../assets/company/default_4.jpg";
import img_education_default_4 from "../assets/education/default_4.jpg";

export default {
  name: "ScreenD",
  data() {
    return {
      window: window,
      cover_url: cover_url,
      content_url: '',
      default_content_url: '',
      content: 0,
      type: '',
      img_production_default_4: img_production_default_4,
      img_company_default_4: img_company_default_4,
      img_education_default_4: img_education_default_4,
      img_production_content_4: img_production_content_4,
      img_company_content_4: img_company_content_4,
      img_education_content_4: img_education_content_4,
    }
  },
  mounted() {
    const ipc = this.window.require('electron').ipcRenderer
    ipc.on('onShowContent', (e, args) => {
      console.log(`this is page D onContentChange: ${args.display}, ${args.content}, ${args.type}`);

      if (this.type !== args.type) {
        switch (args.type) {
          case 'production':
            this.content_url = this.img_production_content_4
            this.default_content_url = this.img_production_default_4
            break;
          case 'company':
            this.content_url = this.img_company_content_4
            this.default_content_url = this.img_company_default_4
            break;
          case 'education':
            this.content_url = this.img_education_content_4
            this.default_content_url = this.img_education_default_4
            break;
        }
        this.type = args.type;
        this.content = args.content;

        let video = document.getElementById("screenD_video");
        console.log("play mp4: " + this.content_url)
        let source = document.createElement('source');
        video.pause();
        source.setAttribute('src', this.content_url);
        source.setAttribute('type', 'video/mp4');
        video.load();
        video.play();
      }
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