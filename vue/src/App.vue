<template>
  <div id="app">
    <div class="container">
      <div class="row">
        <div class="col-md-2"></div>
        <div class="col-md-8 pt-4">
          <h1>Pain Tracker</h1>
          <Main />
        </div>
        <div class="col-md-2"></div>
      </div>
    </div>
  </div>
</template>

<script>
import Main from "./components/Main.vue";

export default {
  name: "app",
  components: {
    Main
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: #eee;
}
</style>
