import type { StoryObj } from '@storybook/vue3'
import { VTextField } from 'vuetify/components'
import { isMinLengthFn } from './index'

export default {
	title: 'Guide du dev/Règles De Validation/isMinLength',
	component: isMinLengthFn,
}

export const Default: StoryObj<unknown> = {
	render: () => {
		return {
			components: { VTextField },
			setup() {
				const min5 = isMinLengthFn(5)
				return { min5 }
			},
			template: `
				<VTextField
					:rules="[min5]"
					label="Min 5 caractères"
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
					import { isMinLengthFn } from '@cnamts/synapse'

					const min5 = isMinLengthFn(5)
				</script>
				`,
			},
			{
				name: 'Template',
				code: `
				<template>
					<VTextField
						:rules="[min5]"
						label="Min 5 caractères"
						variant="outlined"
					/>
				</template>
				`,
			},
		],
	},
}

export const ignoreSpaces: StoryObj<unknown> = {
	render: () => {
		return {
			components: { VTextField },
			setup() {
				const min5 = isMinLengthFn(5, true)
				return { min5 }
			},
			template: `
				<VTextField
					:rules="[min5]"
					label="Min 5 caractères, ignore les espaces"
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
					import { isMinLengthFn } from '@cnamts/synapse'

					const min5 = isMinLengthFn(5, true)
				</script>
				`,
			},
			{
				name: 'Template',
				code: `
				<template>
					<VTextField
						:rules="[min5]"
						label="Min 5 caractères, ignore les espaces"
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
					default: min => `The text entered is too short, it must be ${min} characters or more`,
				}
				const min5 = isMinLengthFn(5, false, messages)
				return { min5 }
			},
			template: `
				<VTextField
					:rules="[min5]"
					label="Min 5 characters"
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
					import { isMinLengthFn } from '@cnamts/synapse'

					const messages = {
						default: min => \`The text entered is too long, it must be \${min} characters or less\`,
					}
					const min5 = isMinLengthFn(5, false, messages)
				</script>
				`,
			},
			{
				name: 'Template',
				code: `
				<template>
					<VTextField
						:rules="[min5]"
						label="Min 5 characters"
						variant="outlined"
					/>
				</template>
				`,
			},
		],
	},
}
