import HeaderMenu from './HeaderComplexMenu.vue'
import HeaderBar from '../HeaderBar.vue'
import type { Meta, StoryObj } from '@storybook/vue3'
import HeaderMenuSection from './HeaderMenuSection/HeaderMenuSection.vue'
import HeaderSubMenu from './HeaderSubMenu/HeaderSubMenu.vue'
import HeaderMenuItem from './HeaderMenuItem/HeaderMenuItem.vue'
import { VBtn } from 'vuetify/components'

const meta = {
	title: 'Components/HeaderBar/HeaderComplexMenu',
	component: HeaderMenu,
	parameters: {
		layout: 'fullscreen',
	},
} satisfies Meta<typeof HeaderMenu>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {},
	render: (args) => {
		return {
			components: { HeaderMenu, HeaderBar },
			setup() {
				return { args }
			},
			template: `
				<HeaderBar>
					<template #menu>
						<HeaderMenu>
							<p>lorem ipsum</p>
						</HeaderMenu>
					</template>
				</HeaderBar>
			`,
		}
	},
}

export const Populated: Story = {
	args: {},
	render: (args) => {
		return {
			components: { HeaderMenuItem, HeaderMenu, HeaderBar, HeaderSubMenu, HeaderMenuSection, VBtn },
			setup() {
				return { args }
			},
			template: `
				<HeaderBar>
					<template #menu>
						<HeaderMenu>
							<HeaderMenuSection title="section 1">
								<HeaderMenuItem>
									<a>Item 1</a>
								</HeaderMenuItem>
								<HeaderMenuItem>
									<a>Item 2</a>
								</HeaderMenuItem>
								<headerMenuItem>
									<HeaderSubMenu>
										<template #title>
											Menu de premier niveau 1
										</template>
										<HeaderMenuSection title="Section">
											<HeaderMenuItem>
												<a>Item</a>
											</HeaderMenuItem>
											<HeaderSubMenu>
												<template #title>
													Menu de deuxième niveau 1
												</template>
												<HeaderMenuItem>
													<a>Item</a>
												</HeaderMenuItem>
											</HeaderSubMenu>
										</HeaderMenuSection>
									</HeaderSubMenu>
								</headerMenuItem>
							</HeaderMenuSection>
							<HeaderMenuSection title="section 2">
								<headerMenuItem>
									<HeaderSubMenu>
										<template #title>
											Menu de premier niveau 2
										</template>
										<HeaderMenuItem>
											<a>Item 1</a>
										</HeaderMenuItem>
										<HeaderMenuItem>
											<HeaderSubMenu>
												<template #title>
													Menu de deuxième niveau 2
												</template>
												<HeaderMenuItem>
													<a>Item 1</a>
												</HeaderMenuItem>
											</HeaderSubMenu>
										</HeaderMenuItem>
										<HeaderMenuItem>
											<HeaderSubMenu>
												<template #title>
													Menu de deuxième niveau 3
												</template>
												<HeaderMenuSection title="section 1">
													<HeaderMenuItem>
														<a>Item 1</a>
													</HeaderMenuItem>
												</HeaderMenuSection>
											</HeaderSubMenu>
										</HeaderMenuItem>
									</HeaderSubMenu>
								</headerMenuItem>
								<HeaderMenuItem>
									<a>Item 3</a>
								</HeaderMenuItem>
							</HeaderMenuSection>
							<div class="pa-4">
								<p class="font-weight-bold">Veillez vous connecter</p>
								<VBtn variant="tonal" class="mt-4 font-weight-medium" color="primary">Je me connecte</VBtn>
							</div>
						</HeaderMenu>
					</template>
				</HeaderBar>
			`,
		}
	},
}
