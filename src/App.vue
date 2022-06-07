<template>
  <div id="app">
    <ScreenA v-if="window.currentScreen === 0"/>
    <ScreenB v-else-if="window.currentScreen === 1"/>
    <ScreenC v-else-if="window.currentScreen === 2"/>
    <ScreenD v-else-if="window.currentScreen === 3"/>
    <div v-else>
      <h1 style="align-items: center; justify-content: center">Hellooo</h1>
    </div>
    <!--  摄像头调试  -->
    <video v-if="window.currentScreen === 0" id="video" class="camera" autoplay></video>
    <canvas v-if="window.currentScreen === 0" id="canvas" class="canvas"></canvas>
    <button id="download" class="download">下载</button>
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
      height: 0,
      hasReceivedResponse: true
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
    let _this = this;
    // 120.76.175.224:9002
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
      _this.hasReceivedResponse = true
      let data = event.data;
      // 处理数据
      console.log("接收到数据：" + data);
      let obj = JSON.parse(data);
      _this.handleResult(obj);
    });

    this.openCamera();

    document.getElementById("download").addEventListener('click', () => {
      let canvas = document.getElementById('canvas');
      let imgData = canvas.toDataURL("image/jpeg");
      this.downloadImage(imgData, "my-canvas.jpg");
    });
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
      let _this = this;
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
          let imgData = canvas.toDataURL("image/jpeg");

          console.log("请求Aruco码识别")

          // ArUco识别
          if (_this.hasReceivedResponse) {
            _this.hasReceivedResponse = false;
            ws.send(JSON.stringify({"model": "aruco", "image": imgData}))
          }
          setTimeout(() => {
            console.log("请求文字识别")
            if (_this.hasReceivedResponse) {
              _this.hasReceivedResponse = false;
              // 文字识别
              ws.send(JSON.stringify({"model": "chinese_ocr", "image": imgData}))
            }
          }, 1000)

          setTimeout(() => {
            console.log("请求颜色识别")
            // 形状和颜色识别
            if (_this.hasReceivedResponse) {
              _this.hasReceivedResponse = false;
              ws.send(JSON.stringify({"model": "shape_color_2d", "image": imgData}))
            }
          }, 2000)

        }

      }, 3000);
    },
    handleResult(obj) {
      console.log("处理结果")
      let model = obj.model;
      let res = obj.result;
      let hasAruco = false;
      let hasText = false;
      let hasShape = false;
      if (res) {
        // eslint-disable-next-line no-constant-condition
        if (model === 'aruco') {
          // aruco码识别
          for (let i = 0; i < res.length; i++) {
            switch (res[i].num) {
              case 0:
                console.log("识别到Aruco码：0")
                hasAruco = true;
                break;
              case 1:
                console.log("识别到Aruco码：1")
                hasAruco = true;
                break;
            }
          }
        }
        if (model === 'chinese_ocr' && !hasAruco) {
          // 文字识别
          for (let i = 0; i < res.length; i++) {
            switch (res[i].txt) {
              case 'A':
                console.log("识别到文字： A")
                hasText = true;
                break;
              case 'B':
                console.log("识别到文字： B")
                hasText = true;
                break;
            }
          }
        }
        if (model === 'shape_color_2d' && !hasText && !hasAruco) {
          // 形状和颜色识别
          for (let i = 0; i < res.length; i++) {
            switch (res[i].shape) {
              case 'triangle':
                console.log("识别到三角形");
                this.playContent(1);
                hasShape = true;
                break;
              case 'pentagon':
                console.log("识别到五边形");
                this.playContent(2);
                hasShape = true;
                break;
              case 'hexagon':
                console.log("识别到六边形");
                this.playContent(3);
                hasShape = true;
                break;
            }
          }
          if (!hasShape) {
            this.stopContent(0)
          }
        }
      }
    },
    playContent(content) {
      const ipc = this.window.require('electron').ipcRenderer
      ipc.send('showContent', {
        display: 0,
        content: content
      });
    },
    stopContent(content) {
      const ipc = this.window.require('electron').ipcRenderer
      ipc.send('stopContent', {
        display: 0,
        content: content
      });
    },
    downloadImage(data, filename) {
      let a = document.createElement('a');
      a.href = data;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
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
.download {
  position: absolute;
  left: 100px;
  top: 200px;
}
</style>
