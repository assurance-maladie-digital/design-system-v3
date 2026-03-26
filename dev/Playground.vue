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
		<VBtn class="primary">
			Bouton d’action primaire
		</VBtn>
		<VBtn class="primary disabled">
			Bouton d’action primaire disabled
		</VBtn>
		<VBtn class="secondary">
			Bouton d’action secondaire
		</VBtn>
		<VBtn class="secondary disabled">
			Bouton d’action secondaire désactivé
		</VBtn>
		<VBtn class="tertiary">
			Bouton d’action tertiary
		</VBtn>
		<VBtn class="tertiary disabled">
			Bouton d’action tertiary désactivé
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
