<script setup lang="ts">
	import { onMounted } from 'vue'
	import { useTheme } from 'vuetify'
	import { useThemeManager } from './themeUtils'

	// Access Vuetify theme
	const vuetifyTheme = useTheme()

	// Use the theme manager
	const { currentTheme, switchTheme, initTheme } = useThemeManager(vuetifyTheme)

	// Initialize theme on component mount
	onMounted(() => {
		initTheme()
	})
</script>

<template>
	<div class="theme-switcher">
		<v-btn
			:color="currentTheme === 'cnam' ? 'primary' : ''"
			variant="outlined"
			size="small"
			style="background-color: white"
			@click="switchTheme('cnam')"
		>
			Thème CNAM
		</v-btn>
		<v-btn
			:color="currentTheme === 'pa' ? 'primary' : ''"
			variant="outlined"
			size="small"
			style="background-color: white"
			@click="switchTheme('pa')"
		>
			Thème PA
		</v-btn>
		<v-btn
			:color="currentTheme === 'ap' ? 'primary' : ''"
			variant="outlined"
			size="small"
			style="background-color: white"
			@click="switchTheme('ap')"
		>
			Thème AmeliPro
		</v-btn>
	</div>
</template>

<style scoped>
.theme-switcher {
  display: flex;
  gap: 8px;
}
</style>
