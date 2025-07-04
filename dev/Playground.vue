<script lang="ts" setup>
	import ThemeSwitcher from './ThemeSwitcher.vue'
</script>
<template>
	<div>
		<ThemeSwitcher class="theme-switcher-position" />
		<h3 class="text-primary my-2">
			Headings
		</h3>
		<VSheet
			color="primary"
			class="pa-4"
		>
			<h1>H1</h1>
			<h2>H2</h2>
			<h3>H3</h3>
			<h4>H4</h4>
			<h5>H5</h5>
			<h6>H6</h6>
			<p class="text-h1">
				text class h1
			</p>
			<p class="text-h2">
				text class h2
			</p>
			<p class="text-h3">
				text class h3
			</p>
			<p class="text-h4">
				text class h4
			</p>
			<p class="text-h5">
				text class h5
			</p>
			<p class="text-h6">
				text class h6
			</p>
		</VSheet>
		<h3 class="text-primary my-2">
			Other variables
		</h3>
		<VSheet
			color="primary"
			class="pa-4"
		>
			<p class="text-body-1">
				text class body-1
			</p>
			<p class="text-body-2">
				text class body-2
			</p>
			<p class="text-subtitle-1">
				text class subtitle-1
			</p>
			<p class="text-subtitle-2">
				text class subtitle-2
			</p>
			<p class="text-caption">
				text class caption
			</p>
			<p class="text-overline">
				text class overline
			</p>
			<p class="text-display-1">
				text class display-1
			</p>
			<p class="text-display-2">
				text class display-2
			</p>
		</VSheet>
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