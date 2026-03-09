<script lang="ts" setup>
	import ThemeSwitcher from './ThemeSwitcher.vue'
	import SyIconButton from '@/components/Customs/SyIconButton/SyIconButton.vue'
	import { mdiChevronRight } from '@mdi/js'
</script>

<template>
	<div>
		<ThemeSwitcher class="theme-switcher-position" />

		<VSheet
			color="primary"
			class="pa-4"
		>
			start developing here
		</VSheet>
		<div class="mx-4">
			<SyIconButton
				:icon="mdiChevronRight"
				@click-icon-button="() => console.log('Icon button clicked')"
			/>
		</div>
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
