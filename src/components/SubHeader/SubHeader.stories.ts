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
	args: {
		backBtnText: 'Retour',
		titleText: 'Paul Dupont',
		subTitleText: '1 69 08 75 125 456 75',
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
						:backBtnText="args.backBtnText"
						:title-text="args.titleText"
						:sub-title-text="args.subTitleText"
					/>
              	</div>
			`,
		}
	},
}
