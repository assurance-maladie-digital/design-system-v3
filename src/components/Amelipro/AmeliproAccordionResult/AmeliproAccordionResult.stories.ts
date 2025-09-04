import type { Meta, StoryObj } from '@storybook/vue3'
import AmeliproAccordionResult from './AmeliproAccordionResult.vue'

const meta = {
	argTypes: {
		accordionContent: { description: 'Contenu du panneau dépliant' },
		borderColor: { description: 'Couleur de bordure du panneau dépliant' },
		bordered: { description: 'Défini une bordure au panneau dépliant' },
		headingContent: { description: 'Contenu du header du panneau dépliant' },
		hideSeparator: { description: 'Masque le séparateur entre le titre et le contenu des panneaux dépliants' },
		isOpen: { description: 'Défini si le panneau dépliant est ouvert au chargement du composant' },
		uniqueId: { description: 'Identifiant unique du panneau dépliant' },
	},
	component: AmeliproAccordionResult,
	title: 'Composants/Amelipro/Blocs dépliants/AmeliproAccordionResult',
} as Meta<typeof AmeliproAccordionResult>

export default meta

type Story = StoryObj<typeof AmeliproAccordionResult>

export const Default: Story = {
	args: {
		accordionContent: '[Slot: accordionContent]',
		headingContent: '[Slot: headingContent]',
		uniqueId: 'amelipro-accordion-result-unique-id',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<AmeliproAccordionResult
		class="w-100"
		unique-id="amelipro-accordion-result-unique-id"
	>
		<template #headingContent>
			[Slot: headingContent]
		</template>

		<template #accordionContent>
			[Slot: accordionContent]
		</template>
	</AmeliproAccordionResult>
</template>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproAccordionResult },
		setup() {
			return { args }
		},
		template: `
<AmeliproAccordionResult
	class="w-100"
	v-bind="args"
>
	<template #headingContent>
		[Slot: headingContent]
	</template>

	<template #accordionContent>
		[Slot: accordionContent]
	</template>
</AmeliproAccordionResult>`,
	}),
}
