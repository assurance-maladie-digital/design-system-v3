import { VExpansionPanels, VExpansionPanel, VExpansionPanelTitle, VExpansionPanelText, VDataTable, VIcon } from 'vuetify/components'
import type { StoryObj } from '@storybook/vue3'
import { AccessibiliteItems } from './AccessibiliteItems'
import { mdiCheckboxMarkedCircle, mdiHelpCircle } from '@mdi/js'

const checkIcon = mdiCheckboxMarkedCircle
const helpICon = mdiHelpCircle
export default {
	title: 'Components/DownloadBtn/Accessibilite',
}

export const AccessibilitePanel: StoryObj = {

	render: () => {
		return {
			components: { VExpansionPanels, VExpansionPanel, VExpansionPanelTitle, VExpansionPanelText, VDataTable, VIcon },
			setup() {
				const icon = checkIcon

				return { AccessibiliteItems, icon, helpICon }
			},
			template: `
				<v-expansion-panels value="opened" multiple >
					<v-expansion-panel
						v-for="(item, index) in AccessibiliteItems"
						:key="index">
						<v-expansion-panel-title>{{ item.title }}</v-expansion-panel-title>
						
						<v-expansion-panel-text>


				<v-expansion-panels>

						<v-expansion-panel >
						<v-expansion-panel-title style="font-weight: bold;">{{ item.subtitle}} </v-expansion-panel-title>
						
						<v-expansion-panel-text >
							<v-data-table
								:items="item.items"
								disable-pagination
								hide-default-footer
								hide-default-header>
										<template v-if="item?.items[index]?.expertise === 'design'" v-slot:item.expertise="{ item }">
											<VIcon color="green" :icon="icon" />
										</template>
										<template v-else v-slot:item.expertise="{ item }">
											<span></span>
										</template>

											<template v-if="item?.items[index]?.solution != ''" v-slot:item.solution="{ item }">
											<VIcon :icon="helpICon" /><span style="font-style: italic;" >{{item.solution}} </span>
										</template>
										<template v-else v-slot:item.expertise="{ item }">
											<span></span>
										</template>
										
							</v-data-table>
						</v-expansion-panel-text>
					</v-expansion-panel>

				</v-expansion-panels>





						
						</v-expansion-panel-text>
					</v-expansion-panel>
				</v-expansion-panels>
			`,
		}
	},
	tags: ['!dev'],
}

export const Icon: StoryObj = {
	args: {
		icon: checkIcon,
	},
	render: (args) => {
		return {
			components: { VIcon },
			setup() {
				return { args }
			},
			template: `
				
						<div>
							<VIcon color="green" :icon="args.icon" /> Critères prise en charge par l'équipe Design System 
							<br/>

						</div>
				
			`,
		}
	},
	tags: ['!dev'],
}
