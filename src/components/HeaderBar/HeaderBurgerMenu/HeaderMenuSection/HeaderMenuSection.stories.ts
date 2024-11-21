import type { Meta, StoryObj } from '@storybook/vue3'
import HeaderMenuSection from './HeaderMenuSection.vue'
import HeaderMenuItem from '../HeaderMenuItem/HeaderMenuItem.vue'
import HeaderMenu from '../HeaderBurgerMenu.vue'
import HeaderBar from '../../HeaderBar.vue'

const meta = {
	title: 'Composants/Structure/HeaderBar/HeaderBurgerMenu/HeaderMenuSection',
	component: HeaderMenuSection,
	parameters: {
		layout: 'fullscreen',
	},
} satisfies Meta<typeof HeaderMenuSection>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		title: 'section 1',
	},
	render: (args) => {
		return {
			components: { HeaderMenuItem, HeaderMenu, HeaderBar, HeaderMenuSection },
			setup() {
				return { args }
			},
			template: `
				<HeaderBar>
					<template #menu>
						<HeaderMenu>
							<HeaderMenuSection :title="args.title">
								<HeaderMenuItem>
									<a>lorem ipsum</a>
								</HeaderMenuItem>
							</HeaderMenuSection>

							<HeaderMenuSection title="section 2">
								<HeaderMenuItem>
									<a>lorem ipsum</a>
								</HeaderMenuItem>
							</HeaderMenuSection>
						</HeaderMenu>
					</template>
				</HeaderBar>
			`,
		}
	},
	play: async ({ canvasElement }) => {
		const menuBtn = canvasElement.querySelector('button')
		setTimeout(() => {
			menuBtn!.click()
		}, 1000)
	},
}
