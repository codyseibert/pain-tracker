<template>
  <div class="row slider">
    <div class="col-md-3">
      <label for="exampleFormControlSelect1">{{this.label}}</label>
    </div>
    <div class="col-md-9">
      <vue-slider
        :marks="true"
        :value="this.value"
        :min="0"
        :max="10"
        @change="(value) => this.$emit('change', value)"
      />
    </div>
  </div>
</template>

<script>
import VueSlider from "vue-slider-component";
import "vue-slider-component/theme/antd.css";

export default {
  props: ["value", "label"],
  methods: {},
  components: {
    VueSlider
  }
};
</script>

<style scoped>
.slider {
  margin-bottom: 40px;
}
</style>