import type { StoryObj } from '@storybook/vue3'
import { VTextField } from 'vuetify/components'
import { isMaxLengthFn } from './index'

export default {
	title: 'Guide du dev/Règles De Validation/isMaxLength',
	component: isMaxLengthFn,
}

export const Default: StoryObj<unknown> = {
	render: () => {
		return {
			components: { VTextField },
			setup() {
				const max5 = isMaxLengthFn(5)
				return { max5 }
			},
			template: `
				<VTextField
					:rules="[max5]"
					label="Max 5 caractères"
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
					import { isMaxLengthFn } from '@cnamts/synapse'

					const max5 = isMaxLengthFn(5)
				</script>
				`,
			},
			{
				name: 'Template',
				code: `
				<template>
					<VTextField
						:rules="[max5]"
						label="Max 5 caractères"
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
				const max5 = isMaxLengthFn(5, true)
				return { max5 }
			},
			template: `
				<VTextField
					:rules="[max5]"
					label="Max 5 caractères, ignore les espaces"
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
					import { isMaxLengthFn } from '@cnamts/synapse'

					const max5 = isMaxLengthFn(5, true)
				</script>
				`,
			},
			{
				name: 'Template',
				code: `
				<template>
					<VTextField
						:rules="[max5]"
						label="Max 5 caractères, ignore les espaces"
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
					default: max => `The text entered is too long, it must be ${max} characters or less`,
				}
				const max5 = isMaxLengthFn(5, false, messages)
				return { max5 }
			},
			template: `
				<VTextField
					:rules="[max5]"
					label="Max 5 characters"
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
					import { isMaxLengthFn } from '@cnamts/synapse'

					const messages = {
						default: max => \`The text entered is too long, it must be \${max} characters or less\`,
					}
					const max5 = isMaxLengthFn(5, false, messages)
				</script>
				`,
			},
			{
				name: 'Template',
				code: `
				<template>
					<VTextField
						:rules="[max5]"
						label="Max 5 characters"
						variant="outlined"
					/>
				</template>
				`,
			},
		],
	},
}
