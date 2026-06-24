import type { StoryObj } from '@storybook/vue3'
import { VTextField } from 'vuetify/components'
import { isNotAfterDateFn } from './index'
import { ref } from 'vue'

export default {
	title: 'Guide Du Dev/Utilitaires/Règles de validation/isNotAfterDate',
	component: isNotAfterDateFn,
}

export const Default: StoryObj<unknown> = {
	render: () => {
		return {
			components: { VTextField },
			setup() {
				const date = isNotAfterDateFn('01/01/2022')
				const model = ref('12/12/2023')

				return { date, model }
			},
			template: `
				<VTextField
					v-model="model"
					:rules="[date]"
					label="Date"
					variant="outlined"
					validate-on="eager blur"
				/>
			`,
		}
	},
	parameters: {
		sourceCode: [
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { VTextField } from 'vuetify/components'
					import { isNotAfterDateFn } from '@cnamts/synapse'

					const date = isNotAfterDateFn('01/01/2022')
				</script>
				`,
			},
			{
				name: 'Template',
				code: `
				<template>
					<VTextField
						:rules="[date]"
						label="Date"
						variant="outlined"
					/>
				</template>
				`,
			},
		],
	},
}

export const CustomMessage: StoryObj<unknown> = {
	render: () => {
		return {
			components: { VTextField },
			setup() {
				const model = ref('12/12/2023')
				const date = isNotAfterDateFn('01/01/2022', {
					default: (date: string) => `The date must not be after ${date}`,
				})
				return { date, model }
			},
			template: `
				<VTextField
					v-model="model"
					:rules="[date]"
					label="Date"
					variant="outlined"
					validate-on="eager blur"
				/>
			`,
		}
	},
	parameters: {
		sourceCode: [
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { VTextField } from 'vuetify/components'
					import { ref } from 'vue'
					import { isNotAfterDateFn } from '@cnamts/synapse'

					const date = isNotAfterDateFn('01/01/2022', {
						default: (date: string) => 'The date must not be after ' + date,
					})
					const model = ref('12/12/2023')
				</script>
				`,
			},
			{
				name: 'Template',
				code: `
				<template>
					<VTextField
						v-model="model"
						:rules="[date]"
						label="Date"
						variant="outlined"
						validate-on="eager blur"
					/>
				</template>
				`,
			},
		],
	},
}
