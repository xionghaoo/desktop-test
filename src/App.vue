<template>
  <div id="app">
    <ScreenA v-if="window.currentScreen === 0"/>
    <ScreenB v-else-if="window.currentScreen === 1"/>
    <ScreenC v-else-if="window.currentScreen === 2"/>
    <ScreenD v-else-if="window.currentScreen === 3"/>
    <div v-else>
      <h1 style="align-items: center; justify-content: center">Hellooo</h1>
    </div>
    <video id="video" class="camera" autoplay></video>
    <canvas id="canvas" class="canvas"></canvas>
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
      camera: null,
      wsClient: null,
      streaming: false,
      width: 320,
      height: 0
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
    const ipc = this.window.require('electron').ipcRenderer
    this.wsClient = new WebSocket("ws://120.76.175.224:9002");
    let ws = this.wsClient;
    switch (ws.readyState) {
      case WebSocket.CONNECTING:
        console.log("ws正在链接。。。")
        break;
      case WebSocket.OPEN:
        console.log("ws已链接")
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
      let res = obj.result;
      let hasRecognized = false;
      if (res) {
        for (let i = 0; i < res.length; i++) {
          // 识别到三角形
          if (res[i].shape === 'triangle') {
            ipc.send('showContent', {
              display: 0,
              content: 1
            });
            hasRecognized = true;
          }
        }
      }

      // 停止播放
      if (!hasRecognized) {
        ipc.send('stopContent', {
          display: 0,
          content: 1
        });
      }

    });

    this.openCamera();
  },
  methods: {
    openCamera() {
      let _this = this;
      _this.camera = document.getElementById("video")
      let constraints = {
        audio: false,
        video: true
      };
      navigator.mediaDevices
          .getUserMedia(constraints)
          .then(function(stream) {
            _this.camera.srcObject = stream;
            _this.camera.onloadedmetadata = function() {
              _this.camera.play();
              console.log("open camera")
              _this.startScan();
            };
          })
          .catch(err => {
            console.log(err);
          });

      let width = _this.width;
      _this.camera.addEventListener('canplay', () => {
        if (!_this.streaming) {
          let height = _this.camera.videoHeight / (_this.camera.videoWidth / width);
          _this.height = height;

          console.log(`camera width: ${_this.camera.videoWidth}， height: ${_this.camera.videoHeight}`)
          _this.camera.setAttribute('width', '100');
          _this.camera.setAttribute('height', '100');
          let canvas = document.getElementById('canvas');
          canvas.setAttribute('width', width.toString());
          canvas.setAttribute('height', height.toString());
          _this.streaming = true;
        }
      }, false)
    },
    startScan() {
      let ws = this.wsClient;
      setInterval(() => {
        // console.log("app 心跳")
        // 获取图片
        // let canvas = document.createElement('canvas');
        let canvas = document.getElementById('canvas');
        let { width, height } = this;
        if (width && height) {
          let ctx = canvas.getContext('2d');
          canvas.width = width;
          canvas.height = height;
          let camera = this.camera;
          console.log(`拍照: width: ${width} x ${height}`)
          ctx.drawImage(camera, 0, 0, width, height);
          let imgData = canvas.toDataURL("image/png");
          // 发送图片
          ws.send(JSON.stringify({"model": "shape_color_2d", "image": imgData}))
        }

      }, 1000)
    }
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
}
.canvas {
  position: absolute;
  left: 100px;
  width: 640px;
  height: 480px;
  top: 0;
}
</style>
