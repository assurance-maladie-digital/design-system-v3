import type { Meta, StoryObj } from '@storybook/vue3'
import AmeliproMailTile from './AmeliproMailTile.vue'

const meta = {
	argTypes: {
		'click': { description: 'Événement émis au click sur la partie principale de la tuile. Retourne `unique-id`.', type: 'string' },
		'editable': { description: 'Défini si le statut de la tuile peut être modifiée par l’utilisateur' },
		'mailInfo': {
			description: 'Les infos à afficher dans la tuile',
			table: {
				type: {
					detail: `{
	commentValue?: boolean;
	date: string;
	hour: string;
	href?: string;
	mailObject: string;
	messageInfoFirstLine: string;
	messageInfoSecondLine: string;
	messageInfoThirdLine?: string;
	readValue?: boolean;
	to?: RouteLocationRaw;
}`,
					summary: 'AmeliproMailTileType',
				},
			},
		},
		'status-change': { description: 'Événement émis au click sur le bouton de gauche quand qui change le statut du mail, quand la props editable est active. Retourne `unique-id`.', type: 'string' },
		'uniqueId': { description: 'Identifiant unique de la tuile' },
	},
	component: AmeliproMailTile,
	title: 'Composants/Amelipro/Tuiles/AmeliproMailTile',
} as Meta<typeof AmeliproMailTile>
export default meta

type Story = StoryObj<typeof AmeliproMailTile>

export const Default: Story = {
	args: {
		editable: true,
		mailInfo: {
			date: '28/01/2025',
			hour: '17:22',
			mailObject: 'Objet du mail',
			messageInfoFirstLine: 'Infos ligne 1',
			messageInfoSecondLine: 'Infos ligne 2',
		},
		uniqueId: 'amelipro-mail-tile-unique-id',
	},
	parameters: {
		args: {},
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<AmeliproMailTile
		:mail-info="item"
		unique-id="mail-tile"
	/>
</template>`,
			},
			{
				name: 'Scripts',
				code: `<script setup lang="ts">
	import { AmeliproMailTile } from '@cnamts/synapse'

	const item = {
		date: '25/06/2023',
		hour: '12h00',
		mailObject: 'Objet du mail',
		messageInfoFirstLine: 'infos ligne 1',
		messageInfoSecondLine: 'infos ligne 2',
		readValue: false,
	}
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproMailTile },
		setup() {
			return { args }
		},
		template: `
<AmeliproMailTile
	:editable="args.editable"
	:mail-info="args.mailInfo"
	:unique-id="args.uniqueId"
	v-bind="args"
/>`,
	}),
}

export const Commented: Story = {
	args: {
		editable: true,
		mailInfo: {
			commentValue: true,
			date: '25/06/2023',
			hour: '12h00',
			mailObject: 'Objet du mail',
			messageInfoFirstLine: 'infos ligne 1',
			messageInfoSecondLine: 'infos ligne 2',
			readValue: false,
		},
		uniqueId: 'test',
	},
	parameters: {
		args: {},
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<AmeliproMailTile
		:mail-info="item"
		unique-id="mail-tile"
	/>
</template>`,
			},
			{
				name: 'Scripts',
				code: `<script setup lang="ts">
	import { AmeliproMailTile } from '@cnamts/synapse'
	
	const item = {
		commentValue: true,
		date: '25/06/2023',
		hour: '12h00',
		mailObject: 'Objet du mail',
		messageInfoFirstLine: 'infos ligne 1',
		messageInfoSecondLine: 'infos ligne 2',
		readValue: false,
	}
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproMailTile },
		setup() {
			return { args }
		},
		template: `
<AmeliproMailTile
	:editable="args.editable"
	:mail-info="args.mailInfo"
	:unique-id="args.uniqueId"
	v-bind="args"
/>`,
	}),
}

// --- Tuile mail lue ---
export const Lue: Story = {
	name: 'Mail lu',
	args: {
		editable: true,
		mailInfo: {
			date: '01/02/2025',
			hour: '09:15',
			mailObject: 'Mail déjà lu',
			messageInfoFirstLine: 'Ligne 1',
			messageInfoSecondLine: 'Ligne 2',
			readValue: true,
		},
		uniqueId: 'amelipro-mail-tile-lue',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <AmeliproMailTile
    :mail-info="item"
    unique-id="mail-tile-lue"
  />
</template>`,
			},
			{
				name: 'Scripts',
				code: `<script setup lang="ts">
  import { AmeliproMailTile } from '@cnamts/synapse'

  const item = {
    date: '01/02/2025',
    hour: '09:15',
    mailObject: 'Mail déjà lu',
    messageInfoFirstLine: 'Ligne 1',
    messageInfoSecondLine: 'Ligne 2',
    readValue: true,
  }
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproMailTile },
		setup() { return { args } },
		template: `
<p class="mb-2">Affichage d’une tuile mail marquée comme lue (<code>readValue: true</code>).</p>
<AmeliproMailTile
  :editable="args.editable"
  :mail-info="args.mailInfo"
  :unique-id="args.uniqueId"
  v-bind="args"
/>
`,
	}),
}

// --- Tuile mail non éditable ---
export const NonEditable: Story = {
	name: 'Non éditable',
	args: {
		editable: false,
		mailInfo: {
			date: '10/03/2025',
			hour: '14:30',
			mailObject: 'Mail non éditable',
			messageInfoFirstLine: 'Ligne 1',
			messageInfoSecondLine: 'Ligne 2',
			readValue: false,
		},
		uniqueId: 'amelipro-mail-tile-non-editable',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <AmeliproMailTile
    :mail-info="item"
    :editable="false"
    unique-id="mail-tile-non-editable"
  />
</template>`,
			},
			{
				name: 'Scripts',
				code: `<script setup lang="ts">
  import { AmeliproMailTile } from '@cnamts/synapse'

  const item = {
    date: '10/03/2025',
    hour: '14:30',
    mailObject: 'Mail non éditable',
    messageInfoFirstLine: 'Ligne 1',
    messageInfoSecondLine: 'Ligne 2',
    readValue: false,
  }
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproMailTile },
		setup() { return { args } },
		template: `
<p class="mb-2">Affichage d’une tuile mail non éditable (<code>editable: false</code>).</p>
<AmeliproMailTile
  :editable="args.editable"
  :mail-info="args.mailInfo"
  :unique-id="args.uniqueId"
  v-bind="args"
/>
`,
	}),
}

// --- Tuile mail avec 3 lignes d’infos ---
export const TroisLignesInfos: Story = {
	name: 'Trois lignes d’infos',
	args: {
		editable: true,
		mailInfo: {
			date: '15/04/2025',
			hour: '08:00',
			mailObject: 'Mail avec 3 lignes',
			messageInfoFirstLine: 'Ligne 1',
			messageInfoSecondLine: 'Ligne 2',
			messageInfoThirdLine: 'Ligne 3 supplémentaire',
			readValue: false,
		},
		uniqueId: 'amelipro-mail-tile-3lignes',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <AmeliproMailTile
    :mail-info="item"
    unique-id="mail-tile-3lignes"
  />
</template>`,
			},
			{
				name: 'Scripts',
				code: `<script setup lang="ts">
  import { AmeliproMailTile } from '@cnamts/synapse'

  const item = {
    date: '15/04/2025',
    hour: '08:00',
    mailObject: 'Mail avec 3 lignes',
    messageInfoFirstLine: 'Ligne 1',
    messageInfoSecondLine: 'Ligne 2',
    messageInfoThirdLine: 'Ligne 3 supplémentaire',
    readValue: false,
  }
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproMailTile },
		setup() { return { args } },
		template: `
<p class="mb-2">Affichage d’une tuile mail avec trois lignes d’informations.</p>
<AmeliproMailTile
  :editable="args.editable"
  :mail-info="args.mailInfo"
  :unique-id="args.uniqueId"
  v-bind="args"
/>
`,
	}),
}

// --- Tuile mail avec lien externe (href) ---
export const AvecLien: Story = {
	name: 'Avec lien',
	args: {
		editable: true,
		mailInfo: {
			date: '20/05/2025',
			hour: '16:45',
			mailObject: 'Mail avec lien',
			messageInfoFirstLine: 'Ligne 1',
			messageInfoSecondLine: 'Ligne 2',
			href: 'https://espacepro.ameli.fr',
			readValue: false,
		},
		uniqueId: 'amelipro-mail-tile-lien',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <AmeliproMailTile
    :mail-info="item"
    unique-id="mail-tile-lien"
  />
</template>`,
			},
			{
				name: 'Scripts',
				code: `<script setup lang="ts">
  import { AmeliproMailTile } from '@cnamts/synapse'

  const item = {
    date: '20/05/2025',
    hour: '16:45',
    mailObject: 'Mail avec lien',
    messageInfoFirstLine: 'Ligne 1',
    messageInfoSecondLine: 'Ligne 2',
    href: 'https://espacepro.ameli.fr',
    readValue: false,
  }
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproMailTile },
		setup() { return { args } },
		template: `
<p class="mb-2">Affichage d’une tuile mail avec un lien externe (<code>href</code>).</p>
<AmeliproMailTile
  :editable="args.editable"
  :mail-info="args.mailInfo"
  :unique-id="args.uniqueId"
  v-bind="args"
/>
`,
	}),
}
