import type { Meta, StoryObj } from '@storybook/vue3'
import PageContainer from './PageContainer.vue'
import { VCard } from 'vuetify/components'

const meta = {
	title: 'Components/PageContainer',
	component: PageContainer,
	parameters: {
		layout: 'fullscreen',
		controls: { exclude: ['spacingClass', 'containerSize'] },
	},
	argTypes: {
		size: {
			options: ['xl', 'l', 'm', 's'],
			control: { type: 'select' },
			default: 'xl',
		},
		spacing: {
			options: ['xs', 'sm', 'md', 'lg', 'xl'],
			control: { type: 'select' },
			default: undefined,
		},
		color: {
			options: ['transparent', 'primary', 'secondary', 'accent', 'error', 'info', 'success', 'warning'],
			control: { type: 'select' },
			default: 'transparent',
		},
	},
} as Meta<typeof PageContainer>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<PageContainer>
		Contenu de la page
	</PageContainer>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import PageContainer from '@cnamts/synapse'
</script>
				`,
			},
		],
	},
	args: {
		default: 'Contenu de la page',
	},
	render: (args) => {
		return {
			components: { PageContainer },
			setup() {
				return { args }
			},
			template: `
                <PageContainer :size="args.size" :spacing="args.spacing" :color="args.color">
					{{ args.default }}
                </PageContainer>
            `,
		}
	},
}

export const Size: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<PageContainer size="s">
		Contenu de la page
	</PageContainer>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import PageContainer from '@cnamts/synapse'
</script>
				`,
			},
		],
	},
	args: {
		default: 'Contenu de la page',
		size: 's',
	},
	render: (args) => {
		return {
			components: { PageContainer },
			setup() {
				return { args }
			},
			template: `
				<PageContainer :size="args.size" :spacing="args.spacing" :color="args.color">
					{{ args.default }}
				</PageContainer>
			`,
		}
	},
}

export const Color: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<PageContainer color="primary">
		<div class="pa-8">
			Contenu de la page
		</div>
	</PageContainer>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import PageContainer from '@cnamts/synapse'
</script>
				`,
			},
		],
	},
	args: {
		default: 'Contenu de la page',
		color: 'primary',
	},
	render: (args) => {
		return {
			components: { PageContainer },
			setup() {
				return { args }
			},
			template: `
				<PageContainer :size="args.size" :spacing="args.spacing" :color="args.color">
					<div class="pa-8">
						{{ args.default }}
					</div>
				</PageContainer>
			`,
		}
	},
}

export const Card: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<PageContainer>
		<VCard class="pa-8">
			Contenu de la page
		</VCard>
	</PageContainer>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import PageContainer from '@cnamts/synapse'
	import { VCard } from 'vuetify/components'
</script>
				`,
			},
		],
	},
	args: {
		default: 'Contenu de la page',
	},
	render: (args) => {
		return {
			components: { PageContainer, VCard },
			setup() {
				return { args }
			},
			template: `
				<PageContainer :size="args.size" :spacing="args.spacing" :color="args.color">
					<VCard class="pa-8">
						{{ args.default }}
					</VCard>
				</PageContainer>
			`,
		}
	},
}
