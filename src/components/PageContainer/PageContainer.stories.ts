import type { Meta, StoryObj } from '@storybook/vue3'
import PageContainer from './PageContainer.vue'

const meta = {
	title: 'Components/PageContainer',
	component: PageContainer,
	parameters: {
		layout: 'fullscreen',
	},
	argTypes: {
		size: {
			options: ['xl', 'l', 'm', 's'],
			control: { type: 'select' },
			default: 'xl',
		},
		spacing: {
			options: ['xs', 'sm', 'md', 'lg', 'xl'],
			control: { type: 'select' },
			default: undefined,
		},
		color: {
			options: ['transparent', 'primary', 'secondary', 'accent', 'error', 'info', 'success', 'warning'],
			control: { type: 'select' },
			default: 'transparent',
		},
	},
} as Meta<typeof PageContainer>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		size: 'xl',
		spacing: undefined,
		color: 'transparent',
	},
	render: (args) => {
		return {
			components: { PageContainer },
			setup() {
				return { args }
			},
			template: `
                <PageContainer :size="args.size" :spacing="args.spacing" :color="args.color">
                  Contenu de la page
                </PageContainer>
            `,
		}
	},
}
