import type { StoryObj } from '@storybook/vue3'
import { VTextField } from 'vuetify/components'
import { isDateValid, isDateValidFn } from './index'
import { ref } from 'vue'

export default {
	title: 'Guide du dev/Règles De Validation/isDateValid',
	component: isDateValid,
}

export const Default: StoryObj<unknown> = {
	render: () => {
		return {
			components: { VTextField },
			setup() {
				const date = ref('31/11/1993')
				return { date, isDateValid }
			},
			template: `
				<VTextField
					v-model="date"
					:rules="[isDateValid]"
					label="Date valide"
					validate-on="eager blur"
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
					import { isDateValid } from '@cnamts/synapse'
				</script>
				`,
			},
			{
				name: 'Template',
				code: `
				<template>
					<VTextField
						:rules="[isDateValid]"
						label="Date valide"
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
				const date = ref('31/11/1993')
				const dateValid = isDateValidFn({
					default: 'The date you entered is invalid',
					wrongFormat: 'The format you entered is invalid',
					monthNotMatch: 'The day you entered exceeds the number of days in the corresponding month',
					notALeapYear: 'The day you entered is invalid because the corresponding year is not a leap year',
				})
				return { date, dateValid }
			},
			template: `
				<VTextField
					v-model="date"
					:rules="[dateValid]"
					label="Date"
					validate-on="eager blur"
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
					import { isDateValidFn } from '@cnamts/synapse'
					
					const isDateValidCustom = isDateValidFn({
						default: 'The date you entered is invalid',
						wrongFormat: 'The format you entered is invalid',
						monthNotMatch: 'The day you entered exceeds the number of days in the corresponding month',
						notALeapYear: 'The day you entered is invalid because the corresponding year is not a leap year',
					})
				</script>
				`,
			},
			{
				name: 'Template',
				code: `
				<template>
					<VTextField
						:rules="[isDateValidCustom]"
						label="Date"
						validate-on="eager blur"
						variant="outlined"
					/>
				</template>
				`,
			},
		],
	},
}
