import { VIcon } from 'vuetify/components'
import type { StoryObj } from '@storybook/vue3'
import { mdiCheckboxMarkedCircle } from '@mdi/js'
const checkIcon = mdiCheckboxMarkedCircle

export default {
	title: 'Composants/Formulaires/Selects/SelectBtnField/Accessibilité',
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
			  	<div class="mt-4">
				  <p>Rapport d’audit manuel : <a href="/audits/SelectBtnField.xlsx" style="color:#0C41BD;">Voir le rapport</a></p>
				  <p style="color: grey; font-size: 14px">Correctifs associés (<a href="https://github.com/assurance-maladie-digital/design-system-v3/issues/916" target="_blank" style="color:#0C41BD;">issue #916</a>)</p>
			  </div>
            `,
		}
	},
	tags: ['!dev'],
}
