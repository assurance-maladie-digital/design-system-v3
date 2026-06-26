import type { StoryObj } from '@storybook/vue3'
import { VTextField } from 'vuetify/components'
import { isNotAfterToday, isNotAfterTodayFn } from './index'
import { ref } from 'vue'

export default {
	title: 'Guide Du Dev/Utilitaires/Règles de validation/isNotAfterToday',
	component: isNotAfterTodayFn,
}

export const Default: StoryObj<unknown> = {
	render: () => {
		return {
			components: { VTextField },
			setup() {
				const model = ref('12/12/2050')

				return { model, isNotAfterToday }
			},
			template: `
				<VTextField
					v-model="model"
					:rules="[isNotAfterToday]"
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
					import { isNotAfterToday } from '@cnamts/synapse'
				</script>
				`,
			},
			{
				name: 'Template',
				code: `
				<template>
					<VTextField
						:rules="[isNotAfterToday]"
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
				const model = ref('31/12/2999')
				const messages = {
					default: 'The date must not be after today.',
				}
				const dateRule = isNotAfterTodayFn(messages)

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
					import { isNotAfterTodayFn } from '@cnamts/synapse'

					const messages = {
						default: 'The date must not be after today.',
					}
					const dateRule = isNotAfterTodayFn(messages)
					const model = ref('31/12/2999')
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
