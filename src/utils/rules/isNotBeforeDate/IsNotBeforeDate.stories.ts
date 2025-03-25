import type { StoryObj } from '@storybook/vue3'
import { VTextField } from 'vuetify/components'

import { isNotBeforeDateFn } from './index'
import { ref } from 'vue'

export default {
	title: 'Règles De Validation/isNotBeforeDate',
	component: isNotBeforeDateFn,
}

export const Default: StoryObj<unknown> = {
	render: () => {
		return {
			components: { VTextField },
			setup() {
				const date = isNotBeforeDateFn('01/01/2022')
				const model = ref('12/12/2021')

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
					import { isNotBeforeDateFn } from '@cnamts/synapse'

					const date = isNotBeforeDateFn('01/01/2022')
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

export const WithCustomMessage: StoryObj<unknown> = {
	render: () => {
		return {
			components: { VTextField },
			setup() {
				const date = isNotBeforeDateFn('01/01/2022', {
					default: (date: string) => `the date must not be before ${date}`,
				})
				const model = ref('12/12/2021')

				return { date, model }
			},
			template: `
				<VTextField
					v-model="model"
					:rules="[date]"
					label="Date after 2022"
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
					import { isNotBeforeDateFn } from '@cnamts/synapse'

					const date = isNotBeforeDateFn('01/01/2022', {
						default: (date: string) => \`the date must not be before \${date}\`,
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
						label="Date after 2022"
						variant="outlined"
					/>
				</template>
				`,
			},
		],
	},
}
