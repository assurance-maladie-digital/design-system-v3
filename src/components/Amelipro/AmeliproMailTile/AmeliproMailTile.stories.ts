import type { Meta, StoryObj } from '@storybook/vue3'
import AmeliproMailTile from './AmeliproMailTile.vue'

const meta = {
	argTypes: {
		'click': {
			action: 'click',
			description: 'Événement émis au click sur la partie principale de la tuile. Retourne `unique-id`.',
			type: 'string',
		},
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
		'status-change': {
			action: 'status-change',
			description: 'Événement émis au click sur le bouton de gauche quand qui change le statut du mail, quand la props editable est active. Retourne `unique-id`.',
			type: 'string',
		},
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
		@click="args['click']"
		@status-change="args['status-change']"
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
	@click="args['click']"
	@status-change="args['status-change']"
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
