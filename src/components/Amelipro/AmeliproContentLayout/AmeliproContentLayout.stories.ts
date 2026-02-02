import type { Meta, StoryObj } from '@storybook/vue3'
import AmeliproContentLayout from './AmeliproContentLayout.vue'
import AmeliproMessage from '../AmeliproMessage/AmeliproMessage.vue'

const meta = {
	argTypes: {
		bgColor: { description: 'Couleur de fond du contenu' },
		default: { description: 'Slot par défaut' },
		uniqueId: { description: 'Identifiant unique du composant' },
	},
	component: AmeliproContentLayout,
	title: 'Composants/Amelipro/Mise en page/AmeliproContentLayout',
} as Meta<typeof AmeliproContentLayout>
export default meta

type Story = StoryObj<typeof AmeliproContentLayout>

export const Default: Story = {
	args: { default: 'Mon contenu test' },
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<AmeliproContentLayout />
</template>
				`,
			},
		],
	},
	render: args => ({
		components: { AmeliproContentLayout },
		setup() {
			return { args }
		},
		template: `
<AmeliproContentLayout
	v-bind="args"
>
	{{ args.default }}
</AmeliproContentLayout>
		`,
	}),
}

export const Info: Story = {
	render: (args) => {
		return {
			components: { AmeliproMessage },
			setup() {
				return { args }
			},
			template: `
			  <AmeliproMessage :closable="false" class="mb-4" type="warning">
				<strong>Ce composant est déprécié</strong>, il ne sera plus maintenu ou mis à jour.
				Nous vous recommandons d'utiliser à la place le composant <strong><a href='https://cnam-design-system.netlify.app/?path=/docs/composants-layout-pagecontainer--docs'>PageContainer</a></strong>.
			  </AmeliproMessage>
			`,
		}
	},
	tags: ['!dev'],
}
