<script lang="ts" setup>
	import ThemeSwitcher from './ThemeSwitcher.vue'
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
		<v-btn color="primary">
			Button
		</v-btn>
		<v-btn
			color="primary"
			variant="outlined"
		>
			Button sec
		</v-btn>
		<v-btn
			color="secondary"
			variant="outlined"
		>
			Button sec
		</v-btn>
        <v-btn
			color="tertiary"
			variant="outlined"
		>
			Button sec
		</v-btn>
		<v-btn
			color="primary"
			variant="tonal"
		>
			Button
		</v-btn>
        <v-btn
			color="secondary"
			variant="tonal"
		>
			Button
		</v-btn>
        <v-btn
			color="tertiary"
			variant="tonal"
		>
			Button
		</v-btn>
		<v-btn
			color="primary"
			variant="text"
		>
			Button
		</v-btn>
		<br>
		<v-btn
			color="primary"
			disabled
		>
			Button
		</v-btn>
		<v-btn
			color="primary"
			disabled
			variant="outlined"
		>
			Button
		</v-btn>
		<v-btn
			color="primary"
			disabled
			variant="tonal"
		>
			Button
		</v-btn>
		<v-btn
			color="primary"
			disabled
			variant="text"
		>
			Button
		</v-btn>
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
