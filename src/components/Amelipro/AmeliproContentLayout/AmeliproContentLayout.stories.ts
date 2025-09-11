import type { Meta, StoryObj } from '@storybook/vue3'
import AmeliproContentLayout from './AmeliproContentLayout.vue'

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
