import { VExpansionPanels, VExpansionPanel, VExpansionPanelTitle, VExpansionPanelText, VDataTable, VIcon } from 'vuetify/components'
import type { StoryObj } from '@storybook/vue3'
import { AccessibiliteItemsIndeterminate, AccessibiliteItemsValidated } from './AccessibiliteItems'
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

				return { AccessibiliteItemsIndeterminate, icon, helpICon, linkICon }
			},
			template: `
				<div style="display:flex; margin-bottom: 10px; justify-content: end; align-items: center;">
			<div>Sources : </div>
			<div style="margin-left: 4px;">
			<v-btn variant="tonal" color="grey" size="x-small" style="margin: 4px;" rounded>Audit </v-btn>
			<v-btn variant="tonal" color="red" size="x-small" style="margin: 4px;" rounded>Tanaguru </v-btn>
			</div>
			</div> 

				<v-expansion-panels value="opened" multiple>
					<v-expansion-panel
						v-for="(item, index) in AccessibiliteItemsIndeterminate"
						:key="index" style="background-color: rgba(42, 96, 158, 0.1); margin-bottom: 10px;">
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
										<template v-slot:item.expertise="{ item }">
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

export const AccessibilitePanelValidated: StoryObj = {

	render: () => {
		return {
			components: { VExpansionPanels, VExpansionPanel, VExpansionPanelTitle, VExpansionPanelText, VDataTable, VIcon },
			setup() {
				const icon = checkIcon

				return { AccessibiliteItemsValidated, icon, helpICon, linkICon }
			},
			template: `
			
			<div style="display:flex; margin-bottom: 10px; justify-content: end; align-items: center;">
			<div>Sources : </div>
			<div style="margin-left: 4px;">
			<v-btn variant="tonal" color="grey" size="x-small" style="margin: 4px;" rounded>Audit </v-btn>
			<v-btn variant="tonal" color="red" size="x-small" style="margin: 4px;" rounded>Tanaguru </v-btn>
			</div>
			</div> 
				<v-expansion-panels value="opened" multiple>
					<v-expansion-panel
						v-for="(item, index) in AccessibiliteItemsValidated"
						:key="index" style="background-color: rgba(53,135,0,0.1); margin-bottom: 10px;">
						<v-expansion-panel-title disable-icon-rotate>{{ item.title }}
						<template v-slot:actions>
          
			<VIcon color="green" :icon="icon" />
          </template>
						</v-expansion-panel-title>
						
						<v-expansion-panel-text>


				<v-expansion-panels>

						<v-expansion-panel >
						<v-expansion-panel-title style="font-weight: bold;" collapse-icon="mdi-minus" expand-icon="mdi-plus">{{ item.subtitle}} 
					
						</v-expansion-panel-title>
						
						<v-expansion-panel-text >
							<v-data-table
								:items="item.items"
								disable-pagination
								      hide-default-footer
								hide-default-header>
										<template v-slot:item.expertise="{ item }">
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
