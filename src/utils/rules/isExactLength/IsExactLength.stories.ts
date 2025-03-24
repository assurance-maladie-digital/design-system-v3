import type { StoryObj } from '@storybook/vue3'
import { VTextField } from 'vuetify/components'
import { isExactLengthFn } from './index'

export default {
	title: 'RèglesDeValidation/isExactLength',
	component: isExactLengthFn,
}

export const Default: StoryObj<unknown> = {
	render: () => {
		return {
			components: { VTextField },
			setup() {
				const max10 = isExactLengthFn(10)
				return { max10 }
			},
			template: `
				<VTextField
					:rules="[max10]"
					label="Max 10 characters"
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

					const max10 = isExactLengthFn(10)
				</script>
				`,
			},
			{
				name: 'Template',
				code: `
				<template>
					<VTextField
						:rules="[max10]"
						label="Max 10 characters"
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
				const max10 = isExactLengthFn(10, true)
				return { max10 }
			},
			template: `
				<VTextField
					:rules="[max10]"
					label="Max 10 characters"
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

					const max10 = isExactLengthFn(10, true)
				</script>
				`,
			},
			{
				name: 'Template',
				code: `
				<template>
					<VTextField
						:rules="[max10]"
						label="Max 10 characters"
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
					default: (length: number) => `此字段的长度必须正好为 ${length} 个字符。`,
				}
				const max10 = isExactLengthFn(10, false, messages)
				return { max10 }
			},
			template: `
				<VTextField
					:rules="[max10]"
					label="此字段必须为 10 个字符。"
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
						default: (length: number) => \`此字段的长度必须正好为 \${length} 个字符。\`,
					}
					const max10 = isExactLengthFn(10, false, messages)
				</script>
				`,
			},
			{
				name: 'Template',
				code: `
				<template>
					<VTextField
						:rules="[max10]"
						label="此字段必须为 10 个字符。"
					/>
				</template>
				`,
			},
		],
	},
}
