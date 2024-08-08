<template>
  <div class="d-flex flex-wrap ga-3">
    <h1>Test Heading</h1>
    <VBtn class="btn">Test Button</VBtn>
    <VBtn color="primary">Primary Button</VBtn>
    <VBtn color="secondary">Secondary Button</VBtn>
    <VBtn color="accent">Accent Button</VBtn>
    <VBtn color="warning">Warning Button</VBtn>
    <VBtn color="success">Success Button</VBtn>
    <VBtn color="error">Error Button</VBtn>
    <VBtn color="info">Info Button</VBtn>
    <VBtn color="risquePro">RisquePro Button</VBtn>

  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'TestComponent'
});
</script>

<style lang="scss" scoped>
@import '../../assets/tokens.scss';

h1 {
  color: $orange-base;
}

button {
  background-color: $blue-base;
  color: $white-base;
  border-radius: $radius-rounded;
}
</style>