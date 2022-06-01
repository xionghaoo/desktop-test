<template>
  <div class="fullscreen">
    <img :src="img_url" width="100%" height="100%"/>
  </div>
</template>

<script>
import img_url from "../assets/test_img.png";

export default {
  name: "ScreenD",
  data() {
    return {
      window: window,
      img_url: img_url
    }
  },
}
</script>

<style scoped>
  .fullscreen {
    width: 100%;
    height: 100%;
  }
</style>