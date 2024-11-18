import type { Meta, StoryObj } from '@storybook/vue3'
import SubHeader from './SubHeader.vue'
import { ref } from 'vue'
import { mdiStepBackward, mdiClose, mdiContentCopy } from '@mdi/js'

const meta = {
	title: 'Components/SubHeader',
	component: SubHeader,
	parameters: {
		layout: 'fullscreen',
	},
	argTypes: {
		'hideBackBtn': {
			type: 'boolean',
			control: { type: 'boolean' },
			default: false,
		},
		'backBtnText': {
			type: 'string',
			control: { type: 'text' },
			default: 'Retour',
		},
		'titleText': {
			type: 'string',
			control: { type: 'text' },
			default: undefined,
		},
		'subTitleText': {
			type: 'string',
			control: { type: 'text' },
			default: undefined,
		},
		'dataListGroupItems': {
			control: { type: 'object' },
		},
		'loading': {
			type: 'boolean',
			control: { type: 'boolean' },
			default: false,
		},
		'renderHtmlValue': {
			type: 'boolean',
			control: { type: 'boolean' },
			default: false,
		},
		'additional-informations': {
			type: 'string',
			control: { type: 'text' },
			default: undefined,
		},
		'back-btn': {
			type: 'string',
			control: { type: 'text' },
			default: undefined,
		},
		'back-btn-icon': {
			type: 'string',
			control: { type: 'text' },
			default: undefined,
		},
		'title': {
			type: 'string',
			control: { type: 'text' },
			default: undefined,
		},
		'sub-title': {
			type: 'string',
			control: { type: 'text' },
			default: undefined,
		},
		'right-content': {
			type: 'string',
			control: { type: 'text' },
			default: undefined,
		},
		'vuetifyOptions': {
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
		'backBtnText': 'Retour',
		'hideBackBtn': false,
		'titleText': 'Paul Dupont',
		'subTitleText': '1 69 08 75 125 456 75',
		'loading': false,
		'renderHtmlValue': false,
		'dataListGroupItems': [],
		'additional-informations': undefined,
		'back-btn': undefined,
		'back-btn-icon': undefined,
		'title': undefined,
		'sub-title': undefined,
		'right-content': undefined,
		'vuetifyOptions': {
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
				<SubHeader 
					v-bind="args"
					:back-btn-text="args.backBtnText"
					:title-text="args.titleText"
					:hide-back-btn="args.hideBackBtn"
					:sub-title-text="args.subTitleText"
					:loading="args.loading"
					:render-html-value="args.renderHtmlValue"
					:data-list-group-items="args.dataListGroupItems"
					:additional-informations="args.additionalInformations"
					:back-btn="args.backBtn"
					:back-btn-icon="args.backBtnIcon"
					:title="args.title"
					:sub-title="args.subTitle"
					:right-content="args.rightContent"
					:vuetify-options="args.vuetifyOptions"
				/>
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
				<SubHeader 
					v-bind="args"
					:data-list-group-items="args.dataListGroupItems"
				/>
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
					if (args.dataListGroupItems) {
						args.dataListGroupItems[eventValue.dataListIndex].items[eventValue.itemIndex].value = '25/09/1970'
					}
				}
				return { args, updateInfo }
			},
			template: `
				<SubHeader 
					v-bind="args"
					:data-list-group-items="args.dataListGroupItems"
					@click:list-item="updateInfo"
				/>
			`,
		}
	},
}

export const HtmlValue: Story = {
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
						render-html-value
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
								{ key: 'Adresse', value: '<b>50 Avenue du Professeur André Lemierre</b><br/>75020 Paris' },
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
		renderHtmlValue: true,
		dataListGroupItems: [
			{
				title: 'Informations patient',
				items: [
					{ key: 'Date de naissance', value: '24/09/1970' },
					{ key: 'Adresse', value: '<b>50 Avenue du Professeur André Lemierre</b><br/>75020 Paris' },
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
				<SubHeader 
					v-bind="args"
					:data-list-group-items="args.dataListGroupItems"
					:render-html-value="args.renderHtmlValue"
				/>
			`,
		}
	},
}

export const Loading: Story = {
	parameters: {
		controls: { exclude: ['vuetifyOptions', 'dataListGroupItems', 'backBtnText', 'hideBackBtn', 'titleText', 'subTitleText', 'additional-informations', 'renderHtmlValue', 'back', 'click:list-item', 'back-btn', 'back-btn-icon', 'title', 'sub-title', 'right-content'] },
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<SubHeader
						title-text="Paul Dupont"
						sub-title-text="1 69 08 75 125 456 75"
						:data-list-group-items="items"
						loading
					>
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
		loading: true,
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
				<SubHeader 
					v-bind="args"
					:data-list-group-items="args.dataListGroupItems"
					:loading="args.loading"
				/>
			`,
		}
	},
}

export const SlotAdditionalInformations: Story = {
	parameters: {
		controls: { exclude: ['vuetifyOptions', 'dataListGroupItems', 'backBtnText', 'hideBackBtn', 'titleText', 'subTitleText', 'loading', 'renderHtmlValue', 'back', 'click:list-item', 'back-btn', 'back-btn-icon', 'title', 'sub-title', 'right-content'] },
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<SubHeader
						title-text="Paul Dupont"
						sub-title-text="1 69 08 75 125 456 75"
					>
						<template #additional-informations>
							<VSpacer />
							<p class="white--text mt-8 mb-0">
								Profil complété à 50%
							</p>
							<VProgressLinear
								:model-value="50"
								color="#fff"
								height="8px"
								class="mt-2 mb-1"
								background-color="#fff"
								background-opacity=".24"
							/>
						</template>
					</SubHeader>
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
		'backBtnText': 'Retour',
		'hideBackBtn': false,
		'titleText': 'Paul Dupont',
		'subTitleText': '1 69 08 75 125 456 75',
		'loading': false,
		'renderHtmlValue': false,
		'additional-informations': `<template #additional-informations>
	<VSpacer />
	<p class="white--text mt-8 mb-0">
		Profil complété à 50%
	</p>
	<VProgressLinear
		:model-value="50"
		color="#fff"
		height="8px"
		class="mt-2 mb-1"
		background-color="#fff"
		background-opacity=".24"
	/>
</template>`,
	},
	render: (args) => {
		return {
			components: { SubHeader },
			setup() {
				return { args }
			},
			template: `
				<SubHeader v-bind="args">
					<template #additional-informations>
						<VSpacer />
						<p class="white--text mt-8 mb-0">
							Profil complété à 50%
						</p>
						<VProgressLinear
							:model-value="50"
							color="#fff"
							height="8px"
							class="mt-2 mb-1"
							background-color="#fff"
							background-opacity=".24"
						/>
					</template>
				</SubHeader>
			`,
		}
	},
}

export const SlotBackBtn: Story = {
	parameters: {
		controls: { exclude: ['vuetifyOptions', 'dataListGroupItems', 'backBtnText', 'hideBackBtn', 'titleText', 'subTitleText', 'loading', 'renderHtmlValue', 'back', 'click:list-item', 'additional-informations', 'back-btn-icon', 'title', 'sub-title', 'right-content'] },
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<SubHeader
						title-text="Paul Dupont"
						sub-title-text="1 69 08 75 125 456 75"
					>
						<template #back-btn>
							<VBtn
								color="white"
								variant="tonal"
								class="mb-4"
							>
								Retour
							</VBtn>
						</template>
					</SubHeader>
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
		'backBtnText': 'Retour',
		'hideBackBtn': false,
		'titleText': 'Paul Dupont',
		'subTitleText': '1 69 08 75 125 456 75',
		'loading': false,
		'renderHtmlValue': false,
		'back-btn': `<template #back-btn>
	<VBtn
		color="white"
		variant="tonal"
		class="mb-4"
	>
		Retour
	</VBtn>
</template>`,
	},
	render: (args) => {
		return {
			components: { SubHeader },
			setup() {
				return { args }
			},
			template: `
				<SubHeader v-bind="args">
					<template #back-btn>
						<VBtn
							color="white"
							variant="tonal"
							class="mb-4"
						>
							Retour
						</VBtn>
					</template>
				</SubHeader>
			`,
		}
	},
}

export const SlotBackBtnIcon: Story = {
	parameters: {
		controls: { exclude: ['vuetifyOptions', 'dataListGroupItems', 'backBtnText', 'hideBackBtn', 'titleText', 'subTitleText', 'loading', 'renderHtmlValue', 'back', 'click:list-item', 'additional-informations', 'back-btn', 'title', 'sub-title', 'right-content'] },
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<SubHeader
						title-text="Paul Dupont"
						sub-title-text="1 69 08 75 125 456 75"
					>
						<template #back-btn-icon>
							<VIcon class="mr-2">
								{{ backArrowIcon }}
							</VIcon>
						</template>
					</SubHeader>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import SubHeader from '@cnamts/synapse'
					import { mdiStepBackward } from '@mdi/js'
					
					const backArrowIcon = ref(mdiStepBackward)
				</script>
				`,
			},
		],
	},
	args: {
		'backBtnText': 'Retour',
		'hideBackBtn': false,
		'titleText': 'Paul Dupont',
		'subTitleText': '1 69 08 75 125 456 75',
		'loading': false,
		'renderHtmlValue': false,
		'back-btn-icon': `<template #back-btn-icon>
	<VIcon class="mr-2">
		{{ backArrowIcon }}
	</VIcon>
</template>`,
	},
	render: (args) => {
		return {
			components: { SubHeader },
			setup() {
				const backArrowIcon = ref(mdiStepBackward)
				return { args, backArrowIcon }
			},
			template: `
				<SubHeader v-bind="args">
					<template #back-btn-icon>
						<VIcon class="mr-2">
							{{ backArrowIcon }}
						</VIcon>
					</template>
				</SubHeader>
			`,
		}
	},
}

export const SlotTitle: Story = {
	parameters: {
		controls: { exclude: ['vuetifyOptions', 'dataListGroupItems', 'backBtnText', 'hideBackBtn', 'titleText', 'subTitleText', 'loading', 'renderHtmlValue', 'back', 'click:list-item', 'additional-informations', 'back-btn', 'back-btn-icon', 'sub-title', 'right-content'] },
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<SubHeader sub-title-text="1 69 08 75 125 456 75">
						<template #title>
							<h3 class="headline font-weight-bold mt-2">
								Dossier n°42
							</h3>
						</template>
					</SubHeader>
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
		title: `<template #title>
	<h3 class="headline font-weight-bold mt-2">
		Dossier n°42
	</h3>
</template>`,
	},
	render: (args) => {
		return {
			components: { SubHeader },
			setup() {
				return { args }
			},
			template: `
				<SubHeader v-bind="args">
					<template #title>
						<h3 class="headline font-weight-bold mt-2">
							Dossier n°42
						</h3>
					</template>
				</SubHeader>
			`,
		}
	},
}

export const SlotSubTitle: Story = {
	parameters: {
		controls: { exclude: ['vuetifyOptions', 'dataListGroupItems', 'backBtnText', 'hideBackBtn', 'titleText', 'subTitleText', 'loading', 'renderHtmlValue', 'back', 'click:list-item', 'additional-informations', 'back-btn', 'back-btn-icon', 'title', 'right-content'] },
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<SubHeader
						title-text="Paul Dupont"
					>
						<template #sub-title>
							<h4 class="title mt-1">
								Traité par Paul Dupont
							</h4>
						</template>
					</SubHeader>
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
		'backBtnText': 'Retour',
		'hideBackBtn': false,
		'titleText': 'Paul Dupont',
		'subTitleText': '1 69 08 75 125 456 75',
		'loading': false,
		'renderHtmlValue': false,
		'sub-title': `<template #sub-title>
	<h4 class="title mt-1">
		Traité par Jean Lunel
	</h4>
</template>`,
	},
	render: (args) => {
		return {
			components: { SubHeader },
			setup() {
				return { args }
			},
			template: `
				<SubHeader v-bind="args">
					<template #sub-title>
						<h4 class="title mt-1">
							Traité par Jean Lunel
						</h4>
					</template>
				</SubHeader>
		`,
		}
	},
}

export const SlotRightContent: Story = {
	parameters: {
		controls: { exclude: ['vuetifyOptions', 'dataListGroupItems', 'backBtnText', 'hideBackBtn', 'titleText', 'subTitleText', 'loading', 'renderHtmlValue', 'back', 'click:list-item', 'additional-informations', 'back-btn', 'back-btn-icon', 'title', 'sub-title'] },
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<SubHeader
						title-text="Paul Dupont"
						sub-title-text="1 69 08 75 125 456 75"
					>
						<template #sub-title>
							<h4 class="title mt-1">
								Traité par Paul Dupont
							</h4>
						</template>
					</SubHeader>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import SubHeader from '@cnamts/synapse'
					
					import { mdiClose, mdiContentCopy } from '@mdi/js'
				</script>
				`,
			},
		],
	},
	args: {
		'backBtnText': 'Retour',
		'hideBackBtn': false,
		'titleText': 'Paul Dupont',
		'subTitleText': '1 69 08 75 125 456 75',
		'loading': false,
		'renderHtmlValue': false,
		'right-content': `<template #right-content>
	<div class="d-flex flex-column align-start flex-grow-0 ml-auto mt-auto">
		<VBtn
			variant="text"
			color="white"
		>
			<VIcon class="mr-2">
				{{ cancelIcon }}
			</VIcon>
			Clore le dossier
		</VBtn>
		<VBtn
			variant="text"
			color="white"
		>
			<VIcon class="mr-2">
				{{ copyIcon }}
			</VIcon>
			Dupliquer le dossier
		</VBtn>
	</div>
</template>`,
	},
	render: (args) => {
		return {
			components: { SubHeader },
			setup() {
				const cancelIcon = ref(mdiClose)
				const copyIcon = ref(mdiContentCopy)

				return { args, cancelIcon, copyIcon }
			},
			template: `
				<SubHeader v-bind="args">
					<template #right-content>
						<div class="d-flex flex-column align-start flex-grow-0 ml-auto mt-auto">
							<VBtn
								variant="text"
								color="white"
							>
								<VIcon class="mr-2">
									{{ cancelIcon }}
								</VIcon>
								Clore le dossier
							</VBtn>
							<VBtn
								variant="text"
								color="white"
							>
								<VIcon class="mr-2">
									{{ copyIcon }}
								</VIcon>
								Dupliquer le dossier
							</VBtn>
						</div>
					</template>
				</SubHeader>
			`,
		}
	},
}
