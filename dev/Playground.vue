<script setup lang="ts">
	import { ref } from 'vue'
	import { SyTextField, NirField } from '@/components'
	const selectedValue1 = ref('')
	const selectedValue2 = ref('')
	const selectedValue3 = ref('')
	const selectedValue4 = ref('')
	const selectedValue5 = ref('')
	const selectedValue6 = ref('')
	const selectedValue7 = ref('')
	const selectedValue8 = ref('')

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
					SyTextField vuetify validation on blur
				</p>
				<SyTextField
					v-model="selectedValue1"
					use-vuetify-validation
					label="Test"
					:rules="rules"
					:max-errors="2"
				/>
			</div>

			<div>
				<p class="mb-4">
					SyTextField custom validation on blur
				</p>
				<SyTextField
					v-model="selectedValue2"
					label="Test"
					:custom-rules="customRules"
					:max-errors="2"
				/>
			</div>

						<div>
				<p class="mb-4">
					SyTextField vuetify validation on input
				</p>
				<SyTextField
					v-model="selectedValue3"
					use-vuetify-validation
					label="Test"
					:rules="rules"
					:max-errors="2"
					:is-validate-on-blur="false"
				/>
			</div>

			<div>
				<p class="mb-4">
					SyTextField custom validation on input
				</p>
				<SyTextField
					v-model="selectedValue4"
					label="Test"
					:custom-rules="customRules"
					:max-errors="2"
					:is-validate-on-blur="false"
				/>
			</div>

			<div>
				<p class="mb-4">
					NirField with vuetify validation on blur
				</p>
				<NirField
					v-model="selectedValue5"
					use-vuetify-validation
					label="Test"
					:rules="nirRules"
				/>
			</div>

			<div>
				<p class="mb-4">
					NirField with custom validation on blur
				</p>
				<NirField
					v-model="selectedValue6"
					label="Test"
					:custom-rules="customRules"
				/>
			</div>

			<div>
				<p class="mb-4">
					NirField with vuetify validation on input
				</p>
				<NirField
					v-model="selectedValue7"
					use-vuetify-validation
					label="Test"
					:rules="nirRules"
					:is-validate-on-blur="false"
				/>
			</div>

			<div>
				<p class="mb-4">
					NirField with custom validation on input
				</p>
				<NirField
					v-model="selectedValue8"
					label="Test"
					:custom-rules="customRules"
					:is-validate-on-blur="false"
				/>
			</div>
		</div>
	</div>
</template>
