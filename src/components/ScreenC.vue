<template>
  <div class="fullscreen">
    <div id="anim" style="width: 50%;height:50%;margin: 0 auto;"></div>
  </div>
</template>

<script>
import anim_data from "../assets/107267-meta.json";
import lottie from "lottie-web"

export default {
  name: "ScreenC",
  data() {
    return {
      window: window,
      anim_data: anim_data
    }
  },
  mounted() {
    let anim = lottie.loadAnimation({
      container: document.getElementById('anim'), // 绑定dom节点
      renderer: 'svg', // 渲染方式:svg、canvas
      loop: true, // 是否循环播放，默认：false
      autoplay: true, // 是否自动播放, 默认true
      animationData: anim_data // AE动画使用bodymovie导出为json数据
    });
    anim.play();
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