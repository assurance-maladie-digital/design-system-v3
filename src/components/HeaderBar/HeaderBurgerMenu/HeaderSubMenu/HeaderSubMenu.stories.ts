import type { Meta, StoryObj } from '@storybook/vue3'
import HeaderBar from '../../HeaderBar.vue'
import HeaderBurgerMenu from '../HeaderBurgerMenu.vue'
import HeaderMenuItem from '../HeaderMenuItem/HeaderMenuItem.vue'
import HeaderMenuSection from '../HeaderMenuSection/HeaderMenuSection.vue'
import HeaderSubMenu from './HeaderSubMenu.vue'

const meta = {
	title: 'Composants/Structure/HeaderBar/HeaderBurgerMenu/HeaderSubMenu',
	component: HeaderSubMenu,
	argTypes: {
		title: {
			control: { type: 'text' },
			description: 'Titre du sous-menu',
			table: {
				type: { summary: '{}' },
			},
		},
		default: {
			control: { type: 'text' },
			description: 'Contenu du sous-menu, construit avec des composants `HeaderMenuSection`',
			table: {
				type: { summary: '{}' },
			},
		},
	},
	parameters: {
		layout: 'fullscreen',
	},
} satisfies Meta<typeof HeaderSubMenu>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		title: 'Menu de premier niveau',
	},
	render: (args) => {
		return {
			components: { HeaderMenuItem, HeaderBurgerMenu, HeaderBar, HeaderSubMenu, HeaderMenuSection },
			setup() {
				return { args }
			},
			template: `
				<HeaderBar>
					<template #menu>
						<HeaderBurgerMenu>
							<HeaderMenuSection>
								<HeaderMenuItem>
									<a>Item</a>
								</HeaderMenuItem>
								<HeaderMenuItem>
									<a>Item</a>
								</HeaderMenuItem>
								<headerMenuItem>
									<HeaderSubMenu v-bind="args">
										<template #title>
											{{ args.title }}
										</template>
										<HeaderMenuItem>
											<a>Item</a>
										</HeaderMenuItem>
									</HeaderSubMenu>
								</headerMenuItem>
								<HeaderMenuItem>
									<a>Item</a>
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
				<HeaderBar>
					<template #menu>
						<HeaderBurgerMenu>
							<HeaderMenuSection>
								<HeaderMenuItem>
									<a>Item</a>
								</HeaderMenuItem>
								<HeaderMenuItem>
									<a>Item</a>
								</HeaderMenuItem>
								<headerMenuItem>
									<HeaderSubMenu>
										<template #title>
											Menu de premier niveau
										</template>
										<HeaderMenuItem>
											<a>Item</a>
										</HeaderMenuItem>
									</HeaderSubMenu>
								</headerMenuItem>
								<HeaderMenuItem>
									<a>Item</a>
								</HeaderMenuItem>
							</HeaderMenuSection>
						</HeaderBurgerMenu>
					</template>
				</HeaderBar>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup>
					import { HeaderBurgerMenu, HeaderBar, HeaderMenuSection, HeaderMenuItem, HeaderSubMenu } from '@cnamts/synapse'
				</script>
				`,
			},
		],
	},
}

export const Deep: Story = {
	args: {
		title: 'Menu de deuxième niveau',
	},
	render: (args) => {
		return {
			components: { HeaderMenuItem, HeaderBurgerMenu, HeaderBar, HeaderSubMenu, HeaderMenuSection },
			setup() {
				return { args }
			},
			template: `
			<Template>
				<HeaderBar>
					<template #menu>
						<HeaderBurgerMenu>
							<HeaderMenuSection>
								<HeaderMenuItem>
									<a>Item 1</a>
								</HeaderMenuItem>
								<HeaderMenuItem>
									<a>Item 2</a>
								</HeaderMenuItem>
								<headerMenuItem>
									<HeaderSubMenu>
										<template #title>
											Menu de premier niveau
										</template>
										<HeaderMenuItem>
											<a>Item 2.1</a>
										</HeaderMenuItem>
										<HeaderMenuItem>
											<a>Item 2.2</a>
										</HeaderMenuItem>
										<HeaderMenuItem>
											<HeaderSubMenu v-bind="args">
												<template #title>
													{{ args.title }}
												</template>
												<HeaderMenuItem>
													<a>Item 3.1</a>
												</HeaderMenuItem>
												<HeaderMenuItem>
													<a>Item 3.2</a>
												</HeaderMenuItem>
											</HeaderSubMenu>
										</HeaderMenuItem>
									</HeaderSubMenu>
								</headerMenuItem>
								<HeaderMenuItem>
									<a>Item 3</a>
								</HeaderMenuItem>
							</HeaderMenuSection>
						</HeaderBurgerMenu>
					</template>
				</HeaderBar>
			</Template>
			`,
		}
	},
	play: async ({ canvasElement }) => {
		const menuBtn = canvasElement.querySelector('button')
		await new Promise(resolve => setTimeout(resolve, 1000))
		await menuBtn!.click()
		await new Promise(resolve => setTimeout(resolve, 500))
		const subMenuBtn = document.querySelector<HTMLElement>('.sub-menu-btn')
		await subMenuBtn!.click()
		await new Promise(resolve => setTimeout(resolve, 500))
		const subMenuBtn2 = document.querySelector<HTMLElement>('.sub-menu .sub-menu .sub-menu-btn')
		await subMenuBtn2!.click()
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
										<a>Item 1</a>
									</HeaderMenuItem>
									<HeaderMenuItem>
										<a>Item 2</a>
									</HeaderMenuItem>
									<headerMenuItem>
										<HeaderSubMenu>
											<template #title>
												Menu de premier niveau
											</template>
											<HeaderMenuItem>
												<a>Item 2.1</a>
											</HeaderMenuItem>
											<HeaderMenuItem>
												<a>Item 2.2</a>
											</HeaderMenuItem>
											<HeaderMenuItem>
												<HeaderSubMenu>
													<template #title>
														Menu de deuxième niveau
													</template>
													<HeaderMenuItem>
														<a>Item 3.1</a>
													</HeaderMenuItem>
													<HeaderMenuItem>
														<a>Item 3.2</a>
													</HeaderMenuItem>
												</HeaderSubMenu>
											</HeaderMenuItem>
										</HeaderSubMenu>
									</headerMenuItem>
									<HeaderMenuItem>
										<a>Item 3</a>
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
					import { HeaderBurgerMenu, HeaderBar, HeaderMenuSection, HeaderMenuItem, HeaderSubMenu } from '@cnamts/synapse'
				</script>
				`,
			},
		],
	},
}
