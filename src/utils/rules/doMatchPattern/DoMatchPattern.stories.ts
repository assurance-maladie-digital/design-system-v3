import type { StoryObj } from '@storybook/vue3'
import { VTextField } from 'vuetify/components'
import { doMatchPatternFn } from './index'

export default {
	title: 'Guide du dev/Règles De Validation/doMatchPattern',
	component: doMatchPatternFn,
}

export const Default: StoryObj<unknown> = {
	render: () => {
		return {
			components: { VTextField },
			setup() {
				const matchTwoDigits = doMatchPatternFn(/^[0-9]{2}$/)
				return { matchTwoDigits }
			},
			template: `
				<VTextField
					:rules="[matchTwoDigits]"
					label="Deux chiffres"
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
					import { doMatchPatternFn } from '@cnamts/synapse'

					const matchTwoDigits = doMatchPatternFn(/^[0-9]{2}$/)
				</script>
				`,
			},
			{
				name: 'Template',
				code: `
				<template>
					<VTextField
						:rules="[matchTwoDigits]"
						label="Deux chiffres"
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
				const twoDigits = doMatchPatternFn(
					/^[0-9]{2}$/,
					{ default: 'Veuillez saisir deux chiffres.' },
				)
				return { twoDigits }
			},
			template: `
				<VTextField
					:rules="[twoDigits]"
					label="Deux chiffres"
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
					import { doMatchPatternFn } from '@cnamts/synapse'

					const twoDigits = doMatchPatternFn(
						/^[0-9]{2}$/,
						{ default: 'Veuillez saisir deux chiffres.' },
					)
				</script>
				`,
			},
			{
				name: 'Template',
				code: `
				<template>
					<VTextField
						:rules="[twoDigits]"
						label="Deux chiffres"
						variant="outlined"
					/>
				</template>
				`,
			},
		],
	},
}
