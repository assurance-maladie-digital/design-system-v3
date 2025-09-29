import type { Meta, StoryObj } from '@storybook/vue3'
import AmeliproDisclosure from './AmeliproDisclosure.vue'

const meta = {
	argTypes: {
		default: { description: 'Contenu du panneau dépliant' },
		isOpen: { description: 'Défini si le panneau dépliant est ouvert au chargement du composant' },
		title: { description: 'Titre du panneau dépliant' },
		uniqueId: { description: 'Identifiant unique du panneau dépliant' },
	},
	component: AmeliproDisclosure,
	title: 'Composants/Amelipro/Blocs dépliants/AmeliproDisclosure',
} as Meta<typeof AmeliproDisclosure>

export default meta

type Story = StoryObj<typeof AmeliproDisclosure>

export const Default: Story = {
	args: {
		default: '[Slot: default]',
		title: 'Mon titre',
		uniqueId: 'amelipro-disclosure-unique-id',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<AmeliproDisclosure
		title="Mon titre"
		unique-id="amelipro-disclosure-unique-id"
	>
		[Slot: default]
	</AmeliproDisclosure>
</template>`,
			},
			{
				name: 'Scripts',
				code: `<script setup lang="ts">
	import { AmeliproDisclosure } from '@cnamts/synapse'
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproDisclosure },
		setup() {
			return { args }
		},
		template: `
<AmeliproDisclosure
	v-bind="args"
>
	{{ args.default }}
</AmeliproDisclosure>`,
	}),
}

// --- Panneau ouvert par défaut ---
export const OpenByDefault: Story = {
	args: {
		default: '[Slot: default]',
		title: 'Ouvert par défaut',
		uniqueId: 'amelipro-disclosure-open',
		isOpen: true,
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <p>Le panneau dépliant est ouvert au chargement grâce à la prop <code>isOpen</code>.</p>
  <AmeliproDisclosure
    title="Ouvert par défaut"
    unique-id="amelipro-disclosure-open"
    :is-open="true"
  >
    [Slot: default]
  </AmeliproDisclosure>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
  import { AmeliproDisclosure } from '@cnamts/synapse'
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproDisclosure },
		setup() { return { args } },
		template: `
<p class="mb-2">Le panneau dépliant est ouvert au chargement grâce à la prop <code>isOpen</code>.</p>
<AmeliproDisclosure v-bind="args">
  {{ args.default }}
</AmeliproDisclosure>
`,
	}),
}

// --- Contenu personnalisé complexe ---
export const CustomContent: Story = {
	args: {
		title: 'Contenu personnalisé',
		uniqueId: 'amelipro-disclosure-custom',
		isOpen: false,
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <p>Le slot <code>default</code> permet d’ajouter un contenu totalement personnalisé dans le panneau.</p>
  <AmeliproDisclosure
    title="Contenu personnalisé"
    unique-id="amelipro-disclosure-custom"
  >
    <ul>
      <li>Premier élément</li>
      <li>Deuxième élément</li>
      <li>Troisième élément</li>
    </ul>
  </AmeliproDisclosure>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
  import { AmeliproDisclosure } from '@cnamts/synapse'
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproDisclosure },
		setup() { return { args } },
		template: `
<p class="mb-2">Le slot <code>default</code> permet d’ajouter un contenu totalement personnalisé dans le panneau.</p>
<AmeliproDisclosure v-bind="args">
  <ul>
    <li>Premier élément</li>
    <li>Deuxième élément</li>
    <li>Troisième élément</li>
  </ul>
</AmeliproDisclosure>
`,
	}),
}
