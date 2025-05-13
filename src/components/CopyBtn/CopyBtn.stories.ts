import type { Meta, StoryObj } from '@storybook/vue3'
import CopyBtn from './CopyBtn.vue'
import { VIcon } from 'vuetify/components'
import { mdiContentDuplicate } from '@mdi/js'

const duplicateIcon = mdiContentDuplicate

const meta = {
	title: 'Composants/Boutons/CopyBtn',
	component: CopyBtn,
	parameters: {
		layout: 'fullscreen',
		controls: { exclude: ['copy'] },
	},
	argTypes: {
		ariaLabel: {
			control: { type: 'text' },
			default: 'copy-btn',
		},
		ariaOwns: {
			control: { type: 'text' },
			default: 'copy-btn',
		},
		textToCopy: {
			control: { type: 'text' },
			default: 'test',
		},
		hideTooltip: {
			control: { type: 'boolean' },
			default: false,
		},
		tooltipDuration: {
			control: { type: 'number' },
			default: 2000,
		},
		removeSpaces: {
			control: { type: 'boolean' },
			default: false,
		},
		separatorsToRemove: {
			control: { type: 'text' },
			default: '',
		},
		vuetifyOptions: {
			control: { type: 'object' },
			default: () => ({
				menu: {
					location: 'end center',
					offset: 16,
					zIndex: 8,
					contentClass: 'sy-copy-tooltip-menu text-white text-body-2 ml-2',
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
} satisfies Meta<typeof CopyBtn>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<div class="d-flex flex-wrap align-center pa-4">
		<p class="mb-0 mr-1">
		  Patient n°<b>1970756541</b>
		</p>

		<CopyBtn
			label="Copier le numéro de patient"
			text-to-copy="1970756541"
		/>
	</div>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { CopyBtn } from '@cnamts/synapse'
</script>
				`,
			},
		],
	},
	args: {
		ariaLabel: 'Copier le numéro de patient',
		ariaOwns: 'copy-btn-1',
		textToCopy: '1970756541',
		hideTooltip: false,
		tooltipDuration: 2000,
		vuetifyOptions: {
			menu: {
				location: 'end center',
				offset: 16,
				zIndex: 8,
				contentClass: 'sy-copy-tooltip-menu text-white text-body-2 ml-2',
			},
			btn: {
				icon: true,
				variant: 'text',
				density: 'comfortable',
			},
			icon: {
				color: 'grey-darken-20',
			},
		},
	},
	render: (args) => {
		return {
			components: { CopyBtn },
			setup() {
				return { args }
			},
			template: `
				<div class="d-flex flex-wrap align-center pa-4">
					<p class="mb-0 mr-1">
					  Patient n°<b>1970756541</b>
					</p>
	
					<CopyBtn
						label="Copier le numéro de patient"
						text-to-copy="1970756541"
						:hide-tooltip="args.hideTooltip"
						:vuetify-options="args.vuetifyOptions"
					/>
              	</div>
			`,
		}
	},
}

export const NoTooltip: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<div class="d-flex flex-wrap align-center pa-4">
		<p class="mb-0 mr-1">
		  Patient n°<b>1970756541</b>
		</p>

		<CopyBtn
			label="Copier le numéro de patient"
			text-to-copy="1970756541"
			hide-tooltip
		/>
	</div>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { CopyBtn } from '@cnamts/synapse'
</script>
				`,
			},
		],
	},
	args: {
		ariaLabel: 'Copier le numéro de patient',
		textToCopy: '1970756541',
		hideTooltip: true,
		tooltipDuration: 2000,
	},
	render: (args) => {
		return {
			components: { CopyBtn },
			setup() {
				return { args }
			},
			template: `
				<div class="d-flex flex-wrap align-center pa-4">
					<p class="mb-0 mr-1">
					  Patient n°<b>1970756541</b>
					</p>
	
					<CopyBtn
						label="Copier le numéro de patient"
						text-to-copy="1970756541"
						:hide-tooltip="args.hideTooltip"
						
					/>
              	</div>
			`,
		}
	},
}

export const SlotIcon: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<div class="d-flex flex-wrap align-center pa-4">
		<p class="mb-0 mr-1">
		  Patient n°<b>1970756541</b>
		</p>

		<CopyBtn
			label="Copier le numéro de patient"
			text-to-copy="1970756541"
		>
			<template #icon>
				<VIcon :icon="duplicateIcon" />
			</template>
		</CopyBtn>
	</div>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { CopyBtn } from '@cnamts/synapse'
	import { mdiContentDuplicate } from '@mdi/js'
	
	const duplicateIcon = mdiContentDuplicate
</script>
				`,
			},
		],
	},
	args: {
		ariaLabel: 'Copier le numéro de patient',
		textToCopy: '1970756541',
		hideTooltip: false,
		tooltipDuration: 2000,
		icon: duplicateIcon,
	},
	render: (args) => {
		return {
			components: { CopyBtn, VIcon },
			setup() {
				return { args }
			},
			template: `
				<div class="d-flex flex-wrap align-center pa-4">
					<p class="mb-0 mr-1">
					  Patient n°<b>1970756541</b>
					</p>
	
					<CopyBtn
						label="Copier le numéro de patient"
						text-to-copy="1970756541"
						:hide-tooltip="args.hideTooltip"
					>
						<template #icon>
							<VIcon :icon="args.icon" />
						</template>
					</CopyBtn>
              	</div>
			`,
		}
	},
}

export const RemoveSeparators: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<div class="d-flex flex-wrap align-center pa-4">
		<p class="mb-0 mr-1">
		  IBAN : <b>FR76-3000-4000-0300-0000-0000-000</b>
		</p>

		<CopyBtn
			label="Copier l'IBAN sans tirets"
			text-to-copy="FR76-3000-4000-0300-0000-0000-000"
			remove-spaces
			separators-to-remove="-"
		/>
	</div>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { CopyBtn } from '@cnamts/synapse'
</script>
				`,
			},
		],
	},
	args: {
		ariaLabel: 'Copier l\'IBAN sans tirets',
		ariaOwns: 'copy-btn-remove-separators',
		textToCopy: 'FR76-3000-4000-0300-0000-0000-000',
		hideTooltip: false,
		tooltipDuration: 2000,
		removeSpaces: true,
		separatorsToRemove: '-',
	},
	render: (args) => {
		return {
			components: { CopyBtn },
			setup() {
				return { args }
			},
			template: `
				<div class="d-flex flex-wrap align-center pa-4">
					<p class="mb-0 mr-1">
					  IBAN : <b>FR76-3000-4000-0300-0000-0000-000</b>
					</p>
	
					<CopyBtn
						label="Copier l'IBAN sans tirets"
						:text-to-copy="args.textToCopy"
						:remove-spaces="args.removeSpaces"
						:separators-to-remove="args.separatorsToRemove"
						:hide-tooltip="args.hideTooltip"
						:aria-owns="args.ariaOwns"
					/>
              	</div>
			`,
		}
	},
}

export const MultiSeparators: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<div class="d-flex flex-wrap align-center pa-4">
		<p class="mb-0 mr-1">
		  Téléphone : <b>+33 (0)6.12.34.56.78</b>
		</p>

		<CopyBtn
			label="Copier le numéro sans séparateurs"
			text-to-copy="+33 (0)6.12.34.56.78"
			remove-spaces
			:separators-to-remove="['+', '(', ')', '.']"
		/>
	</div>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { CopyBtn } from '@cnamts/synapse'
</script>
				`,
			},
		],
	},
	args: {
		ariaLabel: 'Copier le numéro sans séparateurs',
		ariaOwns: 'copy-btn-multi-separators',
		textToCopy: '+33 (0)6.12.34.56.78',
		hideTooltip: false,
		tooltipDuration: 2000,
		removeSpaces: true,
		separatorsToRemove: ['+', '(', ')', '.'],
	},
	render: (args) => {
		return {
			components: { CopyBtn },
			setup() {
				return { args }
			},
			template: `
				<div class="d-flex flex-wrap align-center pa-4">
					<p class="mb-0 mr-1">
					  Téléphone : <b>+33 (0)6.12.34.56.78</b>
					</p>
	
					<CopyBtn
						label="Copier le numéro sans séparateurs"
						:text-to-copy="args.textToCopy"
						:remove-spaces="args.removeSpaces"
						:separators-to-remove="args.separatorsToRemove"
						:hide-tooltip="args.hideTooltip"
						:aria-owns="args.ariaOwns"
					/>
              	</div>
			`,
		}
	},
}

export const RemoveSpaces: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<div class="d-flex flex-wrap align-center pa-4">
		<p class="mb-0 mr-1">
		  Numéro de sécurité sociale : <b>1 97 07 56 541 123 45</b>
		</p>

		<CopyBtn
			label="Copier le numéro de sécurité sociale sans espaces"
			text-to-copy="1 97 07 56 541 123 45"
			remove-spaces
		/>
	</div>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { CopyBtn } from '@cnamts/synapse'
</script>
				`,
			},
		],
	},
	args: {
		ariaLabel: 'Copier le numéro de sécurité sociale sans espaces',
		ariaOwns: 'copy-btn-remove-spaces',
		textToCopy: '1 97 07 56 541 123 45',
		hideTooltip: false,
		tooltipDuration: 2000,
		removeSpaces: true,
	},
	render: (args) => {
		return {
			components: { CopyBtn },
			setup() {
				return { args }
			},
			template: `
				<div class="d-flex flex-wrap align-center pa-4">
					<p class="mb-0 mr-1">
					  Numéro de sécurité sociale : <b>1 97 07 56 541 123 45</b>
					</p>
	
					<CopyBtn
						label="Copier le numéro de sécurité sociale sans espaces"
						:text-to-copy="args.textToCopy"
						:remove-spaces="args.removeSpaces"
						:hide-tooltip="args.hideTooltip"
						:aria-owns="args.ariaOwns"
					/>
              	</div>
			`,
		}
	},
}

export const SlotTooltip: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<div class="d-flex flex-wrap align-center pa-4">
		<p class="mb-0 mr-1">
		  Patient n°<b>1970756541</b>
		</p>

		<CopyBtn
			label="Copier le numéro de patient"
			text-to-copy="1970756541"
		>
			<template #tooltip>
				{{ tooltip }}
			</template>
		</CopyBtn>
	</div>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { CopyBtn } from '@cnamts/synapse'
	
	const tooltip = 'Texte personalisé'
</script>
				`,
			},
		],
	},
	args: {
		ariaLabel: 'Copier le numéro de patient',
		textToCopy: '1970756541',
		hideTooltip: false,
		tooltipDuration: 2000,
		tooltip: 'Texte personalisé',
	},
	render: (args) => {
		return {
			components: { CopyBtn },
			setup() {
				return { args }
			},
			template: `
				<div class="d-flex flex-wrap align-center pa-4">
					<p class="mb-0 mr-1">
					  Patient n°<b>1970756541</b>
					</p>
	
					<CopyBtn
						label="Copier le numéro de patient"
						text-to-copy="1970756541"
						:hide-tooltip="args.hideTooltip"
					>
						<template #tooltip>
							{{ args.tooltip }}
						</template>
					</CopyBtn>
              	</div>
			`,
		}
	},
}
