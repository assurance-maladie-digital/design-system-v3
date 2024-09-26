import type { Meta, StoryObj } from '@storybook/vue3'
import CopyBtn from './CopyBtn.vue'
import { VIcon } from 'vuetify/components'
import { mdiContentDuplicate  } from '@mdi/js'

const duplicateIcon = mdiContentDuplicate

const meta = {
	title: 'Components/CopyBtn',
	component: CopyBtn,
	parameters: {
		layout: 'fullscreen',
		controls: { exclude: ['copy'] },
	},
	argTypes: {
		label: {
			control: { type: 'text' },
			default: 'Label',
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
	},
} as Meta<typeof CopyBtn>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		label: 'Copier le numéro de patient',
		textToCopy: '1970756541',
		hideTooltip: false,
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
					/>
              	</div>
			`,
		}
	},
}

export const NoTooltip: Story = {
	args: {
		label: 'Copier le numéro de patient',
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
						
					/>
              	</div>
			`,
		}
	},
}

export const SlotIcon: Story = {
	args: {
		label: 'Copier le numéro de patient',
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

export const SlotTooltip: Story = {
	args: {
		label: 'Copier le numéro de patient',
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
