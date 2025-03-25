import type { StoryObj } from '@storybook/vue3'
import { VTextField } from 'vuetify/components'
import { isNotAfterDateFn } from './index'
import { ref } from 'vue'

export default {
	title: 'Règles De Validation/isNotAfterDate',
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
				const date = isNotAfterDateFn('01/01/2022', {
					default: (date: string) => `The date must not be after ${date}`,
				})
				return { date }
			},
			template: `
				<VTextField
					:rules="[date]"
					label="Date"
					variant="outlined"
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

					const date = isNotAfterDateFn('01/01/2022', {
						default: (date: string) => \`The date must not be after \${date}\`,
					})
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
