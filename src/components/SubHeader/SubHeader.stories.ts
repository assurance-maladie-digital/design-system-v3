import type { Meta, StoryObj } from '@storybook/vue3'
import SubHeader from './SubHeader.vue'

const meta = {
	title: 'Components/SubHeader',
	component: SubHeader,
	parameters: {
		layout: 'fullscreen',
		controls: { exclude: ['copy'] },
	},
	argTypes: {
		hideBackBtn: {
			control: { type: 'boolean' },
			default: false,
		},
		backBtnText: {
			control: { type: 'text' },
			default: 'Retour',
		},
		titleText: {
			control: { type: 'text' },
			default: undefined,
		},
		subTitleText: {
			control: { type: 'text' },
			default: undefined,
		},
		dataListGroupItems: {
			control: { type: 'object' },
			default: undefined,
		},
		loading: {
			control: { type: 'boolean' },
			default: false,
		},
		renderHtmlValue: {
			control: { type: 'boolean' },
			default: false,
		},
		vuetifyOptions: {
			control: { type: 'object' },
			default: () => ({
				menu: {
					location: 'end center',
					offset: 16,
					zIndex: 8,
					contentClass: 'vd-copy-tooltip-menu text-white text-body-2 ml-2',
				},
				btn: {
					icon: true,
					variant: 'text',
					density: 'comfortable',
				},
				icon: {
					color: 'grey-darken-20',
				},
			}),
		},
	},
} satisfies Meta<typeof SubHeader>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<SubHeader
						title-text="Paul Dupont"
						sub-title-text="1 69 08 75 125 456 75"
					/>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import SubHeader from '@cnamts/synapse'
				</script>
				`,
			},
		],
	},
	args: {
		backBtnText: 'Retour',
		hideBackBtn: false,
		titleText: 'Paul Dupont',
		subTitleText: '1 69 08 75 125 456 75',
		loading: false,
		renderHtmlValue: false,
		vuetifyOptions: {
			sheet: {
				color: 'secondary',
			},
			backBtn: {
				size: 'small',
				variant: 'text',
				class: 'font-weight-regular white--text px-1',
			},
		},
	},
	render: (args) => {
		return {
			components: { SubHeader },
			setup() {
				return { args }
			},
			template: `
				<div class="d-flex flex-wrap align-center pa-4">
                    <SubHeader 
						v-bind="args"
						:back-btn-text="args.backBtnText"
						:title-text="args.titleText"
						:hide-back-btn="args.hideBackBtn"
						:sub-title-text="args.subTitleText"
						:loading="args.loading"
						:render-html-value="args.renderHtmlValue"
						:vuetify-options="args.vuetifyOptions"
					/>
              	</div>
			`,
		}
	},
}

export const DataList: Story = {
	parameters: {
		controls: { exclude: ['vuetifyOptions', 'backBtnText', 'hideBackBtn', 'titleText', 'subTitleText', 'loading', 'renderHtmlValue', 'back', 'click:list-item', 'back-btn', 'back-btn-icon', 'title', 'sub-title', 'additional-informations', 'right-content'] },
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<SubHeader
						title-text="Paul Dupont"
						sub-title-text="1 69 08 75 125 456 75"
						:data-list-group-items="items"
					/>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import SubHeader from '@cnamts/synapse'
										
					const items = [
						{
							title: 'Informations patient',
							items: [
								{ key: 'Date de naissance', value: '24/09/1970' },
								{ key: 'Adresse', value: '50 Avenue du Professeur André Lemierre 75020 Paris' },
							],
						},
						{
							title: 'Médecin traitant',
							items: [
								{ key: 'Nom du praticien', value: 'Gérard Leblanc' },
								{ key: 'N° RPPS', value: 'XXXXX' },
							],
						},
						{
							title: 'Autres informations',
							items: [
								{ key: 'Dernière modification', value: '04/06/2020' },
							],
						},
					]
				</script>
				`,
			},
		],
	},
	args: {
		backBtnText: 'Retour',
		hideBackBtn: false,
		titleText: 'Paul Dupont',
		subTitleText: '1 69 08 75 125 456 75',
		loading: false,
		renderHtmlValue: false,
		dataListGroupItems: [
			{
				title: 'Informations patient',
				items: [
					{ key: 'Date de naissance', value: '24/09/1970' },
					{ key: 'Adresse', value: '50 Avenue du Professeur André Lemierre 75020 Paris' },
				],
			},
			{
				title: 'Médecin traitant',
				items: [
					{ key: 'Nom du praticien', value: 'Gérard Leblanc' },
					{ key: 'N° RPPS', value: 'XXXXX' },
				],
			},
			{
				title: 'Autres informations',
				items: [
					{ key: 'Dernière modification', value: '04/06/2020' },
				],
			},
		],

	},
	render: (args) => {
		return {
			components: { SubHeader },
			setup() {
				return { args }
			},
			template: `
				<div class="d-flex flex-wrap align-center pa-4">
                    <SubHeader 
						v-bind="args"
						:data-list-group-items="args.dataListGroupItems"
					/>
              	</div>
			`,
		}
	},
}

export const ActionBtn: Story = {
	parameters: {
		controls: { exclude: ['vuetifyOptions', 'backBtnText', 'hideBackBtn', 'titleText', 'subTitleText', 'loading', 'renderHtmlValue', 'back', 'click:list-item', 'back-btn', 'back-btn-icon', 'title', 'sub-title', 'additional-informations', 'right-content'] },
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<SubHeader
						title-text="Paul Dupont"
						sub-title-text="1 69 08 75 125 456 75"
						:data-list-group-items="items"
						@click:list-item="updateInfo"
					/>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import SubHeader from '@cnamts/synapse'
										
					const items = [
						{
							title: 'Informations patient',
							items: [
								{ key: 'Date de naissance', value: '24/09/1970', action: 'Modifier' },
								{ key: 'Adresse', value: '50 Avenue du Professeur André Lemierre 75020 Paris' },
							],
						},
						{
							title: 'Médecin traitant',
							items: [
								{ key: 'Nom du praticien', value: 'Gérard Leblanc' },
								{ key: 'N° RPPS', value: 'XXXXX' },
							],
						},
						{
							title: 'Autres informations',
							items: [
								{ key: 'Dernière modification', value: '04/06/2020' },
							],
						},
					]
					
					const updateInfo = (eventValue: { dataListIndex: number, itemIndex: number }) => {
						items[eventValue.dataListIndex].items[eventValue.itemIndex].value = '25/09/1970'
					}
				</script>
				`,
			},
		],
	},
	args: {
		backBtnText: 'Retour',
		hideBackBtn: false,
		titleText: 'Paul Dupont',
		subTitleText: '1 69 08 75 125 456 75',
		loading: false,
		renderHtmlValue: false,
		dataListGroupItems: [
			{
				title: 'Informations patient',
				items: [
					{ key: 'Date de naissance', value: '24/09/1970', action: 'Modifier' },
					{ key: 'Adresse', value: '50 Avenue du Professeur André Lemierre 75020 Paris' },
				],
			},
			{
				title: 'Médecin traitant',
				items: [
					{ key: 'Nom du praticien', value: 'Gérard Leblanc' },
					{ key: 'N° RPPS', value: 'XXXXX' },
				],
			},
			{
				title: 'Autres informations',
				items: [
					{ key: 'Dernière modification', value: '04/06/2020' },
				],
			},
		],

	},
	render: (args) => {
		return {
			components: { SubHeader },
			setup() {
				const updateInfo = (eventValue: { dataListIndex: number, itemIndex: number }) => {
					args.dataListGroupItems[eventValue.dataListIndex].items[eventValue.itemIndex].value = '25/09/1970'
				}
				return { args, updateInfo }
			},
			template: `
				<div class="d-flex flex-wrap align-center pa-4">
                    <SubHeader 
						v-bind="args"
						:data-list-group-items="args.dataListGroupItems"
						@click:list-item="updateInfo"
					/>
              	</div>
			`,
		}
	},
}
