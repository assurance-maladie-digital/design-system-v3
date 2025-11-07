import type { Meta, StoryObj } from '@storybook/vue3'
import AmeliproAccordion from './AmeliproAccordion.vue'
import { fn } from '@storybook/test'

const meta = {
	argTypes: {
		accordionTitle: { description: 'Titre du panneau dépliant' },
		borderColor: { description: 'Couleur de bordure du panneau dépliant' },
		bordered: { description: 'Défini une bordure au panneau dépliant' },
		cardColor: { description: 'Couleur de fond du panneau dépliant' },
		default: { description: 'Contenu du panneau dépliant' },
		headerRight: { description: 'Partie droite du header du panneau dépliant' },
		headerRightWidth: { description: 'Défini la largeur de la partie droite du header de la carte. Cette props est utile seulement si le slot headerRight est utilisé' },
		hideSeparator: { description: 'Masque le séparateur entre le titre et le contenu des panneaux dépliants' },
		isOpen: { description: 'Défini si le panneau dépliant est ouvert au chargement du composant' },
		openClose: { description: 'Fonction permettant d’ouvrir ou fermer l’accordéon', type: 'void' },
		titleLevel: { description: 'Niveau du titre du panneau dépliant' },
		titleUppercase: { description: 'Transforme le titre du panneau dépliant en lettres capitales' },
		uniqueId: { description: 'Identifiant unique du panneau dépliant' },
	},
	component: AmeliproAccordion,
	title: 'Composants/Amelipro/Blocs dépliants/AmeliproAccordion',
} as Meta<typeof AmeliproAccordion>
export default meta

type Story = StoryObj<typeof AmeliproAccordion>

export const Default: Story = {
	args: {
		'accordionTitle': 'Mon titre',
		'default': '[Slot: default]',
		'headerRight': '[Slot: headerRight]',
		'uniqueId': 'amelipro-accordion-unique-id',
		'onOpen-close': fn(),
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<AmeliproAccordion
		accordion-title="Mon titre"
		class="w-100"
		unique-id="amelipro-accordion-unique-id"
	>
		<template #default>
			[Slot: default]
		</template>

		<template #headerRight>
			[Slot: headerRight]
		</template>
	</AmeliproAccordion>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { AmeliproAccordion } from '@cnamts/synapse'
</script>
				`,
			},
		],
	},
	render: args => ({
		components: { AmeliproAccordion },
		setup() {
			return { args }
		},
		template: `
<AmeliproAccordion
	class="w-100"
	v-bind="args"
	@open-close="args['onOpen-close']"
>
	<template #default>
		{{ args.default }}
	</template>

	<template #headerRight>
		{{ args.headerRight }}
	</template>
</AmeliproAccordion>
`,
	}),
}

// --- Panneau ouvert par défaut ---
export const OpenByDefault: Story = {
	args: {
		accordionTitle: 'Ouvert par défaut',
		default: '[Slot: default]',
		uniqueId: 'amelipro-accordion-open',
		isOpen: true,
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <p>Le panneau dépliant est ouvert au chargement grâce à la prop <code>isOpen</code>.</p>
  <AmeliproAccordion
    accordion-title="Ouvert par défaut"
    unique-id="amelipro-accordion-open"
    :is-open="true"
  >
    <template #default>
      [Slot: default]
    </template>
  </AmeliproAccordion>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
  import { AmeliproAccordion } from '@cnamts/synapse'
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproAccordion },
		setup() {
			return { args }
		},
		template: `
<p class="mb-2">Le panneau dépliant est ouvert au chargement grâce à la prop <code>isOpen</code>.</p>
<AmeliproAccordion v-bind="args">
  <template #default>
    {{ args.default }}
  </template>
</AmeliproAccordion>
`,
	}),
}

// --- Bordure et couleur personnalisées ---
export const BorderedColored: Story = {
	args: {
		accordionTitle: 'Bordure et couleur',
		default: '[Slot: default]',
		uniqueId: 'amelipro-accordion-colored',
		bordered: true,
		borderColor: '#1976d2',
		cardColor: '#e3f2fd',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <p>Le panneau dépliant possède une bordure et une couleur de fond personnalisées grâce aux props <code>bordered</code>, <code>borderColor</code> et <code>cardColor</code>.</p>
  <AmeliproAccordion
    accordion-title="Bordure et couleur"
    unique-id="amelipro-accordion-colored"
    bordered
    border-color="#1976d2"
    card-color="#e3f2fd"
  >
    <template #default>
      [Slot: default]
    </template>
  </AmeliproAccordion>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
  import { AmeliproAccordion } from '@cnamts/synapse'
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproAccordion },
		setup() {
			return { args }
		},
		template: `
<p class="mb-2">Le panneau dépliant possède une bordure et une couleur de fond personnalisées grâce aux props <code>bordered</code>, <code>borderColor</code> et <code>cardColor</code>.</p>
<AmeliproAccordion v-bind="args">
  <template #default>
    {{ args.default }}
  </template>
</AmeliproAccordion>
`,
	}),
}

// --- Masquer le séparateur ---
export const HideSeparator: Story = {
	args: {
		accordionTitle: 'Sans séparateur',
		default: '[Slot: default]',
		uniqueId: 'amelipro-accordion-nosep',
		hideSeparator: true,
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <p>Le séparateur entre le titre et le contenu est masqué grâce à la prop <code>hideSeparator</code>.</p>
  <AmeliproAccordion
    accordion-title="Sans séparateur"
    unique-id="amelipro-accordion-nosep"
    hide-separator
  >
    <template #default>
      [Slot: default]
    </template>
  </AmeliproAccordion>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
  import { AmeliproAccordion } from '@cnamts/synapse'
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproAccordion },
		setup() {
			return { args }
		},
		template: `
<p class="mb-2">Le séparateur entre le titre et le contenu est masqué grâce à la prop <code>hideSeparator</code>.</p>
<AmeliproAccordion v-bind="args">
  <template #default>
    {{ args.default }}
  </template>
</AmeliproAccordion>
`,
	}),
}

// --- Titre capitales et niveau ---
export const TitleUppercaseLevel: Story = {
	args: {
		accordionTitle: 'Titre capitales H3',
		default: '[Slot: default]',
		uniqueId: 'amelipro-accordion-uppercase',
		titleUppercase: true,
		titleLevel: 3,
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <p>Le titre est en capitales et utilise le niveau de titre <code>h3</code> grâce aux props <code>titleUppercase</code> et <code>titleLevel</code>.</p>
  <AmeliproAccordion
    accordion-title="Titre capitales H3"
    unique-id="amelipro-accordion-uppercase"
    title-uppercase
    :title-level="3"
  >
    <template #default>
      [Slot: default]
    </template>
  </AmeliproAccordion>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
  import { AmeliproAccordion } from '@cnamts/synapse'
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproAccordion },
		setup() {
			return { args }
		},
		template: `
<p class="mb-2">Le titre est en capitales et utilise le niveau de titre <code>h3</code> grâce aux props <code>titleUppercase</code> et <code>titleLevel</code>.</p>
<AmeliproAccordion v-bind="args">
  <template #default>
    {{ args.default }}
  </template>
</AmeliproAccordion>
`,
	}),
}

// --- Slot headerRight avec largeur personnalisée ---
export const HeaderRightWidth: Story = {
	args: {
		accordionTitle: 'Header droit personnalisé',
		default: '[Slot: default]',
		headerRight: '[Slot: headerRight]',
		uniqueId: 'amelipro-accordion-header-right',
		headerRightWidth: '200px',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <p>La partie droite du header utilise le slot <code>headerRight</code> et une largeur personnalisée via <code>headerRightWidth</code>.</p>
  <AmeliproAccordion
    accordion-title="Header droit personnalisé"
    unique-id="amelipro-accordion-header-right"
    header-right-width="200px"
  >
    <template #default>
      [Slot: default]
    </template>
    <template #headerRight>
      [Slot: headerRight]
    </template>
  </AmeliproAccordion>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
  import { AmeliproAccordion } from '@cnamts/synapse'
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproAccordion },
		setup() {
			return { args }
		},
		template: `
<p class="mb-2">La partie droite du header utilise le slot <code>headerRight</code> et une largeur personnalisée via <code>headerRightWidth</code>.</p>
<AmeliproAccordion v-bind="args">
  <template #default>
    {{ args.default }}
  </template>
  <template #headerRight>
    {{ args.headerRight }}
  </template>
</AmeliproAccordion>
`,
	}),
}
