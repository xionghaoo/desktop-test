<template>
  <div id="app">
    <ScreenA v-if="window.currentScreen === 0"/>
    <ScreenB v-else-if="window.currentScreen === 1"/>
    <ScreenC v-else-if="window.currentScreen === 2"/>
    <ScreenD v-else-if="window.currentScreen === 3"/>
    <div v-else>
      <h1 style="align-items: center; justify-content: center">Hellooo</h1>
    </div>
    <video id="video" class="camera" autoplay>

    </video>
  </div>
</template>

<script>
import ScreenA from "@/components/ScreenA";
import ScreenB from "@/components/ScreenB";
import ScreenC from "@/components/ScreenC";
import ScreenD from "@/components/ScreenD";

export default {
  name: 'App',
  data() {
    return {
      window: window,
      thisVideo: null
    }
  },
  components: {
    ScreenA,
    ScreenB,
    ScreenC,
    ScreenD
  },
  mounted() {
    console.log("mount")
    let ws = new WebSocket("ws://120.76.175.224:9002");

    switch (ws.readyState) {
      case WebSocket.CONNECTING:
        console.log("ws正在链接。。。")
        break;
      case WebSocket.OPEN:
        console.log("ws已链接")

        setInterval(() => {
          // console.log("app 心跳")
          // 获取图片
          let canvas = document.createElement('canvas');
          let ctx = canvas.getContext('2d');
          ctx.drawImage(this.thisVideo, 0, 0, 640, 480);
          let imgData = canvas.toDataURL("image/png");
          // 发送图片
          ws.send(JSON.stringify({"model": "shape_color_2d", "image": imgData}))
        }, 10000)

        break;
      case WebSocket.CLOSING:
        console.log("ws正在关闭。。。")
        break;
      case WebSocket.CLOSED:
        console.log("ws已关闭。。。")
        break;
      default:
        // this never happens
        break;
    }

    ws.addEventListener("message", function(event) {
      let data = event.data;
      // 处理数据
      console.log("接收到数据：" + data);
      let obj = JSON.parse(data);
      console.log("json data: " + obj);
    });

    this.openCamera();
  },
  methods: {
    openCamera() {
      let _this = this;
      _this.thisVideo = document.getElementById("video")
      let constraints = {
        audio: false,
        video: true
      };
      navigator.mediaDevices
          .getUserMedia(constraints)
          .then(function(stream) {
            _this.thisVideo.srcObject = stream;
            _this.thisVideo.onloadedmetadata = function() {
              _this.thisVideo.play();
              console.log("open camera")
            };
          })
          .catch(err => {
            console.log(err);
          });
    },
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.camera {
  position: absolute;
  width: 100px;
  height: 100px;
  left: 0;
  top: 0;
  background: #42b983;
}
</style>
