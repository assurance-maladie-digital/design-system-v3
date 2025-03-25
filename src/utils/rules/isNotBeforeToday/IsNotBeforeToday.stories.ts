import type { StoryObj } from '@storybook/vue3'
import { VTextField } from 'vuetify/components'
import { isNotBeforeToday, isNotBeforeTodayFn } from './index'
import { ref } from 'vue'

export default {
	title: 'Règles De Validation/isNotBeforeToday',
	component: isNotBeforeTodayFn,
}

export const Default: StoryObj<unknown> = {
	render: () => {
		return {
			components: { VTextField },
			setup() {
				const model = ref('12/12/2050')

				return { model, isNotBeforeToday }
			},
			template: `
				<VTextField
					v-model="model"
					:rules="[isNotBeforeToday]"
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
					import { isNotBeforeToday } from '@cnamts/synapse'
				</script>
				`,
			},
			{
				name: 'Template',
				code: `
				<template>
					<VTextField
						:rules="[isNotBeforeToday]"
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
				const messages = {
					default: 'The date must not be Before today.',
				}
				const dateRule = isNotBeforeTodayFn(messages)

				return { dateRule }
			},
			template: `
				<VTextField
					:rules="[dateRule]"
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
					import { isNotBeforeTodayFn } from '@cnamts/synapse'
				
					const messages = {
						default: 'The date must not be Before today.',
					}
					const dateRule = isNotBeforeTodayFn(messages)
				</script>
				`,
			},
			{
				name: 'Template',
				code: `
				<template>
					<VTextField
						:rules="[dateRule]"
						label="Date"
						variant="outlined"
					/>
				</template>
				`,
			},
		],
	},
}
