import type { StoryObj } from '@storybook/vue3'
import { VTextField } from 'vuetify/components'
import { isRequired, isRequiredFn } from '.'

export default {
	title: 'Règles De Validation/isRequired',
	component: isRequiredFn,
}

export const Default: StoryObj<unknown> = {
	render: () => {
		return {
			components: { VTextField },
			setup() {
				return { isRequired }
			},
			template: `
				<VTextField
					:rules="[isRequired]"
					label="Champ requis"
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
					import { isRequired } from '@cnamts/synapse'
				</script>
				`,
			},
			{
				name: 'Template',
				code: `
				<template>
					<VTextField
						:rules="[isRequired]"
						label="Champ requis"
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
				const isRequiredCustom = isRequiredFn({
					default: 'This field is required',
				})
				return { isRequiredCustom }
			},
			template: `
				<VTextField
					:rules="[isRequiredCustom]"
					label="Required"
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
					import { isRequiredFn } from '@cnamts/synapse'

					const required = isRequiredFn({
						default: 'This field is required',
					})
				</script>
				`,
			},
			{
				name: 'Template',
				code: `
				<template>
					<VTextField
						:rules="[required]"
						label="Required"
						variant="outlined"
					/>
				</template>
				`,
			},
		],
	},
}
