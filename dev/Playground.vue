<script setup lang="ts">
	import AmeliproBtn from '@/components/Amelipro/AmeliproBtn/AmeliproBtn.vue'
	import ThemeSwitcher from './ThemeSwitcher.vue'
	const handleClick = () => {
		console.log('Button clicked')
	}
</script>

<template>
	<div>
		<ThemeSwitcher class="theme-switcher-position" />

    coucou

		<AmeliproBtn
			default="My Button"
			unique-id="my-btn-id"
			@click="handleClick"
		>
			My Button
		</AmeliproBtn>
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
