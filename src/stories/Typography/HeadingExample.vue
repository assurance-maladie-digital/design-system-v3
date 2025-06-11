<script setup>
	import { ref } from 'vue'

	const activeTab = ref('cnam')
</script>

<template>
	<div>
		<h2>Typography Heading Example</h2>

		<v-tabs v-model="activeTab">
			<v-tab value="cnam">
				CNAM Theme
			</v-tab>
			<v-tab value="pa">
				PA Theme
			</v-tab>
		</v-tabs>

		<v-window
			v-model="activeTab"
			class="mt-4"
		>
			<v-window-item value="cnam">
				<v-sheet class="v-theme--cnam pa-4">
					<h3 class="mb-4">
						CNAM Typography
					</h3>

					<div class="mb-6">
						<h4>With Vuetify Classes</h4>
						<div class="text-h1 mb-2">
							Heading 1 (with class)
						</div>
						<div class="text-h2 mb-2">
							Heading 2 (with class)
						</div>
						<div class="text-h3 mb-2">
							Heading 3 (with class)
						</div>
						<div class="text-h4 mb-2">
							Heading 4 (with class)
						</div>
						<div class="text-h5 mb-2">
							Heading 5 (with class)
						</div>
						<div class="text-h6 mb-2">
							Heading 6 (with class)
						</div>
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
			</v-window-item>

			<v-window-item value="pa">
				<v-sheet class="v-theme--pa pa-4">
					<h3 class="mb-4">
						PA Typography
					</h3>

					<div class="mb-6">
						<h4>With Vuetify Classes</h4>
						<div class="text-h1 mb-2">
							Heading 1 (with class)
						</div>
						<div class="text-h2 mb-2">
							Heading 2 (with class)
						</div>
						<div class="text-h3 mb-2">
							Heading 3 (with class)
						</div>
						<div class="text-h4 mb-2">
							Heading 4 (with class)
						</div>
						<div class="text-h5 mb-2">
							Heading 5 (with class)
						</div>
						<div class="text-h6 mb-2">
							Heading 6 (with class)
						</div>
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
			</v-window-item>
		</v-window>
	</div>
</template>

<style>
/* Any additional styles can be added here */
</style>
