<script lang="ts" setup>
	import { ref } from 'vue'
	import SyAutocomplete from '../src/components/Customs/Selects/SyAutocomplete/SyAutocomplete.vue'

	const items = [
		{ text: 'Paris (75)', value: '75' },
		{ text: 'Bouches-du-Rhône (13)', value: '13' },
		{ text: 'Nord (59)', value: '59' },
		{ text: 'Haute-Garonne (31)', value: '31' },
		{ text: 'Gironde (33)', value: '33' },
		{ text: 'Rhône (69)', value: '69' },
	]

	const value1 = ref(null)
	const value2 = ref(null)
	const value3 = ref([])
	const value4 = ref([])

	const requiredRule = {
		type: 'custom',
		options: {
			validate: v => !!v,
			message: 'Ce champ est obligatoire',
		},
	}
</script>

<template>
	<VContainer class="py-8">
		<h2 class="mb-6">
			SyAutocomplete — disableErrorHandling
		</h2>

		<VRow>
			<VCol
				cols="12"
				md="6"
			>
				<p class="mb-2 text-subtitle-2">
					Avec validation (par défaut)
				</p>
				<SyAutocomplete
					v-model="value1"
					:items="items"
					label="Département"
					text-key="text"
					value-key="value"
					:required="true"
					:display-asterisk="true"
					:is-validate-on-blur="true"
					:custom-rules="[requiredRule]"
				/>
			</VCol>

			<VCol
				cols="12"
				md="6"
			>
				<p class="mb-2 text-subtitle-2">
					Sans validation — disableErrorHandling (usage filtre)
				</p>
				<SyAutocomplete
					v-model="value2"
					:items="items"
					label="Département"
					text-key="text"
					value-key="value"
					:disable-error-handling="true"
					clearable
				/>
			</VCol>
		</VRow>

		<VRow class="mt-4">
			<VCol
				cols="12"
				md="6"
			>
				<p class="mb-2 text-subtitle-2">
					Multiple + chips — disableErrorHandling
				</p>
				<SyAutocomplete
					v-model="value3"
					:items="items"
					label="Départements"
					text-key="text"
					value-key="value"
					:multiple="true"
					:chips="true"
					:disable-error-handling="true"
					clearable
				/>
			</VCol>

			<VCol
				cols="12"
				md="6"
			>
				<p class="mb-2 text-subtitle-2">
					Multiple sans chips — disableErrorHandling
				</p>
				<SyAutocomplete
					v-model="value4"
					:items="items"
					label="Départements"
					text-key="text"
					value-key="value"
					:multiple="true"
					:disable-error-handling="true"
					clearable
				/>
			</VCol>
		</VRow>

		<VRow class="mt-4">
			<VCol>
				<p class="text-caption text-medium-emphasis">
					Valeurs : {{ { value1, value2, value3, value4 } }}
				</p>
			</VCol>
		</VRow>
	</VContainer>
</template>
