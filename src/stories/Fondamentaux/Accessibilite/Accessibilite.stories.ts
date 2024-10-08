import { VExpansionPanels, VExpansionPanel, VExpansionPanelTitle, VExpansionPanelText, VDataTable } from 'vuetify/components'
import type { StoryObj } from '@storybook/vue3'
import { AccessibiliteItems } from './AccessibiliteItems'

export default {
	title: 'Fondamentaux/Accessibilite',
}

export const AccessibilitePanel: StoryObj = {
	render: () => {
		return {
			components: { VExpansionPanels, VExpansionPanel, VExpansionPanelTitle, VExpansionPanelText, VDataTable },
			setup() {
				return { AccessibiliteItems }
			},
			template: `
				<v-expansion-panels>
					<v-expansion-panel
						v-for="(item, index) in AccessibiliteItems"
						:key="index"
					>
						<v-expansion-panel-title>{{ item.title }}</v-expansion-panel-title>
						<v-expansion-panel-text>
							<v-data-table
								:items="item.items"
								disable-pagination
								hide-default-footer
							/>
						</v-expansion-panel-text>
					</v-expansion-panel>
				</v-expansion-panels>
			`,
		}
	},
	tags: ['!dev'],
}