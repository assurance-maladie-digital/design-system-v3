import type { Meta, StoryObj } from '@storybook/vue3'
import AmeliproAccordionResult from './AmeliproAccordionResult.vue'
import { fn } from '@storybook/test'

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
		'accordionContent': '[Slot: accordionContent]',
		'headingContent': '[Slot: headingContent]',
		'uniqueId': 'amelipro-accordion-result-unique-id',
		'onOpen-close': fn(),
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
	@open-close="args['onOpen-close']"
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
// --- Panneau ouvert par défaut ---
export const OpenByDefault: Story = {
	args: {
		headingContent: 'Titre ouvert par défaut',
		accordionContent: 'Contenu affiché car le panneau est ouvert.',
		uniqueId: 'amelipro-accordion-result-open',
		isOpen: true,
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <p>Le panneau est ouvert au chargement grâce à la prop <code>isOpen</code>.</p>
  <AmeliproAccordionResult
    class="w-100"
    unique-id="amelipro-accordion-result-open"
    :is-open="true"
  >
    <template #headingContent>
      Titre ouvert par défaut
    </template>
    <template #accordionContent>
      Contenu affiché car le panneau est ouvert.
    </template>
  </AmeliproAccordionResult>
</template>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproAccordionResult },
		setup() { return { args } },
		template: `
<p class="mb-2">Le panneau est ouvert au chargement grâce à la prop <code>isOpen</code>.</p>
<AmeliproAccordionResult
  class="w-100"
  v-bind="args"
>
  <template #headingContent>
    {{ args.headingContent }}
  </template>
  <template #accordionContent>
    {{ args.accordionContent }}
  </template>
</AmeliproAccordionResult>
`,
	}),
}

// --- Bordure et couleur personnalisées ---
export const BorderedColored: Story = {
	args: {
		headingContent: 'Bordure et couleur',
		accordionContent: 'Contenu avec bordure et couleur personnalisées.',
		uniqueId: 'amelipro-accordion-result-colored',
		bordered: true,
		borderColor: '#1976d2',
		cardColor: '#e3f2fd',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <p>Bordure et couleur personnalisées grâce aux props <code>bordered</code>, <code>borderColor</code> et <code>cardColor</code>.</p>
  <AmeliproAccordionResult
    class="w-100"
    unique-id="amelipro-accordion-result-colored"
    bordered
    border-color="#1976d2"
    card-color="#e3f2fd"
  >
    <template #headingContent>
      Bordure et couleur
    </template>
    <template #accordionContent>
      Contenu avec bordure et couleur personnalisées.
    </template>
  </AmeliproAccordionResult>
</template>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproAccordionResult },
		setup() { return { args } },
		template: `
<p class="mb-2">Bordure et couleur personnalisées grâce aux props <code>bordered</code>, <code>borderColor</code> et <code>cardColor</code>.</p>
<AmeliproAccordionResult
  class="w-100"
  v-bind="args"
>
  <template #headingContent>
    {{ args.headingContent }}
  </template>
  <template #accordionContent>
    {{ args.accordionContent }}
  </template>
</AmeliproAccordionResult>
`,
	}),
}

// --- Masquer le séparateur ---
export const HideSeparator: Story = {
	args: {
		headingContent: 'Sans séparateur',
		accordionContent: 'Le séparateur est masqué.',
		uniqueId: 'amelipro-accordion-result-nosep',
		hideSeparator: true,
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <p>Le séparateur entre le titre et le contenu est masqué grâce à la prop <code>hideSeparator</code>.</p>
  <AmeliproAccordionResult
    class="w-100"
    unique-id="amelipro-accordion-result-nosep"
    hide-separator
  >
    <template #headingContent>
      Sans séparateur
    </template>
    <template #accordionContent>
      Le séparateur est masqué.
    </template>
  </AmeliproAccordionResult>
</template>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproAccordionResult },
		setup() { return { args } },
		template: `
<p class="mb-2">Le séparateur entre le titre et le contenu est masqué grâce à la prop <code>hideSeparator</code>.</p>
<AmeliproAccordionResult
  class="w-100"
  v-bind="args"
>
  <template #headingContent>
    {{ args.headingContent }}
  </template>
  <template #accordionContent>
    {{ args.accordionContent }}
  </template>
</AmeliproAccordionResult>
`,
	}),
}

// --- Contenu personnalisé complexe ---
export const CustomContent: Story = {
	args: {
		headingContent: 'Contenu personnalisé',
		uniqueId: 'amelipro-accordion-result-custom',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <p>Le slot <code>accordionContent</code> permet d’ajouter un contenu totalement personnalisé.</p>
  <AmeliproAccordionResult
    class="w-100"
    unique-id="amelipro-accordion-result-custom"
  >
    <template #headingContent>
      Contenu personnalisé
    </template>
    <template #accordionContent>
      <ul>
        <li>Premier élément</li>
        <li>Deuxième élément</li>
        <li>Troisième élément</li>
      </ul>
    </template>
  </AmeliproAccordionResult>
</template>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproAccordionResult },
		setup() { return { args } },
		template: `
<p class="mb-2">Le slot <code>accordionContent</code> permet d’ajouter un contenu totalement personnalisé.</p>
<AmeliproAccordionResult
  class="w-100"
  v-bind="args"
>
  <template #headingContent>
    {{ args.headingContent }}
  </template>
  <template #accordionContent>
    <ul>
      <li>Premier élément</li>
      <li>Deuxième élément</li>
      <li>Troisième élément</li>
    </ul>
  </template>
</AmeliproAccordionResult>
`,
	}),
}
