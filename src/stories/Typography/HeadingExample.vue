<script setup>
import { ref, onMounted } from 'vue'

const activeTab = ref('cnam')
const themeApplied = ref(false)

onMounted(() => {
	// Force theme application
	themeApplied.value = true
})
</script>

<template>
	<div>
		<h2>Typography Heading Example</h2>

		<v-tabs v-model="activeTab">
			<v-tab value="cnam">CNAM Theme</v-tab>
			<v-tab value="pa">PA Theme</v-tab>
		</v-tabs>

		<v-window v-model="activeTab" class="mt-4">
			<v-window-item value="cnam">
				<v-theme-provider theme="cnam">
					<v-sheet class="pa-4">
						<h3 class="mb-4">CNAM Typography</h3>

						<div class="mb-6">
							<h4>With Vuetify Classes</h4>
							<div class="text-h1 mb-2">Heading 1 (with class)</div>
							<div class="text-h2 mb-2">Heading 2 (with class)</div>
							<div class="text-h3 mb-2">Heading 3 (with class)</div>
							<div class="text-h4 mb-2">Heading 4 (with class)</div>
							<div class="text-h5 mb-2">Heading 5 (with class)</div>
							<div class="text-h6 mb-2">Heading 6 (with class)</div>
						</div>

						<div class="mb-6">
							<h4>Native HTML Elements</h4>
							<h1>H1 Element (without class)</h1>
							<h2>H2 Element (without class)</h2>
							<h3>H3 Element (without class)</h3>
							<h4>H4 Element (without class)</h4>
							<h5>H5 Element (without class)</h5>
							<h6>H6 Element (without class)</h6>
						</div>
					</v-sheet>
				</v-theme-provider>
			</v-window-item>

			<v-window-item value="pa">
				<v-theme-provider theme="pa">
					<v-sheet class="pa-4">
						<h3 class="mb-4">PA Typography</h3>

						<div class="mb-6">
							<h4>With Vuetify Classes</h4>
							<div class="text-h1 mb-2">Heading 1 (with class)</div>
							<div class="text-h2 mb-2">Heading 2 (with class)</div>
							<div class="text-h3 mb-2">Heading 3 (with class)</div>
							<div class="text-h4 mb-2">Heading 4 (with class)</div>
							<div class="text-h5 mb-2">Heading 5 (with class)</div>
							<div class="text-h6 mb-2">Heading 6 (with class)</div>
						</div>

						<div class="mb-6">
							<h4>Native HTML Elements</h4>
							<h1>H1 Element (without class)</h1>
							<h2>H2 Element (without class)</h2>
							<h3>H3 Element (without class)</h3>
							<h4>H4 Element (without class)</h4>
							<h5>H5 Element (without class)</h5>
							<h6>H6 Element (without class)</h6>
						</div>
					</v-sheet>
				</v-theme-provider>
			</v-window-item>
		</v-window>
	</div>
</template>

<style>
/* Additional styles for better visualization */
.v-theme--cnam h1, .v-theme--pa h1,
.v-theme--cnam h2, .v-theme--pa h2,
.v-theme--cnam h3, .v-theme--pa h3,
.v-theme--cnam h4, .v-theme--pa h4,
.v-theme--cnam h5, .v-theme--pa h5,
.v-theme--cnam h6, .v-theme--pa h6 {
	margin-bottom: 0.5rem;
}
</style>
