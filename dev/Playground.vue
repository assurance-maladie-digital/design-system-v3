<script setup lang="ts">
	import { ref } from 'vue'
	import { SyTextField, NirField } from '@/components'
	const selectedValue = ref('33')

	const rules = [
		(value: string) => !!value || 'Required.',
		(value: string) => !!value || 'toto.',
		(value: string) => !!value || 'tata.',
		(value: string) => value.length >= 3 || 'Min 3 characters',
		(value: string) => value.length >= 5 || 'Min 5 characters',
		(value: string) => value.length >= 7 || 'Min 7 characters',
	]

	const customRules = [{
			type: 'required',
			options: {
				message: 'Required type.',
			},
		},
		{
			type: 'custom',
			options: {
				validate: (value: string) => !!value && value.length >= 5,
				message: 'Required.',
			},
		}, {
			type: 'custom',
			options: {
				validate: (value: string) => value.length >= 3,
				message: 'Min 3 characters',
			},
		}]

	const nirRules = [
		(value: string) => !!value || 'Required.',
		(value: string) => value.at(0) == '1' || 'Should not be a female',
	]

</script>

<template>
	<div class="ma-16">
		<h1 class="text-2xl font-bold mb-4">
			Playground
		</h1>

		<div
			style="display: grid; gap: 2rem 10rem; grid-template-columns: 1fr 1fr;"
		>
			<div>
				<p class="mb-4">
					SyTextField vuetify validation
				</p>
				<SyTextField
					v-model="selectedValue"
					use-vuetify-validation
					label="Test"
					:rules="rules"
					:max-errors="2"
				/>
			</div>

			<div>
				<p class="mb-4">
					SyTextField custom validation
				</p>
				<SyTextField
					v-model="selectedValue"
					label="Test"
					:custom-rules="customRules"
					:max-errors="2"
				/>
			</div>

			<div>
				<p class="mb-4">
					NirField with vuetify validation
				</p>
				<NirField
					v-model="selectedValue"
					use-vuetify-validation
					label="Test"
					:rules="nirRules"
				/>
			</div>

			<div>
				<p class="mb-4">
					NirField with custom validation
				</p>
				<NirField
					v-model="selectedValue"
					label="Test"
					:custom-rules="customRules"
				/>
			</div>
		</div>
	</div>
</template>
