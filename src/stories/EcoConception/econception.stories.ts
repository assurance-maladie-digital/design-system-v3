import { VExpansionPanels, VExpansionPanel } from 'vuetify/components'
import type { StoryObj } from '@storybook/vue3'
import { ecoDesignItems } from '@/stories/EcoConception/ecoDesignItems'

export default {
	title: 'Éco-conception/Introduction',
}

export const EcoPanel: StoryObj = {
	render: () => {
		return {
			components: { VExpansionPanels, VExpansionPanel },
			setup() {
				return { ecoDesignItems }
			},
			template: `
				<v-expansion-panels>
					<v-expansion-panel
						v-for="(item, index) in ecoDesignItems"
						:key="index"
						:text="item.description"
						:title="item.title"
						variant="accordion"
					></v-expansion-panel>
				</v-expansion-panels>
			`,
		}
	},
	tags: ['!dev'],
}
