<template>
  <div class="fullscreen">
    <img v-if="content === 1" :src="content_url" width="100%" height="100%">
    <img v-else-if="content === 2" :src="default_content_url" width="100%" height="100%">
    <img v-else :src="cover_url" width="100%" height="100%">
  </div>
</template>

<script>
// import anim_data from "../assets/107267-meta.json";
// import lottie from "lottie-web"
import img_production_content_3 from "../assets/production/content_3.gif";
import img_company_content_3 from "../assets/company/content_3.gif";
import img_education_content_3 from "../assets/education/content_3.gif";
import cover_url from "@/assets/cover_left_bottom.png";

import img_production_default_3 from "../assets/production/default_3.jpg";
import img_company_default_3 from "../assets/company/default_3.jpg";
import img_education_default_3 from "../assets/education/default_3.jpg";

export default {
  name: "ScreenC",
  data() {
    return {
      window: window,
      // anim_data: anim_data,
      cover_url: cover_url,
      content_url: '',
      default_content_url: '',
      content: 0,
      img_production_default_3: img_production_default_3,
      img_company_default_3: img_company_default_3,
      img_education_default_3: img_education_default_3,
      img_production_content_3: img_production_content_3,
      img_company_content_3: img_company_content_3,
      img_education_content_3: img_education_content_3,
    }
  },
  mounted() {
    // let anim = lottie.loadAnimation({
    //   container: document.getElementById('anim'), // 绑定dom节点
    //   renderer: 'svg', // 渲染方式:svg、canvas
    //   loop: true, // 是否循环播放，默认：false
    //   autoplay: true, // 是否自动播放, 默认true
    //   animationData: anim_data // AE动画使用bodymovie导出为json数据
    // });
    // anim.play();

    const ipc = this.window.require('electron').ipcRenderer
    ipc.on('onShowContent', (e, args) => {
      console.log(`this is page C onContentChange: ${args.display}, ${args.content}, ${args.type}`);
      switch (args.type) {
        case 'production':
          this.content_url = this.img_production_content_3;
          this.default_content_url = this.img_production_default_3;
          break;
        case 'company':
          this.content_url = this.img_company_content_3;
          this.default_content_url = this.img_company_default_3;
          break;
        case 'education':
          this.content_url = this.img_education_content_3;
          this.default_content_url = this.img_education_default_3;
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
    padding:0;
    margin: 0;
  }
</style>