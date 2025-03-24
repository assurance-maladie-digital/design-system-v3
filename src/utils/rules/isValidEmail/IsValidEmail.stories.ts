import type { StoryObj } from '@storybook/vue3'
import { VTextField } from 'vuetify/components'
import { isValidEmail, isValidEmailFn } from './index'

export default {
	title: 'RèglesDeValidation/isValidEmail',
	component: isValidEmailFn,
}

export const Default: StoryObj<unknown> = {
	render: () => {
		return {
			components: { VTextField },
			setup() {
				return { isValidEmail }
			},
			template: `
				<VTextField
					:rules="[isValidEmail]"
					label="Email"
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
					import { isValidEmail } from '@cnamts/synapse'
				</script>
				`,
			},
			{
				name: 'Template',
				code: `
				<template>
					<VTextField
						:rules="[isValidEmail]"
						label="Email"
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
				const email = isValidEmailFn({
					default: '请输入有效的电子邮件地址。',
				})
				return { email }
			},
			template: `
				<VTextField
					:rules="[email]"
					label="电子邮件"
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
					import { isValidEmailFn } from '@cnamts/synapse'

					const email = isValidEmailFn({
						default: '请输入有效的电子邮件地址。',
					})
				</script>
				`,
			},
			{
				name: 'Template',
				code: `
				<template>
					<VTextField
						:rules="[email]"
						label="电子邮件"
					/>
				</template>
				`,
			},
		],
	},
}
