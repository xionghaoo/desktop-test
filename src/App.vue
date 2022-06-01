<template>
  <div id="app">
    <ScreenA v-if="window.currentScreen === 0"/>
    <ScreenB v-else-if="window.currentScreen === 1"/>
    <ScreenC v-else-if="window.currentScreen === 2"/>
    <ScreenD v-else-if="window.currentScreen === 3"/>
    <div v-else>
      <h1 style="align-items: center; justify-content: center">Hellooo</h1>
    </div>
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
    }
  },
  components: {
    ScreenA,
    ScreenB,
    ScreenC,
    ScreenD
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
</style>
