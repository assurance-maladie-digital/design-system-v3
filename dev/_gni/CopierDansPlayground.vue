<script setup lang="ts">
	import GniExamples from './_gni/GniExamples.vue'
	import ThemeSwitcher from './ThemeSwitcher.vue'
</script>

<template>
	<div>
		<ThemeSwitcher class="theme-switcher-position" />
		<GniExamples />
	</div>
</template>

<style scoped>
/* Position the theme switcher as needed */
.theme-switcher-position {
  position: fixed;
  bottom: 16px;
  right: 16px;
  z-index: 100;
}
</style>
