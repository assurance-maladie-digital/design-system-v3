import type { Meta, StoryObj } from '@storybook/vue3'
import HeaderMenuSection from './HeaderMenuSection.vue'
import HeaderMenuItem from '../HeaderMenuItem/HeaderMenuItem.vue'
import HeaderBurgerMenu from '../HeaderBurgerMenu.vue'
import HeaderBar from '../../HeaderBar.vue'

const meta = {
	title: 'Composants/Structure/HeaderBar/HeaderBurgerMenu/HeaderMenuSection',
	component: HeaderMenuSection,
	argTypes: {
		title: {
			description: 'Titre de la section',
			control: { type: 'text' },
			table: {
				category: 'slots',
			},
		},
		default: {
			control: { type: 'text' },
			description: 'Contenu de la section, construit avec des composants `HeaderMenuItem`',
			table: {
				type: { summary: '{}' },
			},
		},
	},
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
			components: { HeaderMenuItem, HeaderBurgerMenu, HeaderBar, HeaderMenuSection },
			setup() {
				return { args }
			},
			template: `
				<HeaderBar>
					<template #menu>
						<HeaderBurgerMenu>
							<HeaderMenuSection>
								<template #title>
									{{ args.title }}
								</template>
								<HeaderMenuItem>
									<a>lorem ipsum</a>
								</HeaderMenuItem>
							</HeaderMenuSection>

							<HeaderMenuSection>
								<template #title>
									section 2
								</template>

								<HeaderMenuItem>
									<a>lorem ipsum</a>
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
									<template #title>
										{{ args.title }}
									</template>
									<HeaderMenuItem>
										<a>lorem ipsum</a>
									</HeaderMenuItem>
								</HeaderMenuSection>

								<HeaderMenuSection>
									<template #title>
										section 2
									</template>
									<HeaderMenuItem>
										<a>lorem ipsum</a>
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
