import { VIcon } from 'vuetify/components'
import type { StoryObj } from '@storybook/vue3'
import { mdiCheckboxMarkedCircle } from '@mdi/js'

const checkIcon = mdiCheckboxMarkedCircle

export default {
	title: 'Composants/Filtres/FiltersSideBar/Accessibilité',
}

export const Legende: StoryObj = {
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
			   
		 
			  </div>
			  <div class="mt-4">
				  <p>Rapport d’audit manuel : <a href="/audits/FilterSideBar.xlsx" style="color:#0C41BD;">Voir le rapport</a></p>
				  <p style="color: grey; font-size: 14px">Correctifs associés (<a href="https://github.com/assurance-maladie-digital/design-system-v3/issues/913" target="_blank" style="color:#0C41BD;">issue #913</a>)</p>
			  </div>
            `,
		}
	},
	tags: ['!dev'],
}
