import type { Meta, StoryObj } from '@storybook/vue3'
import HeaderMenuItem from './HeaderMenuItem.vue'
import HeaderBurgerMenu from '../HeaderBurgerMenu.vue'
import HeaderBar from '../../HeaderBar.vue'
import HeaderMenuSection from '../HeaderMenuSection/HeaderMenuSection.vue'

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
			components: { HeaderMenuItem, HeaderBurgerMenu, HeaderBar, HeaderMenuSection },
			setup() {
				return { args }
			},
			template: `
				<HeaderBar>
					<template #menu>
						<HeaderBurgerMenu>
							<HeaderMenuSection>
								<HeaderMenuItem>
									<a>{{ args.default }}</a>
								</HeaderMenuItem>
							</HeaderMenuSection>
						</HeaderBurgerMenu>
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
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<Template>
					<HeaderBar>
						<template #menu>
							<HeaderBurgerMenu>
								<HeaderMenuSection>
									<HeaderMenuItem>
										<a href="#">lorem ipsum</a>
									</HeaderMenuItem>
								</HeaderMenuSection>
							</HeaderBurgerMenu>
						</template>
					</HeaderBar>
				</Template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup>
					import { HeaderBurgerMenu, HeaderBar, HeaderMenuSection, HeaderMenuItem } from '@cnamts/synapse'
				</script>
				`,
			},
		],
	},
}
