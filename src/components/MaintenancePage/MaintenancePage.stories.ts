import type { Meta, StoryObj } from '@storybook/vue3'
import MaintenancePage from './MaintenancePage.vue'

const meta: Meta = {
	title: 'Templates/MaintenancePage',
	component: MaintenancePage,
	parameters: {
		layout: 'fullscreen',
	},
} satisfies Meta<typeof MaintenancePage>

export default meta

type Story = StoryObj<typeof MaintenancePage>

export const Default: Story = {
	decorators: [
		() => ({ template: '<div style="padding: 20px; background: rgb(231, 236, 245)"><story /></div>' }),
	],
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<div style="padding: 20px; background: rgb(231, 236, 245)">
						<MaintenancePage />
					</div>
				</template>
				`,
			}, {
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { MaintenancePage } from '@cnamts/synapse'
				</script>
				`,
			},
		],
	},
}

export const CustomIllustration: Story = {
	decorators: [
		() => ({ template: '<div style="padding: 20px; background: rgb(231, 236, 245)"><story /></div>' }),
	],
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<div style="padding: 20px; background: rgb(231, 236, 245)">
						<MaintenancePage>
							<template #illustration>
								<div style="width: 260px; height: 200px; display: grid; place-items: center; border-radius: 12px; background: white; border: 2px dashed #0D419A;">
									<span style="font-weight: 700; color: #0D419A;">Illustration</span>
								</div>
							</template>
						</MaintenancePage>
					</div>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { MaintenancePage } from '@cnamts/synapse'
				</script>
				`,
			},
		],
	},
	render: () => ({
		components: { MaintenancePage },
		template: `
			<MaintenancePage>
				<template #illustration>
					<div style="width: 260px; height: 200px; display: grid; place-items: center; border-radius: 12px; background: white; border: 2px dashed #0D419A;">
						<span style="font-weight: 700; color: #0D419A;">Illustration</span>
					</div>
				</template>
			</MaintenancePage>
		`,
	}),
}
