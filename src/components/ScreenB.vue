<template>
  <div class="fullscreen">
    <img v-if="content === 1" :src="content_url" width="100%" height="100%">
    <img v-else-if="content === 2" :src="default_content_url" width="100%" height="100%">
    <img v-else :src="cover_url" width="100%" height="100%">
  </div>
</template>

<script>
import img_production_content_2 from "../assets/production/content_2.jpg";
import img_company_content_2 from "../assets/company/content_2.jpg";
import img_education_content_2 from "../assets/education/content_2.png";
import cover_url from "@/assets/cover_right_top.png";

import img_production_default_2 from "../assets/production/default_2.jpg";
import img_company_default_2 from "../assets/company/default_2.jpg";
import img_education_default_2 from "../assets/education/default_2.jpg";

export default {
  name: "ScreenB",
  data() {
    return {
      window: window,
      cover_url: cover_url,
      content_url: '',
      default_content_url: '',
      content: 0,
      img_production_default_2: img_production_default_2,
      img_company_default_2: img_company_default_2,
      img_education_default_2: img_education_default_2,
      img_production_content_2: img_production_content_2,
      img_company_content_2: img_company_content_2,
      img_education_content_2: img_education_content_2,
    }
  },
  props: {
    msg: String
  },
  mounted() {
    const ipc = this.window.require('electron').ipcRenderer
    ipc.on('onShowContent', (e, args) => {
      console.log(`this is page B onContentChange: ${args.display}, ${args.content}, ${args.type}`);
      switch (args.type) {
        case 'production':
          this.content_url = this.img_production_content_2
          this.default_content_url = this.img_production_default_2
          break;
        case 'company':
          this.content_url = this.img_company_content_2
          this.default_content_url = this.img_company_default_2
          break;
        case 'education':
          this.content_url = this.img_education_content_2
          this.default_content_url = this.img_education_default_2
          break;
      }
      this.content = args.content;
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