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
		<VBtn color="primary">
			Bouton d’action primaire
		</VBtn>

		<VBtn color="secondary">
			Bouton d’action secondaire
		</VBtn>

		<VBtn color="tertiary"
		:disabled="true">
			Bouton d’action tertiary désactivé
		</VBtn>

		<VBtn
			:disabled="true"
			color="secondary"
		>
			Bouton d’action secondaire désactivé
		</VBtn>
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
