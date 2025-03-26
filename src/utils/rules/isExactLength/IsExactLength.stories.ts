import type { StoryObj } from '@storybook/vue3'
import { VTextField } from 'vuetify/components'
import { isExactLengthFn } from './index'

export default {
	title: 'Guide du dev/Règles De Validation/isExactLength',
	component: isExactLengthFn,
}

export const Default: StoryObj<unknown> = {
	render: () => {
		return {
			components: { VTextField },
			setup() {
				const length10 = isExactLengthFn(10)
				return { length10 }
			},
			template: `
				<VTextField
					:rules="[length10]"
					label="Max 10 characters"
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
					import { isExactLengthFn } from '@cnamts/synapse'

					const length10 = isExactLengthFn(10)
				</script>
				`,
			},
			{
				name: 'Template',
				code: `
				<template>
					<VTextField
						:rules="[length10]"
						label="Max 10 characters"
						variant="outlined"
					/>
				</template>
				`,
			},
		],
	},
}

export const DoNotCountSpaces: StoryObj<unknown> = {
	render: () => {
		return {
			components: { VTextField },
			setup() {
				const length10 = isExactLengthFn(10, true)
				return { length10 }
			},
			template: `
				<VTextField
					:rules="[length10]"
					label="Max 10 characters"
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
					import { isExactLengthFn } from '@cnamts/synapse'

					const length10 = isExactLengthFn(10, true)
				</script>
				`,
			},
			{
				name: 'Template',
				code: `
				<template>
					<VTextField
						:rules="[length10]"
						label="Max 10 characters"
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
					default: (length: number) => `The length of this field must be exactly ${length} characters.`,
				}
				const length10 = isExactLengthFn(10, false, messages)
				return { length10 }
			},
			template: `
				<VTextField
					:rules="[length10]"
					label="This field must be 10 characters long."
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
					import { isExactLengthFn } from '@cnamts/synapse'

					const messages = {
						default: (length: number) => \`The length of this field must be exactly \${length} characters.\`,
					}
					const length10 = isExactLengthFn(10, false, messages)
				</script>
				`,
			},
			{
				name: 'Template',
				code: `
				<template>
					<VTextField
						:rules="[length10]"
						label="This field must be 10 characters long."
						variant="outlined"
					/>
				</template>
				`,
			},
		],
	},
}
