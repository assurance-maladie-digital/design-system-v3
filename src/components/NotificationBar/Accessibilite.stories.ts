import { VIcon } from 'vuetify/components'
import type { StoryObj } from '@storybook/vue3'
import { mdiCheckboxMarkedCircle } from '@mdi/js'

const checkIcon = mdiCheckboxMarkedCircle

export default {
	title: 'Composants/Feedback/NotificationBar/Accessibilité',
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
				  <p>Rapport d’audit manuel : <a href="/audits/NotificationBar.xlsx" style="color:#0C41BD;">Voir le rapport</a></p>
				  <p style="color: grey; font-size: 14px">Correctifs en cours (<a href="https://github.com/assurance-maladie-digital/design-system/issues/4029" target="_blank" style="color:#0C41BD;">issue #4029</a>)</p>
			  </div>
            `,
		}
	},
	tags: ['!dev'],
}
