import { VExpansionPanels, VExpansionPanel, VExpansionPanelTitle, VExpansionPanelText, VDataTable, VIcon } from 'vuetify/components'
import type { StoryObj } from '@storybook/vue3'
import { AccessibiliteItems } from './AccessibiliteItems'
import { mdiCheckboxMarkedCircle, mdiHelpCircle, mdiLink } from '@mdi/js'

const checkIcon = mdiCheckboxMarkedCircle
const helpICon = mdiHelpCircle
const linkICon = mdiLink

export default {
	title: 'Components/DownloadBtn/Accessibilite',
}

export const AccessibilitePanel: StoryObj = {

	render: () => {
		return {
			components: { VExpansionPanels, VExpansionPanel, VExpansionPanelTitle, VExpansionPanelText, VDataTable, VIcon },
			setup() {
				const icon = checkIcon

				return { AccessibiliteItems, icon, helpICon, linkICon }
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
										<template v-slot:item.link="{ item }">
											<span></span>
										</template>

											
									<template v-slot:item.solution="{ item }">
										
										</template>

										   <template v-slot:bottom="{ items }" >
										   <div v-for="element in items[0].solution" style="margin-top:15px;">
										    <p style="font-weight: bold;">Méthodologie du test : <a href="items[0].link" target="blank" ><VIcon :icon="linkICon" /></a></p>
							
											<p>{{element.info1}}</p>
											<p>{{element.info2}}</p>
											<p>{{element.info3}}</p>

											</div>
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
