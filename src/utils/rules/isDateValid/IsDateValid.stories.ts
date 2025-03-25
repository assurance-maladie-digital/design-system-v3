import type { StoryObj } from '@storybook/vue3'
import { VTextField } from 'vuetify/components'
import { isDateValid, isDateValidFn } from './index'
import { ref } from 'vue'

export default {
	title: 'Règles De Validation/isDateValid',
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
				const dateValid = isDateValidFn({
					default: 'التاريخ الذي أدخلته غير صالح',
					wrongFormat: 'التنسيق الذي أدخلته غير صالح',
					monthNotMatch: 'اليوم الذي أدخلته يتجاوز عدد الأيام في الشهر المقابل',
					notALeapYear: 'اليوم الذي أدخلته غير صالح لأن السنة المقابلة ليست سنة كبيسة',
				})
				return { dateValid }
			},
			template: `
				<VTextField
					:rules="[dateValid]"
					label="تاريخ الصلاحية"
					validate-on="blur"
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
					
					const isDateValidCustom = isDateValid({
						default: 'التاريخ الذي أدخلته غير صالح',
						wrongFormat: 'التنسيق الذي أدخلته غير صالح',
						monthNotMatch: 'اليوم الذي أدخلته يتجاوز عدد الأيام في الشهر المقابل',
						notALeapYear: 'اليوم الذي أدخلته غير صالح لأن السنة المقابلة ليست سنة كبيسة',
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
						label="تاريخ الصلاحية"
						validate-on="blur"
						variant="outlined"
					/>
				</template>
				`,
			},
		],
	},
}
