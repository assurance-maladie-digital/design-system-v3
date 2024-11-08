import type { Meta, StoryObj } from '@storybook/vue3'
import HeaderMenuItem from './HeaderMenuItem.vue'
import HeaderMenu from '../HeaderBurgerMenu.vue'
import HeaderBar from '../../HeaderBar.vue'

const meta = {
	component: HeaderMenuItem,
	parameters: {
		layout: 'fullscreen',
	},
} satisfies Meta<typeof HeaderMenuItem>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		default: 'lorem ipsum',
	},
	render: (args) => {
		return {
			components: { HeaderMenuItem, HeaderMenu, HeaderBar },
			setup() {
				return { args }
			},
			template: `
				<HeaderBar>
					<template #menu>
						<HeaderMenu>
							<HeaderMenuSection>
								<HeaderMenuItem>
									<a>{{ args.default }}</a>
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
