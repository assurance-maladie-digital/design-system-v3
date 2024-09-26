import type { Meta, StoryObj } from '@storybook/vue3'
import CopyBtn from './CopyBtn.vue'

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
		icon: 'M11,17H4A2,2 0 0,1 2,15V3A2,2 0 0,1 4,1H16V3H4V15H11V13L15,16L11,19V17M19,21V7H8V13H6V7A2,2 0 0,1 8,5H19A2,2 0 0,1 21,7V21A2,2 0 0,1 19,23H8A2,2 0 0,1 6,21V19H8V21H19Z'
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
					/>
              	</div>
			`,
		}
	},
}