import type { Meta, StoryObj } from '@storybook/vue3'
import FranceConnectBtn from './FranceConnectBtn.vue'

const meta = {
	title: 'Composants/Boutons/FranceConnectBtn',
	component: FranceConnectBtn,
	parameters: {
		layout: 'fullscreen',
	},
} satisfies Meta<typeof FranceConnectBtn>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<FranceConnectBtn />
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import FranceConnectBtn from '@cnamts/synapse'
</script>
				`,
			},
		],
	},
	args: {
		href: 'https://app.franceconnect.gouv.fr/',
		isConnectPlus: false,
		dark: false,
	},
	render: (args) => {
		return {
			components: { FranceConnectBtn },
			setup() {
				return { args }
			},
			template: `
				<div class="d-flex flex-wrap align-center pa-4">
					<FranceConnectBtn
						:href="args.href"
						:is-connect-plus="args.isConnectPlus"
						:dark="args.dark"
					/>
              	</div>
			`,
		}
	},
}

export const FranceConnectPlus: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<FranceConnectBtn is-connect-plus />
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import FranceConnectBtn from '@cnamts/synapse'
</script>
				`,
			},
		],
	},
	args: {
		href: 'https://app.franceconnect.gouv.fr/',
		isConnectPlus: true,
		dark: false,
	},
	render: (args) => {
		return {
			components: { FranceConnectBtn },
			setup() {
				return { args }
			},
			template: `
				<div class="d-flex flex-wrap align-center pa-4">
					<FranceConnectBtn
						:href="args.href"
						:is-connect-plus="args.isConnectPlus"
						:dark="args.dark"
					/>
              	</div>
			`,
		}
	},
}

export const DarkTheme: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<FranceConnectBtn 
		is-connect-plus 
		dark
	/>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import FranceConnectBtn from '@cnamts/synapse'
</script>
				`,
			},
		],
	},
	args: {
		href: 'https://app.franceconnect.gouv.fr/',
		isConnectPlus: true,
		dark: true,
	},
	render: (args) => {
		return {
			components: { FranceConnectBtn },
			setup() {
				return { args }
			},
			template: `
                <VThemeProvider
                    theme="dark"
                    with-background
                    class="pa-4"
                >
                    <FranceConnectBtn
						:href="args.href"
						:is-connect-plus="args.isConnectPlus"
						:dark="args.dark"
					/>
                </VThemeProvider>`,
		}
	},
}
