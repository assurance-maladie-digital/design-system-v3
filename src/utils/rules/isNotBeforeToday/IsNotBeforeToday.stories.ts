import type { StoryObj } from '@storybook/vue3'
import { VTextField } from 'vuetify/components'
import { isNotBeforeToday, isNotBeforeTodayFn } from './index'
import { ref } from 'vue'

export default {
	title: 'Guide du dev/Règles De Validation/isNotBeforeToday',
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
				const model = ref('01/01/2000')
				const messages = {
					default: 'The date must not be Before today.',
				}
				const dateRule = isNotBeforeTodayFn(messages)

				return { dateRule, model }
			},
			template: `
				<VTextField
					v-model="model"
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
					import { ref } from 'vue'
					import { isNotBeforeTodayFn } from '@cnamts/synapse'

					const messages = {
						default: 'The date must not be Before today.',
					}
					const dateRule = isNotBeforeTodayFn(messages)
					const model = ref('01/01/2000')
				</script>
				`,
			},
			{
				name: 'Template',
				code: `
				<template>
					<VTextField
						v-model="model"
						:rules="[dateRule]"
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
