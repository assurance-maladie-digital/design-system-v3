<template>
  <div>
    <h1>Test Heading</h1>
    <VBtn class="btn">Test Button</VBtn>
    <VBtn color="warning">Test Button</VBtn>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'TestComponent'
});
</script>

<style lang="scss" scoped>
@import '../../assets/main.scss';

h1 {
  color: $orange-base;
}

button {
  background-color: $blue-base;
  color: $white-base;
  border-radius: $radius-rounded;
}
</style>